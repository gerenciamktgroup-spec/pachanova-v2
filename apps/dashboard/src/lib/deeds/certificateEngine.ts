import crypto from "crypto";

export interface DigitalDeedCertificate {
  certificateSerial: string;
  sunarpPartida: string;
  fideicomisoSbsId: string;
  investorName: string;
  investorDniMasked: string;
  tokenCount: number;
  squareMetersEquivalent: number;
  landbankLocation: string;
  valuationUsd: number;
  issuanceDate: string;
  verificationHash: string;
  verificationUrl: string;
}

export function generateDigitalDeedCertificate({
  investorId,
  firstName,
  lastName,
  dni = "45******",
  tokenCount,
  pricePerTokenUsd = 8.40,
}: {
  investorId: string;
  firstName: string;
  lastName: string;
  dni?: string;
  tokenCount: number;
  pricePerTokenUsd?: number;
}): DigitalDeedCertificate {
  const squareMeters = tokenCount * 0.1; // 1 PACHA = 0.1 m²
  const valuation = tokenCount * pricePerTokenUsd;
  const issuanceDate = new Date().toISOString().split("T")[0];
  const sunarpPartida = "PROV-2025-08-11742";
  const fideicomisoSbsId = "FID-SBS-2025-PACHANOVA-01";
  const landbankLocation = "Lote Matriz San Bartolo, Lima, Perú (50,000 m²)";

  // Generate SHA-256 verification hash
  const rawPayload = `${investorId}:${sunarpPartida}:${tokenCount}:${squareMeters}:${issuanceDate}`;
  const verificationHash = crypto.createHash("sha256").update(rawPayload).digest("hex");
  const certificateSerial = `PNC-DEED-${verificationHash.slice(0, 8).toUpperCase()}`;
  const verificationUrl = `https://pachanova.com/verify/deed/${certificateSerial}`;

  return {
    certificateSerial,
    sunarpPartida,
    fideicomisoSbsId,
    investorName: `${firstName} ${lastName}`,
    investorDniMasked: dni,
    tokenCount,
    squareMetersEquivalent: Number(squareMeters.toFixed(2)),
    landbankLocation,
    valuationUsd: Number(valuation.toFixed(2)),
    issuanceDate,
    verificationHash,
    verificationUrl,
  };
}
