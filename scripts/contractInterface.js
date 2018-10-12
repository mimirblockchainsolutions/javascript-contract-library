
//  Deployed contract address. Ideally, this should be an environment variable.
// const contractAddress = process.env.CONTRACT_ADDRESS;
const contractAddress = "0x4ae657565c5eb8897d421b145b5f36fde9d8ee3d";

// Add Contract ABI address
const abiAddress = './contracts/abi.json';

function ContractInterface() {
    function loadJSON(path, success, error) {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    if (success)
                        success(JSON.parse(xhr.responseText));
                } else {
                    if (error)
                        error(xhr);
                }
            }
        };
        xhr.open("GET", path, true);
        xhr.send();
    }

    this.contract = (method, args) => {
        return new Promise(async (resolve, reject) => {
            Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
            let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

            if (web3.isConnected()) {
                localNode(method, args, web3).then((res) => {
                    return resolve(res);
                }, (err) => {
                    return reject(err);
                });
            } else if (window['ethereum']) {
                let web3 = new Web3(ethereum);
                try {
                    // Request account access if needed
                    await ethereum.enable();

                    // Accounts now exposed
                    await metamask(method, args, web3).then((res) => {
                        return resolve(res);
                    }, (err) => {
                        return reject(err);
                    });
                } catch (error) {
                    return reject('User denied account access');
                }
            } else if (window.web3) {
                let web3 = new Web3(window.web3.currentProvider);
                // Accounts always exposed
                metamask(method, args, web3).then((res) => {
                    return resolve(res);
                }, (err) => {
                    return reject(err);
                });
            } else {
                // TODO: Add custom node url
                let web3 = new Web3(new Web3.providers.HttpProvider('XX https://CUSTOMNODE-URL XX'));
                if (web3.isConnected()) {
                    customNode(method, args, web3).then((res) => {
                        return resolve(res);
                    }, (err) => {
                        return reject(err);
                    });
                } else {
                    return reject('No Ethereum instance detected!')
                }
            }
        });
    };

    function localNode(method, args, web3) {
        return new Promise((resolve, reject) => {
            try {
                // Load contract ABI
                loadJSON(abiAddress,
                    async (abi) => {
                        try {
                            const contract = await web3.eth.contract(abi).at(contractAddress);

                            const txt = await contract[method](...args, {
                                from: web3.eth['accounts'][0],
                                gas: 3000000
                            });
                            if (txt) {
                                return resolve(txt);
                            }
                        } catch (e) {
                            return reject(e);
                        }
                    },
                    (xhr) => {
                        return reject(xhr);
                    }
                );
            } catch (e) {
                return reject('Something went wrong with the connection' + e);
            }
        });
    }

    function metamask(method, args, web3) {
        return new Promise(async (resolve, reject) => {
            web3.eth['getAccounts']((err, accounts) => {
                if (err != null) {
                    return reject(err);
                }
                else if (accounts.length === 0) {
                    console.log('locked');
                    return reject('MetaMask is locked');
                }
                else {
                    loadJSON(abiAddress,
                        async (abi) => {
                            const contract = await web3.eth.contract(abi).at(contractAddress);
                            try {
                                await contract[method](...args, {
                                    from: web3.eth['accounts'][0],
                                    gas: 3000000
                                }, (err, result) => {
                                    if (result !== undefined) {
                                        return resolve(result);
                                    }
                                    if (err) {
                                        return reject('Metamask reject the transaction');
                                    }
                                });
                            } catch (e) {
                                return reject(e);
                            }
                        },
                        (xhr) => {
                            return reject(xhr)
                        }
                    );
                }
            });
        });
    }

    // This is used for web3 call functions, not for transfer.
    function customNode(method, args, web3) {
        return new Promise((resolve, reject) => {
            try {
                // Load contract ABI
                loadJSON(abiAddress,
                    async (abi) => {
                        try {
                            const contract = await web3.eth.contract(abi).at(contractAddress);
                            const txt = await contract[method](...args, {
                                gas: 3000000
                            });
                            if (txt) {
                                return resolve(txt);
                            }
                        } catch (e) {
                            return reject(e);
                        }
                    },
                    (xhr) => {
                        return reject(xhr);
                    }
                );
            } catch (e) {
                return reject('Something went wrong with the connection' + e);
            }
        });
    }
}