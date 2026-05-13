import crypto from "crypto";

export function verifyMercadoPagoSignature(params: {
  xSignature: string;
  xRequestId: string;
  dataId: string;
  secret: string;
  allowUnsigned?: boolean;
}): boolean {
  if (params.allowUnsigned) {
    // In sandbox demo profile, this shouldn't be allowed, but we let the caller decide.
    // The validator explicitly blocks MP_WEBHOOK_ALLOW_UNSIGNED=true in sandbox mode.
    return true;
  }

  if (!params.xSignature || !params.xRequestId || !params.dataId || !params.secret) {
    return false;
  }

  try {
    const parts = params.xSignature.split(",");
    let ts = "";
    let hash = "";

    parts.forEach((part) => {
      const [key, value] = part.split("=");
      if (key && value) {
        if (key.trim() === "ts") ts = value.trim();
        if (key.trim() === "v1") hash = value.trim();
      }
    });

    if (!ts || !hash) return false;

    // Normalizing dataId if needed
    // MercadoPago docs specify that alphanumeric IDs might need to be lowercase
    const normalizedDataId = /^[a-zA-Z0-9]+$/.test(params.dataId) 
      ? params.dataId.toLowerCase() 
      : params.dataId;

    const manifest = `id:${normalizedDataId};request-id:${params.xRequestId};ts:${ts};`;
    
    const hmac = crypto.createHmac("sha256", params.secret);
    hmac.update(manifest);
    const digest = hmac.digest("hex");

    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hash));
  } catch (error) {
    return false;
  }
}
