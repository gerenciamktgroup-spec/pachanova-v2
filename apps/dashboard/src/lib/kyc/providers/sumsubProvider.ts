import crypto from "crypto";
import { KycProvider, KycVerificationResult } from "../kycProvider";

export class SumsubProvider implements KycProvider {
  name = 'SUMSUB';
  isSimulated = false;

  constructor(
    private appToken: string,
    private secretKey: string
  ) {}

  private getHeaders(method: string, path: string, body: string = "") {
    if (!this.appToken || !this.secretKey) {
      throw new Error("Sumsub API credentials (SUMSUB_APP_TOKEN / SUMSUB_SECRET_KEY) are not configured.");
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const hmac = crypto.createHmac("sha256", this.secretKey);
    hmac.update(timestamp + method.toUpperCase() + path + body);
    const signature = hmac.digest("hex");

    return {
      "X-App-Token": this.appToken,
      "X-App-Access-Sig": signature,
      "X-App-Access-Ts": String(timestamp),
      "Accept": "application/json",
      "Content-Type": "application/json",
    };
  }

  async createVerification(
    investorId: string,
    data: { firstName: string; lastName: string; email: string; documentType?: string }
  ): Promise<{ applicantId: string; sdkToken?: string; webSdkLink?: string }> {
    const method = "POST";
    const path = "/resources/applicants?levelName=basic-kyc-level";
    const bodyObj = {
      externalUserId: investorId,
      email: data.email,
      info: {
        firstName: data.firstName,
        lastName: data.lastName,
      }
    };
    const bodyStr = JSON.stringify(bodyObj);

    const baseUrl = process.env.SUMSUB_API_URL || "https://api.sumsub.com";
    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: this.getHeaders(method, path, bodyStr),
      body: bodyStr
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Sumsub applicant creation failed: ${response.status} - ${errText}`);
    }

    const applicant = await response.json();
    const applicantId = applicant.id;

    // Get an SDK access token for the applicant
    const tokenPath = `/resources/accessTokens?userId=${investorId}&levelName=basic-kyc-level`;
    const tokenResponse = await fetch(`${baseUrl}${tokenPath}`, {
      method: "POST",
      headers: this.getHeaders("POST", tokenPath),
    });

    if (!tokenResponse.ok) {
      throw new Error(`Failed to generate Sumsub SDK token: ${tokenResponse.status}`);
    }

    const tokenData = await tokenResponse.json();

    return {
      applicantId,
      sdkToken: tokenData.token,
      webSdkLink: `https://apps.sumsub.com/idensic/l/#/orga/${applicantId}`,
    };
  }

  async getVerificationStatus(applicantId: string): Promise<KycVerificationResult> {
    const method = "GET";
    const path = `/resources/applicants/${applicantId}/status`;
    const baseUrl = process.env.SUMSUB_API_URL || "https://api.sumsub.com";

    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: this.getHeaders(method, path),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Sumsub status: ${response.status}`);
    }

    const data = await response.json();
    const reviewStatus = data.reviewStatus;
    const reviewResult = data.reviewResult;

    let status: 'approved' | 'pending' | 'rejected' = 'pending';
    if (reviewStatus === 'completed') {
      if (reviewResult?.reviewAnswer === 'GREEN') {
        status = 'approved';
      } else if (reviewResult?.reviewAnswer === 'RED') {
        status = 'rejected';
      }
    }

    return {
      status,
      externalId: applicantId,
      reviewAnswer: reviewResult?.reviewAnswer,
      rejectType: reviewResult?.rejectType,
      metadata: data,
    };
  }

  async handleWebhook(payload: any, signature: string): Promise<{ investorId: string; result: KycVerificationResult } | null> {
    // Verify payload signature if secret key is present
    if (this.secretKey && signature) {
      const calculatedHmac = crypto.createHmac("sha256", this.secretKey)
        .update(JSON.stringify(payload))
        .digest("hex");
      if (calculatedHmac !== signature) {
        throw new Error("Invalid webhook signature from Sumsub");
      }
    }

    const applicantId = payload.applicantId;
    const externalUserId = payload.externalUserId;
    const reviewResult = payload.reviewResult;

    if (!externalUserId) return null;

    let status: 'approved' | 'pending' | 'rejected' = 'pending';
    if (reviewResult?.reviewAnswer === 'GREEN') {
      status = 'approved';
    } else if (reviewResult?.reviewAnswer === 'RED') {
      status = 'rejected';
    }

    return {
      investorId: externalUserId,
      result: {
        status,
        externalId: applicantId,
        reviewAnswer: reviewResult?.reviewAnswer,
        rejectType: reviewResult?.rejectType,
        metadata: payload,
      }
    };
  }
}
