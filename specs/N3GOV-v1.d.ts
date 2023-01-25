/**
 * Data structures for governance proposals presented to the Nation3 DAO
 * Version 2.0
 */

declare enum ProposalKinds {
  Meta = 'meta',
  Law = 'law',
  Expense = 'expense',
  ParameterChange = 'parameter-change',
  TreasuryManagement = 'treasury-management',
  CustodialTreasuryManagement = 'custodial-treasury-management',
}

/* Shared types */

/**
 * Ethereum address
 * @TJS-pattern ^0x[a-fA-F0-9]{40}$
 */
type Address = string

declare namespace TransactionOrigins {
  export type Ethereum = {
    /**
     * @default 1
     */
    chainId: 1
    /**
     * @title Nation3 DAO Agent triggering the transaction
     * @default 0x336252602b3a8a0be336ed942228305173e8082b
     */
    from:
      | '0x336252602b3a8a0be336ed942228305173e8082b'
      | '0x7b81e8d4e82796c9b76284fa4d21e57b8b86a06c'
  }
}

/**
 * @title ERC20 transfer
 */
type ERC20Transfer = TransactionOrigins.Ethereum & {
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
   * In case part of the original expense amount was given back to the DAO
   * @title Reimbursement
   * @minimum 0
   */
  reimbursement?: number
}

/**
 * @title ERC20 transfers
 * @maxItems 5
 */
type ERC20Transfers = Array<ERC20Transfer>

/**
 * @title Smart contract call
 */
type ContractCall = TransactionOrigins.Ethereum & {
  /**
   * @title Contract address
   */
  to: Address
  /**
   * @title Method
   */
  method: string
  /**
   * @title Parameters
   */
  parameters?: Array<string>
  /**
   * @title ETH value
   * @minimum 0
   */
  value?: number
}

/**
 * @title Contract calls
 * @maxItems 5
 */
type ContractCalls = Array<ContractCall>

/* Proposal types */

/**
 * Proposal that modifies the Constitution
 * @title Meta
 */
type MetaProposal = {
  /**
   * @default meta
   */
  kind: ProposalKinds.Meta
  /**
   * Link to a pull request to the nation3/constitution repo on GitHub
   * @title PR link
   * @TJS-format uri
   */
  prURI: string
}

/**
 * Proposal for the DAO to pass a law binding the Nation3 Jurisdiction.
 * @title Law
 */
type LawProposal = {
  /**
   * @default law
   */
  kind: ProposalKinds.Law
  /**
   * Link to a pull request to the nation3/law repo on GitHub
   * @title PR link
   * @TJS-format uri
   */
  prURI: string
}

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
 * @title Vote
 */
type Vote = {
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

export type Proposal = {
  /**
   * Version of this spec that the proposal adheres to
   * @title Specification
   * @minimum 0
   * @maximum 1
   * @default 2
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
    | LawProposal
    | ExpenseProposal
    | ParameterChangeProposal
    | TreasuryManagementProposal
    | CustodialTreasuryManagementProposal
  /**
   * @title Votes
   * @minItems 1
   * @maxItems 5
   */
  votes?: Array<Vote>
}
