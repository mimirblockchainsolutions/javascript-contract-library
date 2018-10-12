const contractInterface = new ContractInterface();
// Call the contract with the solidity contract function name and arguments
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