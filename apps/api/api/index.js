// Stub - Vercel detecta api/index.mjs automaticamente cuando existe
// Este archivo no se usa si index.mjs existe
exports.default = (req, res) => res.status(503).json({ error: 'use index.mjs' })
