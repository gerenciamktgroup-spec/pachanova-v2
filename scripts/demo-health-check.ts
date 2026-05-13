// Using native fetch
const port = process.env.PORT || 3004;
const BASE_URL = process.env.DEMO_BASE_URL || `http://localhost:${port}`;

const WEB_ROUTES = [
  '/demo',
  '/demo/walkthrough',
  '/demo/control-room',
  '/demo/events',
  '/demo/health',
  '/dashboard/investor',
  '/dashboard/admin',
  '/dashboard/fideicomiso',
];

const API_ROUTES = [
  '/api/demo/health',
  '/api/demo/integrations',
  '/api/token-balance',
  '/api/treasury',
  '/api/admin/users',
  '/api/admin/audit-logs',
  '/api/fideicomiso/status',
  '/api/oracle/valuation',
];

async function checkRoute(route: string) {
  try {
    const res = await fetch(`${BASE_URL}${route}`);
    const text = await res.text();
    let isJson = false;
    let data: any = null;
    
    try {
      data = JSON.parse(text);
      isJson = true;
    } catch(e) {}

    return {
      route,
      status: res.status,
      ok: res.ok,
      data: isJson ? data : null
    };
  } catch (error: any) {
    return {
      route,
      status: 500,
      ok: false,
      error: error.message
    };
  }
}

async function runHealthCheck() {
  console.log('--- PACHANOVA DEMO HEALTH CHECK ---');
  let hasErrors = false;

  console.log('\n🔍 Validating Web Routes...');
  for (const route of WEB_ROUTES) {
    const res = await checkRoute(route);
    if (!res.ok || res.status === 500) {
      console.error(`❌ FAIL: ${route} - Status: ${res.status}`);
      hasErrors = true;
    } else {
      console.log(`✅ OK: ${route}`);
    }
  }

  console.log('\n🔍 Validating API Routes...');
  for (const route of API_ROUTES) {
    const res = await checkRoute(route);
    if (!res.ok || res.status === 500) {
      console.error(`❌ FAIL: ${route} - Status: ${res.status}`);
      hasErrors = true;
      continue;
    }

    console.log(`✅ OK: ${route}`);
    
    // Specific validations
    if (route === '/api/admin/users') {
      const users = res.data?.users || [];
      const hasBalance = users.some((u: any) => u.tokenBalance !== undefined);
      if (!hasBalance) {
        console.error(`  ⚠️ ERROR: /api/admin/users is missing token_balance from balances`);
        hasErrors = true;
      }
    }
    
    if (route === '/api/admin/audit-logs') {
      const logs = res.data?.logs || [];
      const hasTimestamp = logs.some((l: any) => l.timestamp !== undefined);
      if (logs.length > 0 && !hasTimestamp) {
        console.error(`  ⚠️ ERROR: /api/admin/audit-logs missing timestamp`);
        hasErrors = true;
      }
    }

    if (route === '/api/token-balance') {
      const tokens = res.data?.balance?.tokens;
      const m2 = res.data?.balance?.m2;
      if (tokens !== undefined && m2 !== undefined) {
        if (parseFloat(m2) !== parseFloat(tokens) * 0.1) {
          console.error(`  ⚠️ ERROR: /api/token-balance m2 calculation is wrong`);
          hasErrors = true;
        }
      }
    }

    if (route === '/api/treasury') {
      const totalTokens = res.data?.treasury?.totalTokens;
      if (totalTokens !== 500000) {
        console.error(`  ⚠️ ERROR: /api/treasury totalTokens should be 500000`);
        hasErrors = true;
      }
    }

    if (route === '/api/oracle/valuation') {
      const pricePerSqm = parseFloat(res.data?.pricePerSqm);
      const pricePerToken = parseFloat(res.data?.pricePerToken);
      if (!isNaN(pricePerSqm) && !isNaN(pricePerToken)) {
        // approx check due to floating point
        if (Math.abs(pricePerToken - (pricePerSqm * 0.1)) > 0.01) {
          console.error(`  ⚠️ ERROR: /api/oracle/valuation price_per_token should be price_per_sqm * 0.1`);
          hasErrors = true;
        }
      }
    }

    if (route === '/api/demo/integrations') {
      const simulated = res.data?.simulated;
      if (simulated !== true) {
        console.error(`  ⚠️ ERROR: /api/demo/integrations simulated is not true`);
        hasErrors = true;
      }
    }
  }

  if (hasErrors) {
    console.error('\n❌ Health check failed.');
    process.exit(1);
  } else {
    console.log('\n✅ All health checks passed successfully.');
    process.exit(0);
  }
}

runHealthCheck();
