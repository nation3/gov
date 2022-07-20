// Data structures for governance proposals presented to the Nation3 DAO
// Version 1.0-beta1

// Shared types

/**
 * Ethereum address
 * @TJS-pattern ^0x[a-fA-F0-9]{40}$
 */
type Address = string

/**
 * Only supporting Ethereum for now
 * @title Chain ID
 * @default 1
 * @readOnly
 */
type ChainId = 1

/**
 * @title DAO Agent triggering the transaction
 */
type DAOAgents =
  | '0x7b81e8d4e82796c9b76284fa4d21e57b8b86a06c'
  | '0x336252602b3a8a0be336ed942228305173e8082b'

/**
 * Transaction type
 * @readOnly
 */
enum TransactionKind {
  ERC20Transfer = 'erc20-transfer',
  ERC20Approval = 'erc20-approval',
  ContractCall = 'contract-call',
}

type OnChainTransaction = {
  chainId: ChainId
  from: DAOAgents
}

/**
 * @title ERC20 transaction
 */
type ERC20Transaction = OnChainTransaction & {
  /**
   * @title Token
   */
  token: Address
  /**
   * @title Amount
   * @minimum 0
   */
  amount: number
}

/**
 * @title ERC20 transfer
 */
type ERC20Transfer = ERC20Transaction & {
  /**
   * @default erc20-transfer
   */
  kind: TransactionKind.ERC20Transfer
  /**
   * @title Recipient
   */
  recipient: Address
}

/**
 * @title ERC20 approval
 */
type ERC20Approval = ERC20Transaction & {
  /**
   * @default erc20-approval
   */
  kind: TransactionKind.ERC20Approval
  /**
   * @title Spender
   */
  spender: Address
  finalAmountUsed?: number
}

/**
 * @title Smart contract call
 */
type ContractCall = OnChainTransaction & {
  /**
   * @default contract-call
   */
  kind: TransactionKind.ContractCall
  /**
   * @title Address to send the transaction to
   */
  to: Address
  /**
   * @title Method
   */
  method: string
  /**
   * @title Parameters
   */
  parameters: Array<string>
  /**
   * @title ETH value
   * @minimum 0
   * @default 0
   */
  value: number
}

/**
 * Proposal type
 * @readOnly
 */
enum Kind {
  Meta = 'meta',
  Proclamation = 'proclamation',
  Expense = 'expense',
  ParameterChange = 'parameter-change',
  TreasuryManagement = 'treasury-management',
  CustodialTreasuryManagement = 'custodial-treasury-management',
}

// Off-chain proposal types

/**
 * Proposal that modifies the current governance process (`specs/N3GOV-v1.ts`
 * and `GOVERNANCE.md`)
 * @title Meta
 */
type MetaProposal = {
  /**
   * @default meta
   */
  kind: Kind.Meta
  /**
   * Link to a pull request to this repo on GitHub
   * @title PR link
   *
   * @TJS-format uri
   */
  prURI: string
}

// Defines Snapshot's voting systems, except for quadratic which currently
// doesn't work for Nation3 because of lack of Sybil resistance
/**
 * @title Voting system
 */
type AlternativeSnapshotVotingSystems =
  | 'single-choice'
  | 'approval'
  | 'ranked-choice'
  | 'weighted'

// Since multiple choices would be written in English and not encoded, this is
// the only kind of proposal on Snapshot that can use other voting systems
// other than Single Choice
/**
 * Proposal for the Nation3 DAO to adopt a statement
 * @title Proclamation
 */
type ProclamationProposal = {
  /**
   * @default proclamation
   */
  kind: Kind.Proclamation
  /**
   * @title Statement
   */
  statement: string
  /**
   * @title Choices
   */
  choices: Array<string>
  votingSystem: AlternativeSnapshotVotingSystems
}

// On-chain proposal types

/**
 * @title Expense (with approval and call)
 */
type ExpenseWithApprovalAndCall = [ERC20Approval, ContractCall]

/**
 * Proposal to transfer, approve or interact with a contract moving an ERC20
 * token outside of the Nation3 DAO's treasury, with the expectation that it
 * flows outside of its control
 * @title Expense
 */
type ExpenseProposal = {
  /**
   * @default expense
   */
  kind: Kind.Expense
  calls: Array<ERC20Transfer | ExpenseWithApprovalAndCall>
}
/**
 * Proposal to perform a parameter change in one of the contracts controlled by
 * the Nation3 DAO
 * @title Parameter change
 */
type ParameterChangeProposal = {
  /**
   * @default parameter-change
   */
  kind: Kind.ParameterChange
  calls: Array<ContractCall>
}

/**
 * Proposal to perform an on-chain treasury management operation.
 * Examples: Trading on DEXes, lending, borrowing or buying options on DeFi
 * protocols, adding or removing liquidity from pools
 * @title Treasury management
 */
type TreasuryManagementProposal = {
  /**
   * @default treasury-management
   */
  kind: Kind.TreasuryManagement
  calls: Array<ContractCall>
}

/**
 * Proposal to perform a treasury management operation, with the Nation3 DAO
 * keeping the legitimate ownership over the assets but holding them through a
 * third-party entity.
 * Examples: Loans to legal entities, equity investments held via a legal
 * proxy, liquidations via centralized exchange
 * @title Treasury management (custodial)
 */
type CustodialTreasuryManagementProposal = {
  /**
   * @default custodial-treasury-management
   */
  kind: Kind.CustodialTreasuryManagement
  calls: Array<ERC20Transfer>
}

/**
 * Agreement in the Nation3 jurisdiction entered by the proposer in order to
 * send a governance proposal. They can be slashed in case of breach of duties
 * Having this agreement in place also lets us extract the proposer's account
 * @title Agreement
 */
type Agreement = {
  chainId: ChainId
  agreementsFramework: Address
  agreementId: number
}

/**
 * Snapshot Vote related to the proposal
 * @title Vote
 */
type Vote = {
  /**
   * Full URI where the vote is accessible
   * @title URI
   *
   * @TJS-format uri
   */
  uri: string
  /**
   * Whether the proposal had a positive outcome or not
   * @title Passed
   */
  passed: boolean
}

/**
 * Snapshot vote related to the proposal
 * @title Snapshot vote
 */
type SnapshotVote = Vote & {
  /*
   * Winning choice in Snapshot
   * @title Outcome
   */
  outcome: string | Array<string>
}

// Proposal
// agreement: Optional since the court isn't live yet
// votes: Contains the required votes to execute on the proposal. This will be
// the Snapshot vote and the Aragon vote (if there's one) or votes if the
// proposal requires prior approval to send tokens. They will be added as they
// go live
export type Proposal = {
  /**
   * Version of this spec that the proposal adheres to
   * @title Specification
   *
   * @minimum 0
   * @default 1
   */
  spec: number
  /**
   * Numeric identifier for the proposal, assigned at the time of PR creation
   * @title ID of the proposal
   *
   * @minimum 0
   */
  id: number
  /**
   * URI where the discussion leading to this proposal can be found
   * @title Discussion
   *
   * @TJS-format uri
   */
  discussion: string
  content:
    | MetaProposal
    | ProclamationProposal
    | ExpenseProposal
    | ParameterChangeProposal
    | TreasuryManagementProposal
    | CustodialTreasuryManagementProposal
  // agreement?: Agreement
  votes?: Array<SnapshotVote | Vote>
}
