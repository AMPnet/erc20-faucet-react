import { useState, useEffect } from 'react';
import { ethers } from 'ethers'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

const Faucet = (props) => {

  const [provider] = useState(loadProvider())
  const [receiverAddress, setReceiverAddress] = useState()
  const [tokenAmount, setTokenAmount] = useState()

  useEffect(() => {
    if (!window.ethereum) {
      window.alert("NGMI")
      return
    } else {
      provider.send("eth_requestAccounts").then(accounts => {
        fillReceiver(accounts[0])   
      }, err => {
        window.alert(err.message)
      })
      provider.provider.on('accountsChanged', accounts => {
        if (accounts.length > 0) {
          fillReceiver(accounts[0])
        }
      })
    }
  }, [ provider ])

  async function faucetMumbai() {
    const usdc = "0x1eDaD4f5Dac6f2B97E7F6e5D3fF5f04D666685c3"
    const chainId = 80001
    const chainName = 'Polygon Testnet Mumbai'
    const rpc = 'https://matic-mumbai.chainstacklabs.com'
    const blockExplorer = 'https://mumbai.polygonscan.com'
    const currency = 'MATIC'
    faucet(usdc, chainId, chainName, rpc, blockExplorer, currency)
  }

  async function faucetPolygon() {
    const usdc = "0xbED6f6e804a183444355c27f45AABc2E4A17F7D2"
    const chainId = 137
    const chainName = 'Polygon Mainnet'
    const rpc = 'https://rpc-mainnet.maticvigil.com'
    const blockExplorer = 'https://polygonscan.com'
    const currency = 'MATIC'
    faucet(usdc, chainId, chainName, rpc, blockExplorer, currency)
  }

  async function faucetPrivate() {
    const usdc = "0x0E97c3931CFD56EBE43f07C13730CDe5fCF23640"
    const chainId = 1337
    const chainName = 'AMPnet PoA'
    const rpc = 'https://poa.ampnet.io/rpc'
    const blockExplorer = 'https://poa.ampnet.io/'
    const currency = 'AMP'
    faucet(usdc, chainId, chainName, rpc, blockExplorer, currency)
  }

  async function faucet(tokenAddress, chainId, chainName, rpc, blockExplorer, currency) {
    if (!isValidInput()) {
      window.alert("Please provide valid receiver adress and token amount!")
      return
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any")
    const signer = provider.getSigner()
    const contract = new ethers.Contract(tokenAddress, props.tokenContract.abi, signer)

    if (window.ethereum.networkVersion !== chainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: ethers.utils.hexValue(chainId) }],
        });
      } catch (err) {
        if (err.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainName: chainName,
                chainId: ethers.utils.hexValue(chainId),
                nativeCurrency: { name: currency, decimals: 18, symbol: currency },
                rpcUrls: [ rpc ],
                blockExplorerUrls: [ blockExplorer ]
              },
            ],
          })
        }
      }
    }
    try {
      await contract.faucet(receiverAddress, tokenAmount)
      window.alert("Success")
    } catch (err) {
      window.alert(err.message)
    }
  }

  function loadProvider() {
    if (!window.ethereum) {
      return null
    }
    return new ethers.providers.Web3Provider(window.ethereum, "any")
  }

  function fillReceiver(address) {
    document.getElementById("receiver-address").value = address
    setReceiverAddress(address)
  }

  function isValidInput() {
    return (ethers.utils.isAddress(receiverAddress) && isPositiveInteger(tokenAmount));
  }

  function isPositiveInteger(str) {
    if (typeof str !== 'string') {
      return false
    }
    const num = Number(str)
    if (Number.isInteger(num) && num > 0) {
      return true
    }
    return false
  }

  return (
    <div>
      <Card style={{background: "rgba(4, 176, 224, 0.5)"}}>
        <Card.Body >
          <Card.Subtitle>Recieve test USDC to your wallet</Card.Subtitle>
          <br />
          <div className="d-grid gap-2">
            <label for="receiver-address">Receiver address</label>
            <input id="receiver-address" onChange={e => setReceiverAddress(e.target.value)} placeholder="Receiver 0x address" />
            <label for="amount">Amount</label>
            <input id="amount" onChange={e => setTokenAmount(e.target.value)} placeholder="Amount" />
            <Button onClick={faucetPolygon}>Faucet Polygon</Button>
            <Button onClick={faucetMumbai}>Faucet Mumbai</Button>
            <Button onClick={faucetPrivate}>Faucet PoA</Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  )

}

export default Faucet
