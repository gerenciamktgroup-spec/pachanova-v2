import { ethers } from 'ethers';

// Singleton provider instance
const providerUrl = process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com';
export const provider = new ethers.JsonRpcProvider(providerUrl);

// Optional: Admin wallet for executing privileged transactions
const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY;
export const adminWallet = adminPrivateKey ? new ethers.Wallet(adminPrivateKey, provider) : null;

// Contract Addresses (load from env)
export const PACHA_TOKEN_ADDRESS = process.env.PACHA_TOKEN_ADDRESS || '';
export const DIVIDEND_DISTRIBUTOR_ADDRESS = process.env.DIVIDEND_DISTRIBUTOR_ADDRESS || '';

// Basic ABIs
const PACHA_TOKEN_ABI = [
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function mint(address to, uint256 amount) external",
  "function isIssuanceReady() view returns (bool)",
  "function setIssuanceReady(bytes32 sunarpHash) external"
];

const DIVIDEND_DISTRIBUTOR_ABI = [
  "function distributeDividend(uint256 amount) external",
  "function claimDividend(uint256 dividendId) external"
];

export const getPachaTokenContract = (signerOrProvider: ethers.Signer | ethers.Provider = provider) => {
  if (!PACHA_TOKEN_ADDRESS) throw new Error("PACHA_TOKEN_ADDRESS not configured");
  return new ethers.Contract(PACHA_TOKEN_ADDRESS, PACHA_TOKEN_ABI, signerOrProvider);
};

export const getDividendDistributorContract = (signerOrProvider: ethers.Signer | ethers.Provider = provider) => {
  if (!DIVIDEND_DISTRIBUTOR_ADDRESS) throw new Error("DIVIDEND_DISTRIBUTOR_ADDRESS not configured");
  return new ethers.Contract(DIVIDEND_DISTRIBUTOR_ADDRESS, DIVIDEND_DISTRIBUTOR_ABI, signerOrProvider);
};

/**
 * Validates if an address is a valid EVM address
 */
export const isValidAddress = (address: string): boolean => {
  return ethers.isAddress(address);
};

/**
 * Gets token balance for a specific address
 */
export const getTokenBalance = async (address: string): Promise<string> => {
  try {
    const contract = getPachaTokenContract();
    const balance = await contract.balanceOf(address);
    return ethers.formatUnits(balance, 0); // PACHA has 0 decimals
  } catch (error) {
    console.error("Error fetching balance:", error);
    return "0";
  }
};
