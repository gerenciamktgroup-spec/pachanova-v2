import { PaymentProvider, PaymentOrder } from "./PaymentProvider";

export class DemoPaymentProvider implements PaymentProvider {
  async createPreference(order: PaymentOrder) {
    return {
      id: "demo_pref_" + order.orderId,
      init_point: `/demo/sandbox/checkout?order=${order.orderId}`
    };
  }

  async getPaymentStatus(paymentId: string) {
    // Para demo local, podemos simular que si incluye 'approved' es aprobado
    if (paymentId.includes("approved")) return "approved";
    return "pending";
  }

  verifyWebhookSignature(headers: Record<string, string>, rawBody: string) {
    // Demo offline bypasses verification since there is no real secret
    return true; 
  }

  async simulateApprovedPayment(orderId: string) {
    console.log(`[DemoPaymentProvider] Simulating Approved Payment for ${orderId}`);
  }

  async simulateRejectedPayment(orderId: string) {
    console.log(`[DemoPaymentProvider] Simulating Rejected Payment for ${orderId}`);
  }
}
