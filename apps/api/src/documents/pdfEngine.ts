import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

/**
 * Generates a PDF ownership certificate for an investor.
 */
export const generateOwnershipCertificate = async (
  investorName: string,
  walletAddress: string,
  projectCode: string,
  projectName: string,
  amountTokens: number,
  navValueUsd: number
): Promise<string> => {
  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 50px; color: #333; }
          .certificate { border: 5px solid #b8a17a; padding: 40px; text-align: center; border-radius: 10px; }
          .title { font-size: 36px; font-weight: bold; color: #b8a17a; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 2px; }
          .subtitle { font-size: 18px; color: #666; margin-bottom: 40px; }
          .content { font-size: 20px; line-height: 1.6; margin-bottom: 40px; }
          .highlight { font-weight: bold; color: #000; }
          .footer { margin-top: 50px; font-size: 14px; color: #999; }
          .signature-box { margin-top: 60px; display: flex; justify-content: space-around; }
          .signature-line { border-top: 1px solid #333; width: 200px; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="title">Certificado de Participación PACHA</div>
          <div class="subtitle">Propiedad Digital y Derechos Reales (ERC-3643)</div>
          
          <div class="content">
            Se certifica por el presente documento que<br/>
            <span class="highlight">${investorName}</span><br/>
            (Wallet: <span class="highlight">${walletAddress}</span>)<br/><br/>
            es titular de <span class="highlight">${amountTokens} tokens</span> representativos de derechos sobre el proyecto inmobiliario:<br/>
            <span class="highlight">${projectName} (${projectCode})</span>.<br/><br/>
            Valor liquidativo actual del activo respaldado (NAV): $${navValueUsd.toLocaleString()} USD.
          </div>
          
          <div class="signature-box">
            <div class="signature-line">Firma Fideicomiso</div>
            <div class="signature-line">Firma Inversor (e-Sign)</div>
          </div>
          
          <div class="footer">
            Generado automáticamente por PachaNova Protocol.<br/>
            Fecha: ${new Date().toLocaleDateString()}<br/>
            Documento Hash: [Pendiente de Anclaje IPFS]
          </div>
        </div>
      </body>
    </html>
  `;

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(htmlContent);

  const outDir = path.join(process.cwd(), 'public', 'certificates');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const fileName = `Certificate_${projectCode}_${walletAddress.slice(0, 6)}.pdf`;
  const filePath = path.join(outDir, fileName);

  await page.pdf({ path: filePath, format: 'A4' });
  await browser.close();

  return filePath;
};
