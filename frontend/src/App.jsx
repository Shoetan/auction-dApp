import { useEffect, useState } from 'react'
import {Account, Contract, RpcProvider} from 'starknet'
import {ABI} from './assets/ABI'
import {connect, disconnect} from 'starknetkit'


function App() {
  const [pro, setPro] = useState(null)
  const [account, setAccount] = useState(null)
  const [address, setAddress] = useState(null)


  const [balance, setBalance] = useState(0)
  const [bidAmount, setBidAmount] = useState(0)
  // const [buttonClicked, setButtonClicked] = useState(0)

  const PROVIDER = new RpcProvider({
    nodeUrl:"https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_7/iNtQT4PP7Rbd3zDyfe8ztMauMyBjbADt"
  })


  const connect_wallet = async () =>{
    if (address) {
      disconnect()
      setPro(null)
      setAccount(null)
      setAddress(null)
      return
    } else {
      
      const {wallet} = await connect({
        provider: new RpcProvider({
          nodeUrl: "https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_7/iNtQT4PP7Rbd3zDyfe8ztMauMyBjbADt"
        }),
      
      })
      console.log(wallet)
  
      if(wallet && wallet.isConnected) {
        setPro(wallet.account.provider)
        setAccount(wallet.account)
        setAddress(wallet.selectedAddress)
      }
    }
  }

  const get_bid = async () =>{
      const contract = new Contract(ABI, import.meta.env.VITE_CONTRACT_ADDRESS, pro)
      try {
        const bal = await contract.get_balance()
        setBalance(bal.toString())
        console.log(bal)
      } catch (error) {
        console.error(error)
      }


    
  }

 
  const set_bid =  (bid) => {

    if (pro) {
      const contract = new Contract(ABI, import.meta.env.VITE_CONTRACT_ADDRESS, account)
      try {
        contract.increase_bid(bid)
        setBidAmount(0)
      } catch (error) {
        console.log(error)
      }


    }
  }

  const end_auction = () => {

    const contract = new Contract(ABI, import.meta.env.VITE_CONTRACT_ADDRESS, account) 

    try {
      contract.end_auction()
      setBidAmount(0)
      setBalance(0)
    } catch (error) {
      console.log(error)
    }
  }

  

  return (
    <div className='flex flex-col items-center justify-center m-24'>
      <div className='flex flex-col gap-2'>
        <h1 className='font-mono text-5xl p-8 '>Starknet Auction</h1>
        <button onClick={connect_wallet}className={`border p-4 m-4 rounded-lg font-mono hover:bg-gradient-to-r from-red-300 to-blue-500 ${address ? 'bg-gradient-to-l from cyan-300 to lime-400' : 'bg-white'}`}>
          {address ? `${address.toString(0, 5)}...` : "Connect wallet"}
        </button>
      </div>

      <div className='flex gap-6 font-mono text-2xl'>
        <h3>Current Highest bid</h3>
        <p>{balance ? balance : 0}</p>
      </div>

      <div className='flex gap-4 p-4 font-mono'>
        <button className='border p-2 rounded-lg hover:bg-gradient-to-r from-cyan-300 to-blue-400' onClick={()=>{set_bid(bidAmount)}}>Place bid</button>
        <input type="text" className='border rounded-full p-2 focus:outline-none' onChange={(e)=>{setBidAmount(e.target.value)}} value={bidAmount}/>
      </div>

      <div className="flex gap-4 p-12">
        <button onClick={get_bid} className='border p-4 rounded-lg font-mono hover:bg-gradient-to-r from-red-300 to-blue-500'>
          Get recent bid
        </button>
        <button onClick={end_auction} className='border p-4 rounded-lg font-mono hover:bg-gradient-to-r from-red-300 to-blue-500'>
          End auction
        </button>
      </div>
    </div>
  )
}

export default App
