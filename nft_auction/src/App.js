import { Table, Container, Button, Form } from 'react-bootstrap';
import React from 'react';
//import logo from './logo.svg';
import './App.css';
import web3, { checkMetaMaskConnection } from './web3';
import ipfs from './ipfs';
import storehash from './storehash';
// import $ from 'jquery';


class App extends React.Component {

    state = {
      ipfsHash:null,
      buffer:'',
      ethAddress:'',
      contractAddress: storehash.address,
      blockNumber:'',
      transactionHash:'',
      gasUsed:'',
      txReceipt: '',
      artworkName: ''
    };

    componentDidMount() {
      checkMetaMaskConnection()
    }

// Capture Image File and Convert to Buffer
captureFile = (event) => {
        event.stopPropagation()
        event.preventDefault()
        const file = event.target.files[0]
        let reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => this.convertToBuffer(reader)    
      };
 convertToBuffer = async(reader) => {
      //file is converted to a buffer for upload to IPFS
        const buffer = await Buffer.from(reader.result);
      //set this buffer -using es6 syntax
        this.setState({buffer});
    };

// Handlers for User Inputs
artworkNameHandler = e => {
  this.setState({artworkName: e.target.value})
}

artistNameHandler = e => {
  this.setState({artistName: e.target.value})
}

initialValueHandler = e => {
  this.setState({initialValue: e.target.value})
}

// Function to call registerArtwork Function from Smart Contract
registerArtwork = async (event) => {
  event.preventDefault();

  // Grab User MetaMask Address
  const accounts = await web3.eth.getAccounts();
  console.log('Sending from Metamask Account ' + accounts[0]);
  this.setState({ownerAddress: accounts[0]})

  // Grab Contract Address From storehash
  const contractAddress = await storehash.options.address;
  this.setState({contractAddress});

  // Grab IPFS Hash
  await ipfs.add(this.state.buffer, (err, ipfsHash) => {
    console.log(err, ipfsHash);
    this.setState({ipfsHash:ipfsHash[0].hash});
  })

  // Call Ethereum Contract
  storehash.methods.registerArtwork(this.state.ownerAddress, this.state.artworkName, this.state.artistName, 
    this.state.initialValue, 'ipfs://' + this.state.ipfsHash).send({
      from: accounts[0]}, (error, transactionHash) => {
        console.log(transactionHash); this.setState({transactionHash});
      })
}

render() {
      
      return (
        <div className="App">
          <header className="App-header">
            <h1> Tokenize Your Artwork </h1>
          </header>

          <hr />
<Container>
          <h3> Enter Artwork Information </h3>
          
          <Form onSubmit={this.registerArtwork}>
            <Form.Group className="mb-3">
              <Form.Label>Artwork Name   </Form.Label>
              <input 
                type = "text" 
                id = "artworkName"
                onChange = {this.artworkNameHandler}
                value = {this.state.artworkName}
                />
            </Form.Group>
            <br />
            <Form.Group className="mb-3">
              <Form.Label>Artist Name   </Form.Label>
              <input 
                type = "text" 
                id = "artistName"
                onChange = {this.artistNameHandler}
                value = {this.state.artistName}
                />
            </Form.Group>
            <br />
            <Form.Group className="mb-3">
              <Form.Label>Initial Appraisal   </Form.Label>
              <input 
                type = "int" 
                id = "initialValue"
                onChange = {this.initialValueHandler}
                value = {this.state.initialValue}
                />
            </Form.Group>
            <br />
            <Form.Group className="mb-3">
              <Form.Label>Image   </Form.Label>
              <input 
              type = "file"
              id = '#image'
              onChange = {this.captureFile}
            />
            </Form.Group>
            <br />
            <Button 
             bsStyle = "primary" 
             type = "submit"> 
             Create Token 
             </Button>
          </Form>
<hr/>

 <Button onClick = {this.getTxReceipt}> Get Transaction Receipt </Button>
  <Table bordered responsive>
                <thead>
                  <tr>
                    <th>Tx Receipt Category</th>
                    <th>Values</th>
                  </tr>
                </thead>
               
                <tbody>
                  <tr>
                    <td>IPFS Hash # stored on Eth Contract</td>
                    <td>{this.state.ipfsHash}</td>
                  </tr>

                  <tr>
                    <td>Ethereum Contract Address</td>
                    <td>{this.state.ethAddress}</td>
                  </tr>

                  <tr>
                    <td>Tx Hash # </td>
                    <td>{this.state.transactionHash}</td>
                  </tr>

                  <tr>
                    <td>Block Number # </td>
                    <td>{this.state.blockNumber}</td>
                  </tr>

                  <tr>
                    <td>Gas Used</td>
                    <td>{this.state.gasUsed}</td>
                  </tr>
                
                </tbody>
            </Table>
        </Container>
     </div>
      );
    } //render
} //App
export default App;