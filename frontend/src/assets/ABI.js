export const ABI = [
  {
      "type": "impl",
      "name": "AuctionImpl",
      "interface_name": "auction_contract::IAuction"
  },
  {
      "type": "interface",
      "name": "auction_contract::IAuction",
      "items": [
          {
              "type": "function",
              "name": "increase_bid",
              "inputs": [
                  {
                      "name": "amount",
                      "type": "core::integer::u16"
                  }
              ],
              "outputs": [],
              "state_mutability": "external"
          },
          {
              "type": "function",
              "name": "get_balance",
              "inputs": [],
              "outputs": [
                  {
                      "type": "core::integer::u16"
                  }
              ],
              "state_mutability": "view"
          },
          {
              "type": "function",
              "name": "end_auction",
              "inputs": [],
              "outputs": [],
              "state_mutability": "external"
          }
      ]
  },
  {
      "type": "constructor",
      "name": "constructor",
      "inputs": []
  },
  {
      "type": "event",
      "name": "auction_contract::Auction::BidIncreased",
      "kind": "struct",
      "members": [
          {
              "name": "amount",
              "type": "core::integer::u16",
              "kind": "key"
          }
      ]
  },
  {
      "type": "event",
      "name": "auction_contract::Auction::Event",
      "kind": "enum",
      "variants": [
          {
              "name": "BidIncreased",
              "type": "auction_contract::Auction::BidIncreased",
              "kind": "nested"
          }
      ]
  }
]