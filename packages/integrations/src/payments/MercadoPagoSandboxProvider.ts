import { PaymentProvider, PaymentOrder } from "./PaymentProvider";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { verifyMercadoPagoSignature } from "./verifyMercadoPagoSignature";

export class MercadoPagoSandboxProvider implements PaymentProvider {
  private client: MercadoPagoConfig;

  constructor(accessToken: string, private webhookSecret: string, private allowUnsigned: boolean = false) {
    this.client = new MercadoPagoConfig({ accessToken, options: { timeout: 5000 } });
  }

  async createPreference(order: PaymentOrder) {
    const preference = new Preference(this.client);
    const result = await preference.create({
      body: {
        items: [
          {
            id: 'PACHA_GENESIS',
            title: `PACHA Token - Genesis (${order.quantity} tokens)`,
            quantity: 1, // MP quantity is always 1 package
            unit_price: order.quantity * order.unitPrice,
            currency_id: 'USD',
          }
        ],
        external_reference: order.orderId,
        metadata: {
          userId: order.investorId,
          quantity: order.quantity,
          unitPrice: order.unitPrice,
          orderId: order.orderId,
          totalAmount: order.totalAmount || (order.quantity * order.unitPrice),
          ...order.metadata
        },
        auto_return: 'approved',
      }
    });
    return { id: result.id!, init_point: result.sandbox_init_point! };
  }

  async getPaymentStatus(paymentId: string) {
    const payment = new Payment(this.client);
    const result = await payment.get({ id: paymentId });
    return result.status || 'pending';
  }

  async getPaymentDetails(paymentId: string) {
    const payment = new Payment(this.client);
    const result = await payment.get({ id: paymentId });
    return {
      id: result.id,
      status: result.status,
      external_reference: result.external_reference,
      transaction_amount: result.transaction_amount,
      currency_id: result.currency_id,
      metadata: result.metadata,
      payer: result.payer
    };
  }

  verifyWebhookSignature(headers: Record<string, string>, rawBody: string) {
    // In next.js app router we get headers from request.headers
    const xSignature = headers['x-signature'];
    const xRequestId = headers['x-request-id'];
    
    // Parse raw body to get data.id
    let dataId = "";
    try {
      const body = JSON.parse(rawBody);
      if (body.data && body.data.id) dataId = body.data.id;
    } catch(e) {}

    return verifyMercadoPagoSignature({
      xSignature: xSignature || "",
      xRequestId: xRequestId || "",
      dataId,
      secret: this.webhookSecret,
      allowUnsigned: this.allowUnsigned
    });
  }

  async simulateApprovedPayment(orderId: string) {
     throw new Error("simulateApprovedPayment is for DemoPaymentProvider, use real Sandbox MP UI instead");
  }

  async simulateRejectedPayment(orderId: string) {
     throw new Error("simulateRejectedPayment is for DemoPaymentProvider, use real Sandbox MP UI instead");
  }
}
