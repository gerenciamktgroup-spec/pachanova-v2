const orq = require('../orchestrator_agent.cjs');

async function test() {
  console.log("Testing Fideicomiso Multi-Sig Task...");
  try {
    const result = await orq.runFideicomisoMultiSigTask("test-op-1", "DEMO_EMISSION", "PNC-PAR-001", 500000, 2, ["fiduciario", "admin"]);
    console.log("Result:", result);
    if (result.success && result.attest) {
      console.log("✅ Fideicomiso Execution successful!");
    } else {
      console.log("❌ Fideicomiso Execution failed!");
    }
  } catch(e) {
    console.error("❌ Exception during Fideicomiso Execution:", e);
  }
}

test();
