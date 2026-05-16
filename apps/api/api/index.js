// Generado por build.mjs - este archivo es sobreescrito en cada build
// Si ves esto, el build no se ejecutó correctamente
module.exports = (req, res) => {
  res.status(503).json({ error: 'Build not executed - run node build.mjs first' })
}
