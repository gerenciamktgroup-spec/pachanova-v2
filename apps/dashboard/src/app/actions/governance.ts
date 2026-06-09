"use server";

export async function createGovernanceProposal(title: string, description: string, endDate: string) {
  return { success: false, error: "Feature quarantined in MVP" };
}

export async function castVote(proposalId: string, choice: "for" | "against" | "abstain") {
  return { success: false, error: "Feature quarantined in MVP", votingPower: 0 };
}
