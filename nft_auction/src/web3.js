//overrides metamask v0.2 for our 1.0 version. 
//1.0 lets us use async and await instead of promises
import Web3 from 'web3';


// Function to check for MetaMask Connection
export const checkMetaMaskConnection = () => {
    if(window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        window.ethereum.enable();
        return true;
    }
    return false;
}

const web3 = new Web3(window.web3.currentProvider);
export default web3;
