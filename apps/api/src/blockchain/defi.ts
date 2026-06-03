import { ethers } from 'ethers';
import { provider } from './ethers';

export const STAKING_CONTRACT_ADDRESS = process.env.STAKING_CONTRACT_ADDRESS || '';
export const LENDING_CONTRACT_ADDRESS = process.env.LENDING_CONTRACT_ADDRESS || '';

const STAKING_ABI = [
  "function rewardRate() view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function earned(address account) view returns (uint256)"
];

const LENDING_ABI = [
  "function calculateDebt(address user) view returns (uint256)",
  "function loans(address user) view returns (uint256 collateral, uint256 borrowedAmount, uint256 lastInteractionTime)",
  "function borrowRate() view returns (uint256)",
  "function pachaPrice() view returns (uint256)"
];

export const getStakingData = async () => {
  if (!STAKING_CONTRACT_ADDRESS) return null;
  const contract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_ABI, provider);
  
  try {
    const rewardRate = await contract.rewardRate();
    const totalSupply = await contract.totalSupply();
    
    return {
      rewardRate: ethers.formatUnits(rewardRate, 18),
      totalSupply: ethers.formatUnits(totalSupply, 18),
      tvl: totalSupply.toString(),
    };
  } catch (error) {
    console.error("Error fetching staking data:", error);
    return null;
  }
};

export const getUserLoanData = async (userAddress: string) => {
  if (!LENDING_CONTRACT_ADDRESS) return null;
  const contract = new ethers.Contract(LENDING_CONTRACT_ADDRESS, LENDING_ABI, provider);
  
  try {
    const debt = await contract.calculateDebt(userAddress);
    const loan = await contract.loans(userAddress);
    const pachaPrice = await contract.pachaPrice();
    
    return {
      collateral: ethers.formatUnits(loan.collateral, 18),
      borrowedAmount: ethers.formatUnits(loan.borrowedAmount, 6),
      currentDebt: ethers.formatUnits(debt, 6),
      pachaPrice: ethers.formatUnits(pachaPrice, 6)
    };
  } catch (error) {
    console.error("Error fetching user loan data:", error);
    return null;
  }
};
