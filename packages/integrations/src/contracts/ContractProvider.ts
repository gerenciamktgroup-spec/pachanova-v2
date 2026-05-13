export interface ContractProvider {
  getNetworkStatus(): Promise<string>;
  getTokenSupply(): Promise<number>;
  getInvestorBalance(walletAddress: string): Promise<number>;
  confirmRespaldo(params: { sunarpHash: string; notarioHash: string }): Promise<{ txHash: string; simulated: boolean }>;
  proposeEmission(params: { investorWallet: string; amount: number }): Promise<{ operationId: string; simulated: boolean }>;
  signOperation(params: { operationId: string; signerRole: string }): Promise<{ txHash: string; simulated: boolean }>;
  executeEmission(params: { operationId: string }): Promise<{ txHash: string; simulated: boolean }>;
  canTransfer(params: { from: string; to: string; amount: number }): Promise<boolean>;
}

export class DemoContractProvider implements ContractProvider {
  async getNetworkStatus() { return "SIMULATED"; }
  async getTokenSupply() { return 500000; }
  async getInvestorBalance(walletAddress: string) { return 0; }
  
  async confirmRespaldo(params: { sunarpHash: string; notarioHash: string }) {
    return { txHash: `demo_tx_respaldo_${Date.now()}`, simulated: true };
  }
  
  async proposeEmission(params: { investorWallet: string; amount: number }) {
    return { operationId: `demo_op_${Date.now()}`, simulated: true };
  }
  
  async signOperation(params: { operationId: string; signerRole: string }) {
    return { txHash: `demo_tx_sign_${Date.now()}`, simulated: true };
  }
  
  async executeEmission(params: { operationId: string }) {
    return { txHash: `demo_tx_exec_${Date.now()}`, simulated: true };
  }
  
  async canTransfer(params: { from: string; to: string; amount: number }) {
    return true; // Demo allows transfer if KYC is good, but that's checked in KYC Provider
  }
}
