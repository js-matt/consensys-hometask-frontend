import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import NFTLendingABI from './NFTLendingABI.json';

const infuraProjectId = 'YOUR_INFURA_PROJECT_ID';
const web3 = new Web3(`https://mainnet.infura.io/v3/${infuraProjectId}`);
const contractAddress = '0xYourContractAddress';
const nftLending = new web3.eth.Contract(NFTLendingABI, contractAddress);

const App = () => {
  const [account, setAccount] = useState('');
  const [loanDetails, setLoanDetails] = useState({ nftAddress: '', tokenId: '', amount: '', duration: '' });

  useEffect(() => {
    const connectMetaMask = async () => {
      if (window?.ethereum) {
        try {
          await window?.ethereum.request({ method: 'eth_requestAccounts' });
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);
        } catch (error) {
          console.error("User denied account access");
        }
      } else {
        console.error("MetaMask not installed");
      }
    };

    connectMetaMask();
  }, []);

  const handleInputChange = (e) => {
    setLoanDetails({ ...loanDetails, [e.target.name]: e.target.value });
  };

  const collateralizeAndBorrow = async () => {
    const { nftAddress, tokenId, amount, duration } = loanDetails;
    await nftLending.methods.collateralizeAndBorrow(nftAddress, tokenId, web3.utils.toWei(amount, 'ether'), duration).send({ from: account });
  };

  return (
    <div>
      <h1>NFT Lending Platform</h1>
      <p>Connected Account: {account}</p>
      <input type="text" name="nftAddress" placeholder="NFT Address" onChange={handleInputChange} />
      <input type="text" name="tokenId" placeholder="Token ID" onChange={handleInputChange} />
      <input type="text" name="amount" placeholder="Loan Amount" onChange={handleInputChange} />
      <input type="text" name="duration" placeholder="Loan Duration" onChange={handleInputChange} />
      <button onClick={collateralizeAndBorrow}>Borrow</button>
    </div>
  );
};

export default App;
