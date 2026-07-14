// KYC Provider interface - allows swapping between simulated and real providers
export interface KycVerificationResult {
  status: 'approved' | 'pending' | 'rejected';
  externalId?: string;
  reviewAnswer?: string;
  rejectType?: string;
  metadata?: Record<string, unknown>;
}

export interface KycProvider {
  name: string;
  isSimulated: boolean;
  createVerification(investorId: string, data: { firstName: string; lastName: string; email: string; documentType?: string }): Promise<{ applicantId: string; sdkToken?: string; webSdkLink?: string }>;
  getVerificationStatus(applicantId: string): Promise<KycVerificationResult>;
  handleWebhook(payload: unknown, signature: string): Promise<{ investorId: string; result: KycVerificationResult } | null>;
}
