/**
 * Data structures for governance proposals presented to the Nation3 DAO
 * Version 1.0-beta2
 */

declare enum ProposalKinds {
  Meta = 'meta',
  Proclamation = 'proclamation',
  Expense = 'expense',
  ParameterChange = 'parameter-change',
  TreasuryManagement = 'treasury-management',
  CustodialTreasuryManagement = 'custodial-treasury-management',
}

/* Off-chain proposal types */

/**
 * Proposal that modifies the current governance process (`specs/N3GOV-v1.ts`
 * and `GOVERNANCE.md`)
 * @title Meta
 */
type MetaProposal = {
  /**
   * @default meta
   */
  kind: ProposalKinds.Meta
  /**
   * Link to a pull request to the nation3/governance repo on GitHub
   * @title PR link
   * @TJS-format uri
   */
  prURI: string
}

declare namespace SnapshotVotingParams {
  /* Defines Snapshot's voting systems, except for quadratic which currently
   * doesn't work for Nation3 because of lack of Sybil resistance, and approval, which is redundant with weighted */
  /**
   * @title Voting system
   * @default single-choice
   */
  enum VotingSystems {
    SingleChoice = 'single-choice',
    RankedChoice = 'ranked-choice',
    Weighted = 'weighted',
  }

  /**
   * Only approve or reject
   * @title Binary choice
   */
  export type BinaryChoice = {
    /**
     * @title Voting system
     * @default single-choice
     */
    votingSystem: VotingSystems.SingleChoice
    /**
     * @title Choices
     * @default ["Approve", "Reject"]
     */
    choices: ['Approve', 'Reject']
  }

  /**
   * Multiple choices can pass
   * @title Multiple choice
   */
  export type MultiChoice = {
    votingSystem: VotingSystems
    /**
     * @title Choices
     */
    choices: Array<string>
    /**
     * @title Amount of winning choices
     */
    winningChoicesAmount: number
  }
}

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
  kind: ProposalKinds.Proclamation
  /**
   * @title Statement
   */
  statement: string
  /**
   * @title Parameters of the vote
   */
  parameters:
    | SnapshotVotingParams.BinaryChoice
    | SnapshotVotingParams.MultiChoice
}

/* Common types */

/**
 * Ethereum address
 * @TJS-pattern ^0x[a-fA-F0-9]{40}$
 */
type Address = string

/**
 * Only supporting Ethereum for now
 * @title Chain ID
 * @default 1
 */
type ChainId = 1

/**
 * @title DAO Agent triggering the transaction
 */
type DAOAgents =
  | '0x336252602b3a8a0be336ed942228305173e8082b'
  | '0x7b81e8d4e82796c9b76284fa4d21e57b8b86a06c'

type OnChainTransaction = {
  chainId: ChainId
  from: DAOAgents
}

/**
 * @title ERC20 transfer
 */
type ERC20Transfer = OnChainTransaction & {
  /**
   * @title Recipient
   */
  recipient: Address
  /**
   * @title Token
   */
  token: Address
  /**
   * @title Amount
   * @minimum 0
   */
  amount: number
  /**
   * @title Reimbursement
   * @minimum 0
   */
  reimbursement?: number
}

/**
 * @title ERC20 transfers
 */
type ERC20Transfers = [ERC20Transfer, ...Array<ERC20Transfer>]

/**
 * @title Smart contract call
 */
type ContractCall = OnChainTransaction & {
  /**
   * @title Address to send the transaction to
   */
  to: Address
  /**
   * @title Method
   */
  method: string
  /* react-jsonschema-form doesn't support an array with multiple types */
  /**
   * @title Parameters
   */
  parameters?: Array<string>
  /**
   * @title ETH value
   * @minimum 0
   * @default 0
   */
  value?: number
}

/* On-chain proposal types */

/**
 * Proposal to transfer an ERC20 token outside of the Nation3 DAO's treasury,
 * with the expectation that it flows outside of its control
 * @title Expense
 */
type ExpenseProposal = {
  /**
   * @default expense
   */
  kind: ProposalKinds.Expense
  transfers: ERC20Transfers
}

/**
 * @title Contract calls
 */
type ContractCalls = [ContractCall, ...Array<ContractCall>]

/**
 * Proposal to perform a parameter change in one of the contracts controlled by
 * the Nation3 DAO
 * @title Parameter change
 */
type ParameterChangeProposal = {
  /**
   * @default parameter-change
   */
  kind: ProposalKinds.ParameterChange
  calls: ContractCalls
}

/**
 * Proposal to perform an on-chain treasury management operation.
 * Examples: Trading on DEXes, lending, borrowing or buying options on DeFi
 * protocols, adding or removing liquidity from pools, buying an ENS name
 * @title Treasury management
 */
type TreasuryManagementProposal = {
  /**
   * @default treasury-management
   */
  kind: ProposalKinds.TreasuryManagement
  calls: ContractCalls
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
  kind: ProposalKinds.CustodialTreasuryManagement
  transfers: ERC20Transfers
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
 * @title Aragon vote
 */
type AragonVote = {
  /**
   * @title URI
   * @TJS-format uri
   */
  uri: string
  /**
   * @title Passed
   */
  passed: boolean
}

/**
 * @title Snapshot vote
 */
type SnapshotVote = AragonVote & {
  /**
   * Winning choice or choices in Snapshot
   * @title Winning choice(s)
   */
  winningChoices: [string, ...Array<string>]
}

export type Proposal = {
  /**
   * Version of this spec that the proposal adheres to
   * @title Specification
   * @minimum 0
   * @default 1
   */
  spec: number
  /**
   * Numeric identifier for the proposal, assigned at the time of PR creation
   * @title ID of the proposal
   * @minimum 0
   */
  id: number
  /**
   * URI where the discussion leading to this proposal can be found
   * @title Discussion URI
   * @TJS-format uri
   */
  discussion: string
  /**
   * Different data is required depending on the proposal kind
   * @title Proposal content
   */
  content:
    | MetaProposal
    | ProclamationProposal
    | ExpenseProposal
    | ParameterChangeProposal
    | TreasuryManagementProposal
    | CustodialTreasuryManagementProposal
  // agreement?: Agreement
  /**
   * @title Votes
   */
  votes?: [SnapshotVote, ...Array<AragonVote>]
}
