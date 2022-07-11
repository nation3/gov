// This file defines the types and data structures for the different kinds of
// proposals that can be presented to the Nation3 DAO

// Shared types

// Just to improve code understandability
type Address = string

// Defines a call to a smart contract
type ContractCall = {
  chainId: number
  target: Address
  method: string
  parameters: Array<string>
}

// Defines an ERC20 transfer
type Transfer = {
  chainId: number
  recipient: Address
  token: Address
  amount: number
}

// Proposal types

// Off-chain proposal types

// Proposal that affects the governance process itself (either this file or
// GOVERNANCE.md)
// prLink: Link to a pull request on GitHub with the proposed changes
type MetaProposal = {
  prLink: string
}

// Defines Snapshot's voting systems, except for quadratic which currently
// doesn't work for Nation3 because of lack of Sybil resistance
type AlternativeSnapshotVotingSystems =
  | 'single-choice'
  | 'approval'
  | 'ranked-choice'
  | 'weighted'

// Proposal for the Nation3 DAO to adopt a statement
// This is the only kind of proposal in which users can easily understand
// multiple choices, since they are written in plain English
// Because of that this will be the only kind of proposal on Snapshot that can
// use voting systems other than single choice
// statement: Statement that the Nation3 DAO would adopt
type ProclamationProposal = {
  statement: string
  snapshotVotingSystem: AlternativeSnapshotVotingSystems
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
// third-party custodian
// Examples: Loans to legal entities, equity investments held via a legal
// proxy, liquidations via CEXes
type CustodialTreasuryManagementProposal = Transfer

// Kind to identify each type of proposal
type Kind =
  | 'meta'
  | 'proclamation'
  | 'expense'
  | 'treasury-management'
  | 'custodial-treasury-management'

// Proposer of the proposal
// account: EVM-compatible address of the proposer
// signature: Cryptographic signature corresponding to the proposer's account
// in which they validate their role as proposer (TODO: Specify signature type)
type Proposer = {
  account: Address
  signature: string
}

// Agreement in the Nation3 jurisdiction entered by the proposer in order to
// send a governance proposal. They can be slashed in case of breach of their
// proposer duties
type Agreement = {
  chainId: number
  courtVersion: number
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
// kind, content, proposer, agreement: Self-explanatory
// agreement: Optional since the court isn't live yet
// votes: Contains the Snapshot vote and the Aragon vote, if there is one. They // will be added as they go live
type Proposal = {
  spec: number
  id: number
  kind: Kind
  content:
    | MetaProposal
    | ProclamationProposal
    | ExpenseProposal
    | ParameterChangeProposal
    | TreasuryManagementProposal
    | CustodialTreasuryManagementProposal
  proposer: Proposer
  agreement?: Agreement
  votes?: [SnapshotVote, Vote?]
}
