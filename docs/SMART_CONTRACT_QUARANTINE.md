# PachaNova V2.0 — Smart Contract Quarantine

Following the strategic principle **"todo en versión real nada simulación" (everything in real version, no simulation)**, this document establishes the quarantine policy for smart contracts and blockchain integrations.

## 1. Quarantine Status & Policy
All smart contracts inside `packages/contracts` are designated as **EXPERIMENTAL**.
They are **quarantined** and must not be used in the production or staging dashboard environment.

### Policy Rules:
1. **No Production Mainnet Deployment**: Under no circumstances should these contracts be deployed to a production EVM mainnet.
2. **Build and Test Isolation**: The package `@pachanova/contracts` is bypassed during general workspace builds (as shown in its `package.json` scripts: `build: echo 'Skipping forge build'`).
3. **No Blockchain-dependent Features in MVP UI**: The MVP must operate as a web platform with documentary fideicomiso (trust) backing. Do not surface blockchain tokenization as a prerequisite or active production feature on the main panels.
4. **Mock vs. Real Clarification**: If a wallet address is requested from the user, it must be saved purely as a metadata field for future registry use. No smart contract interactions or signatures are executed in the MVP web interface.

---

## 2. Quarantined Components

### 2.1 Contracts:
- `PachaNovaLandTrust.sol`: An experimental tokenization model representing lands under trust structures.

### 2.2 Deploy Scripts:
- `script/Deploy.s.sol`: Deployment script utilizing EVM mocks.

---

## 3. Requirements for Future Activation
Smart contracts will only be un-quarantined when:
1. **Foundry Integration**: A complete Foundry build and test coverage suite passes 100% of cases.
2. **Professional Security Audit**: An external solidity security audit has been performed and all critical/high vulnerabilities are resolved.
3. **Legal Compliance Review**: A qualified legal counsel reviews the tokenomics model and confirms compliance with securities regulations (specifically SUNARP, SMV, and SBS rules in Peru).
