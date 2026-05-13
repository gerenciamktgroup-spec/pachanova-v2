export interface ValuationProvider {
  getAnnualValuation(year: number): Promise<{ pricePerSqm: number; pricePerToken: number }>;
}

export class DemoValuationProvider implements ValuationProvider {
  async getAnnualValuation(year: number) {
    return { pricePerSqm: 84.00, pricePerToken: 8.40 };
  }
}
