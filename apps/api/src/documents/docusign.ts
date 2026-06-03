export const requestDocuSignSignature = async (
  pdfFilePath: string,
  investorEmail: string,
  investorName: string
): Promise<{ envelopeId: string, status: string }> => {
  console.log(`[DocuSign] Mock API Call initiated for ${investorEmail}`);
  console.log(`[DocuSign] Uploading document: ${pdfFilePath}`);
  
  // Simulate network request to DocuSign eSignature REST API
  await new Promise(resolve => setTimeout(resolve, 1500));

  const mockEnvelopeId = `env-${Math.random().toString(36).substring(2, 15)}`;
  
  console.log(`[DocuSign] Envelope created: ${mockEnvelopeId}. Email sent to ${investorEmail}`);
  
  return {
    envelopeId: mockEnvelopeId,
    status: 'sent'
  };
};

export const checkSignatureStatus = async (envelopeId: string): Promise<string> => {
  // Mock status check
  // In a real app, this would be a webhook callback rather than polling
  const statuses = ['sent', 'delivered', 'completed'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};
