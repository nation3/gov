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

// Proposal for the Nation3 DAO to adopt a statement
// statement: Statement that the Nation3 DAO would adopt
type ProclamationProposal = {
  statement: string
}

// On-chain proposal types

// Proposal to transfer an ERC20 token outside of the Nation3 DAO's treasury,
// with the expectation that it flows outside of its control
type ExpenseProposal = Transfer

// Proposal to perform a parameter change in one of the contracts owned by the
// Nation3 DAO
type ParameterChangeProposal = ContractCall

// Proposal to perform a treasury management operation, with the Nation3 DAO
// keeping the ultimate custody of the funds
// Examples: Trading on DEXes, lending, borrowing or buying options on DeFi
// protocols, adding or removing liquidity from pools
type CustodialTreasuryManagementProposal = ContractCall

// Proposal to perform a treasury management operation, with the Nation3 DAO
// temporarily losing the ultimate custody of the funds
// Examples: Loans to legal entities, equity investments held via a legal
// proxy, liquidations via CEXes
type NonCustodialTreasuryManagementProposal = Transfer

// Enum to identify each type of proposal
enum Kind {
  Meta,
  Proclamation,
  Expense,
  CustodialTreasuryManagement,
  NonCustodialTreasuryManagement,
}

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

// Proposal
// context: URI pointing to the body of the proposal, explaining it in English
// kind, content, proposer, agreement: Self-explanatory
type Proposal = {
  context: string
  kind: Kind
  content:
    | MetaProposal
    | ProclamationProposal
    | ExpenseProposal
    | ParameterChangeProposal
    | CustodialTreasuryManagementProposal
    | NonCustodialTreasuryManagementProposal
  proposer: Proposer
  agreement: Agreement | undefined
}
