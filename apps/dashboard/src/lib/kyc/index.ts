import { KycProvider } from "./kycProvider";
import { SimulatedProvider } from "./providers/simulatedProvider";
import { SumsubProvider } from "./providers/sumsubProvider";

export function getKycProvider(): KycProvider {
  const providerType = process.env.KYC_PROVIDER || "simulated";
  
  if (providerType.toLowerCase() === "sumsub") {
    return new SumsubProvider(
      process.env.SUMSUB_APP_TOKEN || "",
      process.env.SUMSUB_SECRET_KEY || ""
    );
  }
  
  return new SimulatedProvider();
}

export * from "./kycProvider";
export * from "./providers/simulatedProvider";
export * from "./providers/sumsubProvider";
