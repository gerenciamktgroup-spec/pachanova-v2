import { ethers } from 'ethers';
import { adminWallet } from './ethers';

export const ORACLE_CONTRACT_ADDRESS = process.env.ORACLE_CONTRACT_ADDRESS || '';

const ORACLE_ABI = [
  "function updateNav(string memory projectCode, uint256 newNav) external",
  "function getLatestNav(string memory projectCode) external view returns (uint256 nav, uint256 timestamp)"
];

/**
 * Service to push real-world appraisals to the smart contract Oracle.
 */
export const updateOracleNav = async (projectCode: string, newNavInUsd: number) => {
  if (!adminWallet) throw new Error("Admin wallet not configured");
  if (!ORACLE_CONTRACT_ADDRESS) throw new Error("Oracle address not configured");

  const contract = new ethers.Contract(ORACLE_CONTRACT_ADDRESS, ORACLE_ABI, adminWallet);
  
  try {
    // Nav stored as integers (e.g. 6 decimals for USDC comparison)
    const formattedNav = ethers.parseUnits(newNavInUsd.toString(), 6);
    
    console.log(`Pushing new NAV to Oracle: ${projectCode} -> $${newNavInUsd}`);
    const tx = await contract.updateNav(projectCode, formattedNav);
    await tx.wait();
    
    return { success: true, txHash: tx.hash };
  } catch (error) {
    console.error("Failed to update oracle:", error);
    return { success: false, error };
  }
};

/**
 * Endpoint simulator to fetch from external real estate APIs (e.g., Zillow, local providers).
 */
export const fetchExternalAppraisal = async (projectCode: string): Promise<number> => {
  // Mock external API call
  console.log(`Fetching appraisal for ${projectCode} from external API...`);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock valuation based on project
  if (projectCode === 'AET-002') return 185000;
  return 100000;
};
