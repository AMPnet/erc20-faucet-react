import { useState } from 'react';
import { ethers } from 'ethers'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Message from './Message'

const Faucet = (props) => {

  const [tokenAddress, setTokenAddress] = useState()
  const [receiverAddress, setReceiverAddress] = useState()
  const [tokenAmount, setTokenAmount] = useState()
  const [balance, setBalance] = useState()
  const [showBalance, setShowBalance] = useState(false)


  async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, props.tokenContract.abi, provider)
      const balance = await contract.balanceOf(account);
      console.log("Balance: ", balance.toString());
      setBalance(balance.toString());
      setShowBalance(true);
    }
  }

  async function faucet() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, props.tokenContract.abi, signer);
      contract.faucet(receiverAddress, tokenAmount);
    }
  }
    return (
        <div>
        <p>Mumbai USDC: 0x1eDaD4f5Dac6f2B97E7F6e5D3fF5f04D666685c3</p>
        <p>Polygon USDC: 0xbED6f6e804a183444355c27f45AABc2E4A17F7D2</p>
        <Card style={{background: "rgba(227, 104, 222, 0.71)"}}>
        <Card.Body>
        <Card.Subtitle>recieve faucet ERC20 to your wallet
        </Card.Subtitle><br></br>
        <div className="d-grid gap-2">
        <input onChange={e => setTokenAddress(e.target.value)} placeholder="Token 0x address" />
        <input onChange={e => setReceiverAddress(e.target.value)} placeholder="Receiver 0x address" />
        <input onChange={e => setTokenAmount(e.target.value)} placeholder="Amount" />
        <Button onClick={faucet}>faucet!</Button>
        <Button onClick={getBalance} variant="warning">check balance?</Button>
        { showBalance ? <Message balance={balance}/> : null }
        </div>
        </Card.Body>
        </Card>
        </div>
    )
}

export default Faucet
