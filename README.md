# Javascript Contract Library

Example javascript library which can be used to communicate with the Ethereum network via localnode, metamask or custom node URL. 

1. Include script files [web.min.js](https://github.com/ethereum/web3.js/blob/develop/dist/web3.min.js) and contractInterface.js in HTML file.
2. Call the ContractInterface contract function with the solidity-contract-function-name and arguments array.
    
    ```
        const contractInterface = new ContractInterface();
        
        contractInterface.contract('solidity_function_name', []).then((res) => {
            console.log(res);
        }, (err) => {
            console.log(err);
        });
        
        contractInterface.contract('solidity_function_name', ['one', 'two']).then((res) => {
            console.log(res);
        }, (err) => {
            console.log(err);
        });
    ```



<sup>*Note: In contractInterface.js change the contractAddress to your deployed contract address and abiAddress to your abi.json file location.


### Libraries Used: 
   Web3.js 