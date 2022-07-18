// Data structures for governance proposals presented to the Nation3 DAO
// Version 1.0-beta1

// Shared types

// To improve code understandability
type Address = string

// Only supporting Ethereum for now
type ChainId = 1

// Call to a smart contract
type ContractCall = {
  chainId: ChainId
  target: Address
  method: string
  parameters: Array<string>
}

// ERC20 transfer
type Transfer = {
  chainId: ChainId
  recipient: Address
  token: Address
  amount: number
}

// Proposal types
type Kind =
  | 'meta'
  | 'proclamation'
  | 'expense'
  | 'parameter-change'
  | 'treasury-management'
  | 'custodial-treasury-management'

// Off-chain proposal types

// Proposal that modifies the current governance process (`specs/N3GOV-v1.ts`
// and `GOVERNANCE.md`)
// prURI: Link to a pull request to this repo on GitHub
type MetaProposal = {
  prURI: string
}

// Defines Snapshot's voting systems, except for quadratic which currently
// doesn't work for Nation3 because of lack of Sybil resistance
type AlternativeSnapshotVotingSystems =
  | 'single-choice'
  | 'approval'
  | 'ranked-choice'
  | 'weighted'

// Proposal for the Nation3 DAO to adopt a statement
// Since multiple choices would be written in English and not encoded, this is
// the only kind of proposal on Snapshot that can use other voting systems
// other than Single Choice
// statement: Statement that the Nation3 DAO would adopt
// choices: Choices citizens can choose from
// votingSystem: Voting system to use for the vote
type ProclamationProposal = {
  statement: string
  choices: Array<string>
  votingSystem: AlternativeSnapshotVotingSystems
}

// On-chain proposal types

// Proposal to transfer an ERC20 token outside of the Nation3 DAO's treasury,
// with the expectation that it flows outside of its control
type ExpenseProposal = Transfer

// Proposal to perform a parameter change in one of the contracts controlled by
// the Nation3 DAO
type ParameterChangeProposal = ContractCall

// Proposal to perform an on-chain treasury management operation
// Examples: Trading on DEXes, lending, borrowing or buying options on DeFi
// protocols, adding or removing liquidity from pools
type TreasuryManagementProposal = ContractCall

// Proposal to perform a treasury management operation, with the Nation3 DAO
// keeping the legitimate ownership over the assets but holding them through a
// third-party entity
// Examples: Loans to legal entities, equity investments held via a legal
// proxy, liquidations via centralized exchange
type CustodialTreasuryManagementProposal = Transfer

// Agreement in the Nation3 jurisdiction entered by the proposer in order to
// send a governance proposal. They can be slashed in case of breach of duties
// Having this agreement in place also lets us extract the proposer's account
type Agreement = {
  chainId: ChainId
  agreementsContract: Address
  agreementId: number
}

// Vote related to the proposal
// uri: Full URI where the vote is accessible
// passed: Whether the proposal had a positive outcome or not
type Vote = {
  uri: string
  passed: boolean
}

// Snapshot vote related to the proposal
// outcome: Winning choice in Snapshot. Helpful to display together with the
// winning statement in a proclamation proposal
type SnapshotVote = Vote & {
  outcome: string
}

// Proposal
// spec: Version of this spec that the proposal adheres to
// id: Numeric identifier for the proposal, assigned at the time of PR creation
// discussion: URI where the discussion leading to this proposal can be found
// kind, content: Self-explanatory
// critical: Must be true if the proposal would trigger a transaction from the
// Nation3 DAO Critical Agent app
// agreement: Optional since the court isn't live yet
// votes: Contains the Snapshot vote and the Aragon vote, if there is one. They // will be added as they go live
type Proposal = {
  spec: number
  id: number
  discussion: string
  kind: Kind
  content:
    | MetaProposal
    | ProclamationProposal
    | ExpenseProposal
    | ParameterChangeProposal
    | TreasuryManagementProposal
    | CustodialTreasuryManagementProposal
  critical?: boolean
  agreement?: Agreement
  votes?: [SnapshotVote, Vote?]
}

export { Proposal }
