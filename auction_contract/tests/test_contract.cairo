use starknet::ContractAddress;

use snforge_std::{declare, ContractClassTrait};

use auction_contract::IAuctionSafeDispatcher;
use auction_contract::IAuctionSafeDispatcherTrait;
use auction_contract::IAuctionDispatcher;
use auction_contract::IAuctionDispatcherTrait;

fn deploy_contract(name: ByteArray) -> ContractAddress {
    let contract = declare(name).unwrap();
    let (contract_address, _) = contract.deploy(@ArrayTrait::new()).unwrap();
    contract_address
}

#[test]
fn test_increase_bid() {
    let contract_address = deploy_contract("Auction");

    let dispatcher = IAuctionDispatcher { contract_address };

    let balance_before = dispatcher.get_balance();
    assert(balance_before == 0, 'Invalid balance');

    dispatcher.increase_bid(42);

    let balance_after = dispatcher.get_balance();
    assert(balance_after == 42, 'Invalid balance');
}

#[test]
#[feature("safe_dispatcher")]
fn test_cannot_increase_bid_with_zero_value() {
    let contract_address = deploy_contract("Auction");

    let safe_dispatcher = IAuctionSafeDispatcher { contract_address };

    let balance_before = safe_dispatcher.get_balance().unwrap();
    assert(balance_before == 0, 'Invalid balance');

    match safe_dispatcher.increase_bid(0) {
        Result::Ok(_) => core::panic_with_felt252('Should have panicked'),
        Result::Err(panic_data) => {
            assert(*panic_data.at(0) == 'Amount cannot be 0', *panic_data.at(0));
        }
    };
}
