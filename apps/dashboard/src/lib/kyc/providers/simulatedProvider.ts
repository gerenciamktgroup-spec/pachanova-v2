import { KycProvider, KycVerificationResult } from "../kycProvider";

export class SimulatedProvider implements KycProvider {
  name = 'SIMULATED';
  isSimulated = true;

  async createVerification(
    investorId: string,
    data: { firstName: string; lastName: string; email: string; documentType?: string }
  ): Promise<{ applicantId: string; sdkToken?: string; webSdkLink?: string }> {
    const applicantId = `sim-applicant-${crypto.randomUUID()}`;
    return {
      applicantId,
      sdkToken: "simulated-sdk-token-123456",
      webSdkLink: `/demo/kyc-flow?applicantId=${applicantId}&investorId=${investorId}`,
    };
  }

  async getVerificationStatus(applicantId: string): Promise<KycVerificationResult> {
    return {
      status: 'approved',
      externalId: applicantId,
      reviewAnswer: 'GREEN',
      metadata: { simulated: true }
    };
  }

  async handleWebhook(payload: unknown, signature: string): Promise<{ investorId: string; result: KycVerificationResult } | null> {
    // In simulated mode, webhooks are triggered explicitly via our custom /api/demo/actions/kyc-status API
    return null;
  }
}
