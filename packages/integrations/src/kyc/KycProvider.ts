export interface KycProvider {
  isKycApproved(userId: string): Promise<boolean>;
  getKycStatus(userId: string): Promise<string>;
}

export class DemoKycProvider implements KycProvider {
  async isKycApproved(userId: string) {
    // Para demo, podemos simular segun el ID o simplemente devolver true en offline
    return true; 
  }
  
  async getKycStatus(userId: string) {
    return "approved";
  }
}
