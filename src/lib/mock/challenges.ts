import type { Challenge } from '../types'

export const mockChallenges: Challenge[] = [
  {
    id: 'reentrancy-vault',
    title: 'Reentrancy Vault',
    difficulty: 'Easy',
    category: 'Reentrancy',
    status: 'available',
    xpReward: 100,
    description: 'A simple vault contract that allows deposits and withdrawals. Can you drain it?',
    vulnerabilityType: 'Reentrancy',
    objective: 'Drain all funds from the vault contract by exploiting the reentrancy vulnerability.',
    vulnerableCode: `#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env, token};

#[contract]
pub struct VulnerableVault;

#[contractimpl]
impl VulnerableVault {
    pub fn deposit(env: Env, from: Address, amount: i128) {
        from.require_auth();
        let balance: i128 = env.storage().instance().get(&from).unwrap_or(0);
        env.storage().instance().set(&from, &(balance + amount));
    }

    pub fn withdraw(env: Env, to: Address, amount: i128) {
        to.require_auth();
        let balance: i128 = env.storage().instance().get(&to).unwrap_or(0);
        // BUG: state updated AFTER external call
        token::Client::new(&env, &env.current_contract_address())
            .transfer(&env.current_contract_address(), &to, &amount);
        env.storage().instance().set(&to, &(balance - amount));
    }
}`,
    patchedCode: `#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env, token};

#[contract]
pub struct PatchedVault;

#[contractimpl]
impl PatchedVault {
    pub fn withdraw(env: Env, to: Address, amount: i128) {
        to.require_auth();
        let balance: i128 = env.storage().instance().get(&to).unwrap_or(0);
        assert!(balance >= amount, "insufficient funds");
        // FIX: update state BEFORE external call
        env.storage().instance().set(&to, &(balance - amount));
        token::Client::new(&env, &env.current_contract_address())
            .transfer(&env.current_contract_address(), &to, &amount);
    }
}`,
    exploitGuide: `## Exploit Steps

1. Deploy an attacker contract that calls \`withdraw\` in its receive callback
2. Deposit a small amount to get a valid balance
3. Call \`withdraw\` — the vault transfers funds before updating state
4. Your callback fires again, re-entering \`withdraw\` with the old balance
5. Repeat until vault is drained`,
    explanation: `The vault updates the user's balance **after** making the external token transfer. An attacker contract can re-enter \`withdraw\` before the balance is decremented, effectively withdrawing the same funds multiple times.

**Fix:** Always update state before making external calls (checks-effects-interactions pattern).`,
  },
  {
    id: 'integer-overflow',
    title: 'Token Overflow',
    difficulty: 'Easy',
    category: 'Integer Overflow',
    status: 'available',
    xpReward: 100,
    description: 'A token contract with unchecked arithmetic. Overflow your way to infinite tokens.',
    vulnerabilityType: 'Integer Overflow',
    objective: 'Mint more tokens than the maximum supply by triggering an integer overflow.',
    vulnerableCode: `#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env};

#[contract]
pub struct OverflowToken;

#[contractimpl]
impl OverflowToken {
    pub fn mint(env: Env, to: Address, amount: u32) {
        // BUG: u32 wraps on overflow in release builds
        let supply: u32 = env.storage().instance().get(&"supply").unwrap_or(0);
        let new_supply = supply + amount; // overflows silently
        env.storage().instance().set(&"supply", &new_supply);
        let bal: u32 = env.storage().instance().get(&to).unwrap_or(0);
        env.storage().instance().set(&to, &(bal + amount));
    }
}`,
    patchedCode: `#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env};

const MAX_SUPPLY: u64 = 1_000_000_000;

#[contract]
pub struct SafeToken;

#[contractimpl]
impl SafeToken {
    pub fn mint(env: Env, to: Address, amount: u64) {
        let supply: u64 = env.storage().instance().get(&"supply").unwrap_or(0);
        let new_supply = supply.checked_add(amount).expect("overflow");
        assert!(new_supply <= MAX_SUPPLY, "exceeds max supply");
        env.storage().instance().set(&"supply", &new_supply);
        let bal: u64 = env.storage().instance().get(&to).unwrap_or(0);
        env.storage().instance().set(&to, &(bal + amount));
    }
}`,
    exploitGuide: `## Exploit Steps

1. Calculate the value that causes \`u32::MAX + 1\` to wrap to 0
2. Call \`mint\` with \`amount = u32::MAX - current_supply + 1\`
3. Supply wraps to a small number, bypassing the cap
4. Mint freely`,
    explanation: `Using \`u32\` for token amounts allows integer overflow. When \`supply + amount > u32::MAX\`, the value wraps around to near zero, bypassing any supply cap.

**Fix:** Use \`checked_add\` and enforce a maximum supply with an explicit assertion.`,
  },
  {
    id: 'access-control',
    title: 'Admin Takeover',
    difficulty: 'Medium',
    category: 'Access Control',
    status: 'available',
    xpReward: 250,
    description: 'An admin-gated contract with a broken ownership transfer. Steal admin rights.',
    vulnerabilityType: 'Missing Access Control',
    objective: 'Become the admin of the contract without the current admin\'s permission.',
    vulnerableCode: `#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env, Symbol};

const ADMIN_KEY: Symbol = Symbol::short("admin");

#[contract]
pub struct AdminContract;

#[contractimpl]
impl AdminContract {
    pub fn init(env: Env, admin: Address) {
        env.storage().instance().set(&ADMIN_KEY, &admin);
    }

    // BUG: no auth check — anyone can call this
    pub fn set_admin(env: Env, new_admin: Address) {
        env.storage().instance().set(&ADMIN_KEY, &new_admin);
    }

    pub fn admin_action(env: Env) {
        let admin: Address = env.storage().instance().get(&ADMIN_KEY).unwrap();
        admin.require_auth();
        // privileged logic...
    }
}`,
    patchedCode: `#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env, Symbol};

const ADMIN_KEY: Symbol = Symbol::short("admin");

#[contract]
pub struct AdminContract;

#[contractimpl]
impl AdminContract {
    pub fn init(env: Env, admin: Address) {
        assert!(!env.storage().instance().has(&ADMIN_KEY), "already initialized");
        env.storage().instance().set(&ADMIN_KEY, &admin);
    }

    pub fn set_admin(env: Env, new_admin: Address) {
        // FIX: require current admin auth before transferring
        let admin: Address = env.storage().instance().get(&ADMIN_KEY).unwrap();
        admin.require_auth();
        env.storage().instance().set(&ADMIN_KEY, &new_admin);
    }
}`,
    exploitGuide: `## Exploit Steps

1. Call \`set_admin\` with your own address as \`new_admin\`
2. No authorization is checked — the call succeeds immediately
3. You are now admin and can call \`admin_action\``,
    explanation: `\`set_admin\` sets a new admin without verifying that the **current** admin authorized the change. Any account can overwrite the admin slot.

**Fix:** Fetch the current admin and call \`require_auth()\` on it before updating storage.`,
  },
  {
    id: 'flash-loan',
    title: 'Flash Loan Oracle',
    difficulty: 'Hard',
    category: 'Price Manipulation',
    status: 'locked',
    xpReward: 500,
    description: 'A lending protocol that reads spot price from a DEX. Manipulate the oracle.',
    vulnerabilityType: 'Oracle Manipulation',
    objective: 'Use a flash loan to manipulate the on-chain price oracle and borrow assets at near-zero collateral.',
    vulnerableCode: `#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env};

#[contract]
pub struct LendingProtocol;

#[contractimpl]
impl LendingProtocol {
    pub fn borrow(env: Env, borrower: Address, amount: i128) {
        borrower.require_auth();
        // BUG: reads spot price — manipulable in same tx
        let price = Self::get_spot_price(&env);
        let collateral_required = amount / price;
        // check collateral and lend...
        let _ = collateral_required;
    }

    fn get_spot_price(env: &Env) -> i128 {
        // reads directly from AMM reserves — no TWAP
        env.storage().instance().get(&"amm_price").unwrap_or(1)
    }
}`,
    patchedCode: `// Use a time-weighted average price (TWAP) oracle
// that cannot be manipulated within a single transaction.
fn get_twap_price(env: &Env) -> i128 {
    // aggregate price observations over N ledgers
    env.storage().instance().get(&"twap_price").unwrap_or(1)
}`,
    exploitGuide: `## Exploit Steps

1. Take a flash loan of the base asset
2. Dump it into the AMM, crashing the spot price
3. Call \`borrow\` — collateral requirement is now tiny
4. Borrow maximum assets
5. Repay flash loan, profit`,
    explanation: `Reading spot price from an AMM in the same transaction as a borrow allows an attacker to manipulate the price within one atomic transaction using a flash loan.

**Fix:** Use a TWAP (time-weighted average price) that aggregates prices over multiple ledgers, making single-transaction manipulation economically infeasible.`,
  },
  {
    id: 'storage-collision',
    title: 'Storage Collision',
    difficulty: 'Hard',
    category: 'Storage',
    status: 'locked',
    xpReward: 500,
    description: 'Two storage keys hash to the same slot. Corrupt contract state.',
    vulnerabilityType: 'Storage Key Collision',
    objective: 'Write to one storage key and corrupt a different variable by exploiting a hash collision.',
    vulnerableCode: `#![no_std]
use soroban_sdk::{contract, contractimpl, Env, Symbol};

// BUG: "admin_bal" and "adminbal" may collide depending on Symbol encoding
const KEY_A: Symbol = Symbol::short("admin_bal");
const KEY_B: Symbol = Symbol::short("adminbal");

#[contract]
pub struct CollisionContract;

#[contractimpl]
impl CollisionContract {
    pub fn set_a(env: Env, val: i128) {
        env.storage().instance().set(&KEY_A, &val);
    }
    pub fn get_b(env: Env) -> i128 {
        env.storage().instance().get(&KEY_B).unwrap_or(0)
    }
}`,
    patchedCode: `// Use clearly distinct, well-documented keys
// or use typed structs as storage keys to avoid collisions
use soroban_sdk::contracttype;

#[contracttype]
pub enum DataKey {
    AdminBalance,
    UserBalance(Address),
}`,
    exploitGuide: `## Exploit Steps

1. Call \`set_a\` with a crafted value
2. Read \`get_b\` — observe the corrupted value
3. Use this to overwrite critical state (e.g., admin balance)`,
    explanation: `Short symbol encoding can produce collisions for keys that look different but encode identically. Writing to KEY_A corrupts KEY_B.

**Fix:** Use \`#[contracttype]\` enums as storage keys — they are type-safe and guaranteed unique.`,
  },
]
