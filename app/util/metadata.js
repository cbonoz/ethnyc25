// Compiled data contract ABI.
export const SIMPLEOFFER_CONTRACT = {
    abi: [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_client",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "createOffer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "offerCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "offers",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "creator",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "client",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isAccepted",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
],
    bytecode: "0x6080604052348015600e575f5ffd5b506104bc8061001c5f395ff3fe608060405234801561000f575f5ffd5b506004361061003f575f3560e01c80631115c24d14610043578063746538d9146100615780638a72ea6a1461007d575b5f5ffd5b61004b6100b1565b604051610058919061028e565b60405180910390f35b61007b6004803603810190610076919061032f565b6100b7565b005b6100976004803603810190610092919061036d565b6101fb565b6040516100a89594939291906103c1565b60405180910390f35b60015481565b60015f8154809291906100c99061043f565b91905055506040518060a0016040528060015481526020013373ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020015f15158152505f5f60015481526020019081526020015f205f820151815f01556020820151816001015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506040820151816002015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550606082015181600301556080820151816004015f6101000a81548160ff0219169083151502179055509050505050565b5f602052805f5260405f205f91509050805f015490806001015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690806002015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690806003015490806004015f9054906101000a900460ff16905085565b5f819050919050565b61028881610276565b82525050565b5f6020820190506102a15f83018461027f565b92915050565b5f5ffd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6102d4826102ab565b9050919050565b6102e4816102ca565b81146102ee575f5ffd5b50565b5f813590506102ff816102db565b92915050565b61030e81610276565b8114610318575f5ffd5b50565b5f8135905061032981610305565b92915050565b5f5f60408385031215610345576103446102a7565b5b5f610352858286016102f1565b92505060206103638582860161031b565b9150509250929050565b5f60208284031215610382576103816102a7565b5b5f61038f8482850161031b565b91505092915050565b6103a1816102ca565b82525050565b5f8115159050919050565b6103bb816103a7565b82525050565b5f60a0820190506103d45f83018861027f565b6103e16020830187610398565b6103ee6040830186610398565b6103fb606083018561027f565b61040860808301846103b2565b9695505050505050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f61044982610276565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820361047b5761047a610412565b5b60018201905091905056fea2646970667358221220c3b613126994acf049ebe66727e3a012d1f3179781a31e3a1877f17f5999614f64736f6c634300081c0033"
};
