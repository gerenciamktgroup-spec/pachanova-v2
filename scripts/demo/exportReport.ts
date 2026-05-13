import fs from 'fs';
import path from 'path';

const DOCS_TO_EXPORT = [
  'DEMO_ACCEPTANCE_REPORT.md',
  'INTEGRATION_READINESS_REPORT.md',
  'RELEASE_CANDIDATE_STATUS.md',
  'PROJECT_INVENTORY_AND_GAP_ANALYSIS.md',
  'docs/DEMO_OPERATOR_RUNBOOK.md',
  'docs/DEMO_PRESENTATION_SCRIPT.md',
  'docs/DEMO_TROUBLESHOOTING.md',
  'docs/DEMO_RESET_AND_SEED.md',
  'docs/EXTERNAL_INTEGRATIONS_BACKLOG.md',
  'docs/STAGING_ENTRY_CRITERIA.md'
];

function runExport() {
  const rootDir = path.resolve(__dirname, '../..');
  const artifactsDir = path.join(rootDir, 'artifacts', 'demo-rc');

  if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir, { recursive: true });
  }

  let indexContent = '# PachaNova v2.0 - Release Candidate Docs Index\n\n';

  for (const doc of DOCS_TO_EXPORT) {
    const srcPath = path.join(rootDir, doc);
    if (fs.existsSync(srcPath)) {
      const fileName = path.basename(doc);
      const destPath = path.join(artifactsDir, fileName);
      fs.copyFileSync(srcPath, destPath);
      indexContent += `- [${fileName}](./${fileName})\n`;
      console.log(`✅ Exportado: ${fileName}`);
    } else {
      console.warn(`⚠️ Archivo no encontrado: ${doc}`);
    }
  }

  fs.writeFileSync(path.join(artifactsDir, 'INDEX.md'), indexContent);
  console.log('✅ artifacts/demo-rc/INDEX.md generado.');

  const manifestContent = `# Demo Release Package Manifest\n
- **Fecha/Hora:** ${new Date().toISOString()}
- **Versión:** PachaNova v2.0 Demo Mirror RC-Local
- **Veredicto:** RC Creado Exitosamente
- **Contenido Exportado:** Revisa \`artifacts/demo-rc/INDEX.md\`
`;
  
  fs.writeFileSync(path.join(rootDir, 'DEMO_RELEASE_PACKAGE_MANIFEST.md'), manifestContent);
  console.log('✅ DEMO_RELEASE_PACKAGE_MANIFEST.md generado.');
  console.log('🚀 Exportación completada con éxito.');
}

runExport();
