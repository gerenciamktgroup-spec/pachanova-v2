-- Fase35: Onchain Governance Vote Proofs (real tx@block + deterministic recompute for VERIFY/CERT; tie Fase26/27; PNC + PACHA power + 23125)
ALTER TABLE votes ADD COLUMN IF NOT EXISTS tx_hash varchar(80);
ALTER TABLE votes ADD COLUMN IF NOT EXISTS block_num bigint;
ALTER TABLE votes ADD COLUMN IF NOT EXISTS onchain_tx_proof text; -- json serialized proof {txHash,blockNum,note,...} for recompute match
ALTER TABLE votes ADD COLUMN IF NOT EXISTS recompute_note text;
ALTER TABLE votes ADD COLUMN IF NOT EXISTS onchain_verified boolean DEFAULT false;
CREATE INDEX IF NOT EXISTS votes_onchain_idx ON votes (proposal_id, onchain_verified);
