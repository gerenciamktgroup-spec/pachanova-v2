export interface PaymentOrder {
  orderId: string;
  userId: string;
  quantity: number;
  unitPrice: number;
  totalAmount?: number;
  metadata?: Record<string, any>;
}

export interface PaymentProvider {
  createPreference(order: PaymentOrder): Promise<{ id: string; init_point: string }>;
  getPaymentStatus(paymentId: string): Promise<string>; // 'approved', 'pending', 'rejected'
  verifyWebhookSignature(headers: Record<string, string>, rawBody: string): boolean;
  simulateApprovedPayment(orderId: string): Promise<void>;
  simulateRejectedPayment(orderId: string): Promise<void>;
}
