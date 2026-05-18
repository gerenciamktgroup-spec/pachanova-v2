import { Hono } from 'hono'

export const demoRouter = new Hono()

// --- Datos mock ---
const MOCK_PROPERTIES = [
  {
    id: 'prop-001',
    name: 'Torre Catalinas Norte',
    location: 'Buenos Aires, Argentina',
    type: 'Oficinas Premium',
    totalTokens: 10000,
    pricePerToken: 100,
    currency: 'USD',
    yield: 8.5,
    status: 'active',
    imageUrl: '/demo/assets/torre-catalinas.jpg',
  },
  {
    id: 'prop-002',
    name: 'Complejo Nordelta Business',
    location: 'Tigre, Buenos Aires',
    type: 'Mixto Residencial-Comercial',
    totalTokens: 5000,
    pricePerToken: 200,
    currency: 'USD',
    yield: 7.2,
    status: 'active',
    imageUrl: '/demo/assets/nordelta.jpg',
  },
  {
    id: 'prop-003',
    name: 'Puerto Madero Loft',
    location: 'Puerto Madero, CABA',
    type: 'Residencial Luxury',
    totalTokens: 2000,
    pricePerToken: 500,
    currency: 'USD',
    yield: 6.8,
    status: 'coming_soon',
    imageUrl: '/demo/assets/puerto-madero.jpg',
  },
]

const MOCK_INVESTORS = [
  {
    id: 'inv-001',
    name: 'Inversora Demo S.A.',
    kycStatus: 'approved',
    balance: 50000,
    currency: 'USD',
    tokens: 150,
    joinedAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'inv-002',
    name: 'Fondo Institucional Demo',
    kycStatus: 'approved',
    balance: 200000,
    currency: 'USD',
    tokens: 800,
    joinedAt: '2026-02-01T09:30:00Z',
  },
]

const MOCK_TOKENS = [
  { id: 'tok-001', propertyId: 'prop-001', symbol: 'PACHA-CAT', amount: 150, price: 100, currency: 'USD', ownerId: 'inv-001' },
  { id: 'tok-002', propertyId: 'prop-002', symbol: 'PACHA-NOR', amount: 200, price: 200, currency: 'USD', ownerId: 'inv-002' },
]

const MOCK_ORDERS = [
  { id: 'ord-001', type: 'sell', symbol: 'PACHA-CAT', amount: 50, price: 105, currency: 'USD', status: 'open', sellerId: 'inv-001', createdAt: new Date().toISOString() },
  { id: 'ord-002', type: 'buy',  symbol: 'PACHA-NOR', amount: 100, price: 198, currency: 'USD', status: 'open', buyerId: 'inv-002', createdAt: new Date().toISOString() },
]

// --- Rutas ---
demoRouter.get('/properties', (c) => c.json({ ok: true, data: MOCK_PROPERTIES }))

demoRouter.get('/properties/:id', (c) => {
  const prop = MOCK_PROPERTIES.find(p => p.id === c.req.param('id'))
  return prop ? c.json({ ok: true, data: prop }) : c.json({ ok: false, error: 'Not found' }, 404)
})

demoRouter.get('/investors', (c) => c.json({ ok: true, data: MOCK_INVESTORS }))

demoRouter.get('/tokens', (c) => c.json({ ok: true, data: MOCK_TOKENS }))

demoRouter.get('/orders', (c) => c.json({ ok: true, data: MOCK_ORDERS }))

demoRouter.post('/kyc', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  return c.json({
    ok: true,
    message: 'KYC aprobado (simulación)',
    investorId: 'inv-demo-' + Date.now(),
    name: body.name ?? 'Inversor Demo',
    kycStatus: 'approved',
    approvedAt: new Date().toISOString(),
  })
})

demoRouter.post('/deposit', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const amount = Number(body.amount ?? 1000)
  return c.json({
    ok: true,
    message: 'Depósito simulado exitoso',
    amount,
    currency: body.currency ?? 'USD',
    newBalance: 50000 + amount,
    txId: 'demo-tx-' + Date.now(),
    createdAt: new Date().toISOString(),
  })
})

demoRouter.post('/buy', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const amount = Number(body.amount ?? 10)
  const price = Number(body.price ?? 100)
  return c.json({
    ok: true,
    message: 'Compra simulada exitosa',
    symbol: body.symbol ?? 'PACHA-CAT',
    amount,
    price,
    total: amount * price,
    currency: 'USD',
    txId: 'demo-buy-' + Date.now(),
    createdAt: new Date().toISOString(),
  })
})

demoRouter.post('/sell', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const amount = Number(body.amount ?? 10)
  const price = Number(body.price ?? 105)
  return c.json({
    ok: true,
    message: 'Orden de venta simulada creada',
    symbol: body.symbol ?? 'PACHA-CAT',
    amount,
    price,
    orderId: 'demo-ord-' + Date.now(),
    status: 'open',
    createdAt: new Date().toISOString(),
  })
})

demoRouter.get('/reset', (c) => c.json({
  ok: true,
  message: 'Estado demo reiniciado (simulación)',
  ts: new Date().toISOString(),
}))
