# Design principles

- **Deterministic**: The content of a proposal is objective actionable items, not the subjective human-readable text that comes along with it. Subjectivity threatens guarantees that are paramount for a DAO's governance.
- **Understandable**: The idea is that anyone should be able to quickly know what a proposal does (most probably through a user interface). This principle is paramount to lower the risk surface of malicious proposals camouflaging as complex ones.
- **Secure and simple**: The `Expense` type only works with ERC20 transfers. ERC20 allowances, with its resulting complex expenditure operations need to be done from other entity (like a multisig). The rationale is twofold:
  - The DAO shouldn't be voting on everything. It should vote on major decisions with deterministic outcomes. Other entities can handle richer payment dynamics (by tranche, by stream).
  - Complex expenditure operations resulting from contract interactions are harder to understand for users, resulting in some attack surface.
- **Automated**: By making proposals machine-readable, we can automate the whole governance flow, since proposals adhere to the same governance spec no matter which tool they go through.

## Possible improvements

These are some possible improvements. At this stage, they would likely just add complexity with no upside.

- Specifying which are the contracts that the DAO governs. This could be a good way to establish which are the official contracts that the DAO commits to govern and safeguard.
- Allowing spending ERC721.
