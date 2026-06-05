const orq = require('../orchestrator_agent.cjs');

async function test() {
  console.log("Testing P2P Matching Task...");
  try {
    const result = await orq.runP2PMatchingTask("test-order-1", "buyer-1", "seller-2", "PNC-PAR-001", 10, 8.5);
    console.log("Result:", result);
    if (result.success && result.attest) {
      console.log("✅ P2P Matching successful!");
    } else {
      console.log("❌ P2P Matching failed!");
    }
  } catch(e) {
    console.error("❌ Exception during P2P Matching:", e);
  }
}

test();
