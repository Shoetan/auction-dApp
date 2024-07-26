use starknet::{ContractAddress};

#[starknet::interface]
pub trait IAuction<TContractState> {
    fn increase_bid(ref self: TContractState, amount: u16);
    fn get_balance(self: @TContractState) -> u16;
    fn end_auction(ref self: TContractState); // reset highest bid to zero
}

#[starknet::contract]
mod Auction {
    use starknet::ContractAddress;
    #[storage]
    struct Storage {
        highest_bidder: ContractAddress,
        highest_bid: u16,
        beneficiary: ContractAddress,
        ended: bool,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.ended.write(false);
        self.highest_bid.write(0);
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        BidIncreased: BidIncreased,
    }

    #[derive(Drop, starknet::Event)]
    struct BidIncreased {
        #[key]
        amount: u16,
    }

    #[abi(embed_v0)]
    impl AuctionImpl of super::IAuction<ContractState> {
        fn increase_bid(ref self: ContractState, amount: u16) {
            assert(amount != 0, 'Amount cannot be 0');
            self.highest_bid.write(self.highest_bid.read() + amount);
            self.emit(BidIncreased { amount: amount });
        }

        fn get_balance(self: @ContractState) -> u16 {
            self.highest_bid.read()
        }

        fn end_auction(ref self: ContractState) {
            self.highest_bid.write(0);
        }
    }
}

