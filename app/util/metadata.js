// Compiled data contract ABI.
export const SIMPLEOFFER_CONTRACT = {
    abi: [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_title",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_description",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_serviceType",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_deliverables",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_deadline",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_paymentToken",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "client",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "message",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "ClientRequested",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "FundsWithdrawn",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "client",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "OfferAccepted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "OfferCompleted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "title",
                "type": "string"
            }
        ],
        "name": "OfferCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "funder",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "OfferFunded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "client",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "OfferRequestApproved",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "client",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "OfferRequestRejected",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "acceptOffer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_clientAddress",
                "type": "address"
            }
        ],
        "name": "approveOfferRequest",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "client",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "clientOfferRequests",
        "outputs": [
            {
                "internalType": "address",
                "name": "clientAddress",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "message",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "requestedAt",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isApproved",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "isRejected",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "completeOffer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "emergencyWithdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "fundContract",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllOfferRequests",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "clientAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "message",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "requestedAt",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isApproved",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "isRejected",
                        "type": "bool"
                    }
                ],
                "internalType": "struct SimpleOfferContract.ClientOfferRequest[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_clientAddress",
                "type": "address"
            }
        ],
        "name": "getClientOfferRequest",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "clientAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "message",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "requestedAt",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isApproved",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "isRejected",
                        "type": "bool"
                    }
                ],
                "internalType": "struct SimpleOfferContract.ClientOfferRequest",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_clientAddress",
                "type": "address"
            }
        ],
        "name": "getClientOfferRequests",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "clientAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "message",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "requestedAt",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isApproved",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "isRejected",
                        "type": "bool"
                    }
                ],
                "internalType": "struct SimpleOfferContract.ClientOfferRequest",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getContractBalance",
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
        "inputs": [],
        "name": "getOfferDetails",
        "outputs": [
            {
                "internalType": "string",
                "name": "title",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "serviceType",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "deliverables",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "createdAt",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getOfferMetadata",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "title",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "serviceType",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "deliverables",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "deadline",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isActive",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "createdAt",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct SimpleOfferContract.OfferMetadata",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getOfferStatus",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "client",
                        "type": "address"
                    },
                    {
                        "internalType": "bool",
                        "name": "isAccepted",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "isFunded",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "isCompleted",
                        "type": "bool"
                    }
                ],
                "internalType": "struct SimpleOfferContract.OfferStatus",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getRequestCount",
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
        "inputs": [],
        "name": "getRequesterAddresses",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "isAccepted",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "isCompleted",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "isFunded",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "offerMetadata",
        "outputs": [
            {
                "internalType": "string",
                "name": "title",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "serviceType",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "deliverables",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "createdAt",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "paymentToken",
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "pendingClient",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_clientAddress",
                "type": "address"
            }
        ],
        "name": "rejectOfferRequest",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_message",
                "type": "string"
            }
        ],
        "name": "requestAndFundOffer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_message",
                "type": "string"
            }
        ],
        "name": "requestOffer",
        "outputs": [],
        "stateMutability": "nonpayable",
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
        "name": "requesterAddresses",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdrawFunds",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
],
    bytecode: "0x6080604052346106e757612ac580380380610019816106eb565b92833981019060e0818303126106e75780516001600160401b0381116106e75782610045918301610710565b60208201516001600160401b0381116106e75783610064918401610710565b60408301516001600160401b0381116106e75784610083918501610710565b606084015190946001600160401b0382116106e7576100a3918501610710565b60808401519360c060a082015191015160018060a01b0381168091036106e75760015f81905580546001600160a01b03199081163317909155600b80549091169190911790556040519161010083016001600160401b0381118482101761044057604052848352602083019384526040830196875260608301908152608083019686885260a0840192835260e060c0850194600186520194428652865160018060401b03811161044057600354600181811c911680156106dd575b602082101461042257601f811161067a575b50806020601f8211600114610614575f91610609575b508160011b915f199060031b1c1916176003555b518051906001600160401b0382116104405760045490600182811c921680156105ff575b60208310146104225781601f849311610591575b50602090601f831160011461052b575f92610520575b50508160011b915f199060031b1c1916176004555b518051906001600160401b0382116104405760055490600182811c92168015610516575b60208310146104225781601f8493116104c5575b50602090601f831160011461045f575f92610454575b50508160011b915f199060031b1c1916176005555b5180519096906001600160401b03811161044057600654600181811c91168015610436575b602082101461042257601f81116103bf575b506020601f821160011461034c5781905f516020612aa55f395f51905f5298995f92610341575b50508160011b915f199060031b1c1916176006555b516007555160085551151560ff80196009541691161760095551600a55606060018060a01b036001541693602060405193849283526040828401528051918291826040860152018484015e5f828201840152601f01601f19168101030190a260405161234390816107628239f35b015190505f806102be565b601f1982169860065f52815f20995f5b8181106103a75750915f516020612aa55f395f51905f52999a9184600195941061038f575b505050811b016006556102d3565b01515f1960f88460031b161c191690555f8080610381565b838301518c556001909b019a6020938401930161035c565b60065f527ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f601f830160051c81019160208410610418575b601f0160051c01905b81811061040d5750610297565b5f8155600101610400565b90915081906103f7565b634e487b7160e01b5f52602260045260245ffd5b90607f1690610285565b634e487b7160e01b5f52604160045260245ffd5b015190505f8061024b565b60055f9081528281209350601f198516905b8181106104ad5750908460019594939210610495575b505050811b01600555610260565b01515f1960f88460031b161c191690555f8080610487565b92936020600181928786015181550195019301610471565b90915060055f5260205f20601f840160051c8101916020851061050c575b90601f859493920160051c01905b8181106104fe5750610235565b5f81558493506001016104f1565b90915081906104e3565b91607f1691610221565b015190505f806101e8565b60045f9081528281209350601f198516905b8181106105795750908460019594939210610561575b505050811b016004556101fd565b01515f1960f88460031b161c191690555f8080610553565b9293602060018192878601518155019501930161053d565b60045f529091507f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b601f840160051c810191602085106105f5575b90601f859493920160051c01905b8181106105e757506101d2565b5f81558493506001016105da565b90915081906105cc565b91607f16916101be565b90508801515f610186565b60035f9081528181209250601f198416905b8b828210610662575050908360019493921061064a575b5050811b0160035561019a565b8a01515f1960f88460031b161c191690555f8061063d565b60018495602093958493015181550194019201610626565b60035f527fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b601f830160051c810191602084106106d3575b601f0160051c01905b8181106106c85750610170565b5f81556001016106bb565b90915081906106b2565b90607f169061015e565b5f80fd5b6040519190601f01601f191682016001600160401b0381118382101761044057604052565b81601f820112156106e7578051906001600160401b0382116104405761073f601f8301601f19166020016106eb565b92828452602083830101116106e757815f9260208093018386015e830101529056fe60806040526004361015610011575f80fd5b5f3560e01c80630ab0210c1461191b5780630eae7a9e14611853578063109e94cf1461182b578063136277df1461160f57806324600fc31461142957806326db7ab1146113fc5780633013ce291461140157806333c1ab6b146113fc5780633fad1834146113df5780635051a5ec146113ba5780636f9fb98a146113335780637c6543031461130e5780637e34c38f146111c35780638da5cb5b1461119b578063945f898614611088578063990812bc14610f425780639abab09d14610de8578063a20dc71314610d92578063b2cdac9d14610cd1578063bd097e2114610af8578063c1ed9a5114610ad0578063ca56605d14610715578063d4a4de3314610683578063db2e21bc146103d6578063ea84bf5f146102d5578063eb62df61146101b8578063fa391c64146101935763fcd419c31461014d575f80fd5b3461018f57602036600319011261018f57600435600d5481101561018f57610176602091611f03565b905460405160039290921b1c6001600160a01b03168152f35b5f80fd5b3461018f575f36600319011261018f57602060ff600b5460a81c166040519015158152f35b3461018f575f36600319011261018f576101d660ff60095416611f2f565b600b546101e960ff8260a01c1615611f71565b6002546001600160a01b0316903382900361029057335f52600c60205260ff600360405f20015416156102545760ff60a01b1916600160a01b17600b556040514281527f18f9d2c9031a53ca9e501ddaadc6e66758b39bbf424cf4e22c62b6003fbd240c90602090a2005b60405162461bcd60e51b815260206004820152601460248201527314995c5d595cdd081b9bdd08185c1c1c9bdd995960621b6044820152606490fd5b60405162461bcd60e51b815260206004820152601760248201527f4e6f742074686520617070726f76656420636c69656e740000000000000000006044820152606490fd5b3461018f57602036600319011261018f576004356001600160a01b0381169081900361018f5761031060018060a01b036001541633146120d4565b5f818152600c6020526040902054610332906001600160a01b031615156121b6565b805f52600c60205260ff600360405f2001541661039157805f52600c602052600360405f200161010061ff00198254161790557fd7564e4caf97e156ab5aab6683b90b2467acacf0831ba50f8261752dc90827206020604051428152a2005b60405162461bcd60e51b815260206004820152601860248201527f5265717565737420616c726561647920617070726f76656400000000000000006044820152606490fd5b3461018f575f36600319011261018f576103ee6122b9565b600b5460ff8160b01c16156106485761040d60ff8260a81c16156121f5565b60085442111561060c576002546001600160a01b031690338290036105bc576040516370a0823160e01b8152306004820152916001600160a01b039190911690602083602481855afa92831561057a575f93610585575b50826104af92602092610478831515612130565b60405163a9059cbb60e01b81526001600160a01b0390911660048201526024810192909252909283919082905f9082906044820190565b03925af190811561057a575f9161054b575b5015610506576002546040519182526001600160a01b0316907feaff4b37086828766ad3268786972c0cd24259d4c87a80f9d3963a3c3d999b0d90602090a260015f55005b60405162461bcd60e51b815260206004820152601b60248201527f456d657267656e6379207769746864726177616c206661696c656400000000006044820152606490fd5b61056d915060203d602011610573575b6105658183611a32565b810190612173565b826104c1565b503d61055b565b6040513d5f823e3d90fd5b909192506020813d6020116105b4575b816105a260209383611a32565b8101031261018f575191906020610464565b3d9150610595565b60405162461bcd60e51b815260206004820152602260248201527f4f6e6c7920636c69656e742063616e20656d657267656e637920776974686472604482015261617760f01b6064820152608490fd5b60405162461bcd60e51b8152602060048201526014602482015273111958591b1a5b99481b9bdd081c995858da195960621b6044820152606490fd5b60405162461bcd60e51b815260206004820152601360248201527210dbdb9d1c9858dd081b9bdd08199d5b991959606a1b6044820152606490fd5b3461018f57602036600319011261018f576004356001600160a01b0381169081900361018f575f908152600c6020526040902080546001600160a01b03166106cd60018301611e65565b9160ff600360028301549201546106f6604051958695865260a0602087015260a086019061196d565b9260408501528181161515606085015260081c16151560808301520390f35b3461018f5761072336611a54565b61072b6122b9565b61073960ff60095416611f2f565b61074b60ff600b5460a01c1615611f71565b61076160018060a01b0360015416331415611fb6565b335f908152600c6020526040902054610783906001600160a01b03161561200e565b60405190610790826119f9565b3380835260208084018381524260408087019182526001606088018181525f60808a01818152978152600c90965291909420965187546001600160a01b0319166001600160a01b039190911617875591518051909692949383019067ffffffffffffffff8111610abc576108048254611bb7565b601f8111610a77575b506020601f8211600114610a0a5791816003949261086296946108799a9b5f926109ff575b50508160011b915f1990871b1c19161790555b5160028201550192511515839060ff801983541691151516179055565b51815461ff00191690151560081b61ff0016179055565b6108823361204e565b60028054336001600160a01b03199182168117909255600e805490911682179055600b8054600160a01b60ff60a01b198216179091556007546040516323b872dd60e01b8152600481019390935230602484015260448301819052929190602090829060649082905f906001600160a01b03165af1801561057a5761090e915f916109e0575b5061226d565b600160b01b60ff60b01b19600b541617600b557f6873da866771cd3de75446bd168a8ed23f58103edc9fad518cf0a4575df0e2af6040518061095333944290836120b8565b0390a26040514281527fdff0cf58f6664e9803e20c37fe4cc699fddc59ea50ebf701c7e8a53488d2a96f60203392a26040514281527f18f9d2c9031a53ca9e501ddaadc6e66758b39bbf424cf4e22c62b6003fbd240c60203392a26040519081527fbae0ebb78f3a013a78ff0056662924b1eb7b73abafc1ddd5553c8b667abdaf5f60203392a260015f55005b6109f9915060203d602011610573576105658183611a32565b84610908565b015190508b80610832565b601f19821698835f52815f20995f5b818110610a5f575092610879999a610862979593600193836003999710610a48575b505050811b019055610845565b01515f1983891b60f8161c191690558b8080610a3b565b838301518c556001909b019a60209384019301610a19565b825f5260205f20601f830160051c81019160208410610ab2575b601f0160051c01905b818110610aa7575061080d565b5f8155600101610a9a565b9091508190610a91565b634e487b7160e01b5f52604160045260245ffd5b3461018f575f36600319011261018f57600e546040516001600160a01b039091168152602090f35b3461018f575f36600319011261018f57610b106122b9565b600b5460ff8160a01c1615610c8c5760ff8160b01c16610c4757610b3860ff60095416611f2f565b6002546001600160a01b03163303610c02576007546040516323b872dd60e01b8152336004820152306024820152604481018290529091602090829060649082905f906001600160a01b03165af1801561057a57610b9c915f91610be3575061226d565b600b805460ff60b01b1916600160b01b17905560405190815233907fbae0ebb78f3a013a78ff0056662924b1eb7b73abafc1ddd5553c8b667abdaf5f90602090a260015f55005b610bfc915060203d602011610573576105658183611a32565b83610908565b60405162461bcd60e51b815260206004820152601d60248201527f4f6e6c7920617070726f76656420636c69656e742063616e2066756e640000006044820152606490fd5b60405162461bcd60e51b815260206004820152601760248201527f436f6e747261637420616c72656164792066756e6465640000000000000000006044820152606490fd5b60405162461bcd60e51b815260206004820152601c60248201527f4f66666572206d757374206265206163636570746564206669727374000000006044820152606490fd5b3461018f575f36600319011261018f575f6080604051610cf0816119f9565b828152826020820152826040820152826060820152015260a0600180821b0360015416600180831b0360025416600b549060405190610d2e826119f9565b83825260208201908152604082019060ff84871c161515825260ff60806060850194828760b01c1615158652019460a81c1615158452604051948552600180871b039051166020850152511515604084015251151560608301525115156080820152f35b3461018f575f36600319011261018f57610daa611bef565b610db2611ca6565b90610de4610dbe611d3b565b610dc6611dd0565b6007546008549060ff6009541692600a549460405198899889611991565b0390f35b3461018f575f36600319011261018f57600d54610e0481612241565b90610e126040519283611a32565b808252601f19610e2182612241565b015f5b818110610f2b5750505f5b818110610e9d57826040518091602082016020835281518091526040830190602060408260051b8601019301915f905b828210610e6e57505050500390f35b91936001919395506020610e8d8192603f198a82030186528851611acc565b9601920192018594939192610e5f565b80610ea9600192611f03565b838060a01b0391549060031b1c165f52600c60205260405f2060ff600360405192610ed3846119f9565b858060a01b038154168452610ee9868201611e65565b60208501526002810154604085015201548181161515606084015260081c1615156080820152610f198286612259565b52610f248185612259565b5001610e2f565b602090610f3661218b565b82828701015201610e24565b3461018f575f36600319011261018f575f60e0604051610f6181611a15565b6060815260606020820152606060408201526060808201528260808201528260a08201528260c082015201526101006020604051610f9e81611a15565b610fa6611bef565b8152610fb0611ca6565b90828101918252610fbf611d3b565b9160408201928352610fcf611dd0565b926060830193845261106860075494608085019586526110556008549360a0870194855261104260ff600954169660c08901971515885261102f600a549960e081019a8b526040519d8d8f9e928f938452519201526101208d019061196d565b90518b8203601f190160408d015261196d565b9051898203601f190160608b015261196d565b9051878203601f1901608089015261196d565b935160a08601525160c085015251151560e0840152516101008301520390f35b3461018f575f36600319011261018f576001546001600160a01b03166110af3382146120d4565b600b5460ff8160a01c161561115d5760ff8160b01c1615611118576110da60ff8260a81c16156121f5565b60ff60a81b1916600160a81b17600b556040514281527f7df0c56e9db90664751b13964ef00ad6ee36a8f3aad8b7a3a51910fbf6f4a27a90602090a2005b60405162461bcd60e51b815260206004820152601760248201527f436f6e7472616374206d7573742062652066756e6465640000000000000000006044820152606490fd5b60405162461bcd60e51b815260206004820152601660248201527513d999995c881b5d5cdd081899481858d8d95c1d195960521b6044820152606490fd5b3461018f575f36600319011261018f576001546040516001600160a01b039091168152602090f35b3461018f57602036600319011261018f576004356001600160a01b0381169081900361018f576111fe60018060a01b036001541633146120d4565b61120c60ff60095416611f2f565b61121e60ff600b5460a01c1615611f71565b5f818152600c6020526040902054611240906001600160a01b031615156121b6565b805f52600c60205260ff600360405f20015460081c166112d257806bffffffffffffffffffffffff60a01b6002541617600255806bffffffffffffffffffffffff60a01b600e541617600e55805f52600c602052600360405f2001600160ff198254161790557fdff0cf58f6664e9803e20c37fe4cc699fddc59ea50ebf701c7e8a53488d2a96f6020604051428152a2005b60405162461bcd60e51b815260206004820152601460248201527314995c5d595cdd081dd85cc81c995a9958dd195960621b6044820152606490fd5b3461018f575f36600319011261018f57602060ff600b5460b01c166040519015158152f35b3461018f575f36600319011261018f57600b546040516370a0823160e01b815230600482015290602090829060249082906001600160a01b03165afa801561057a575f90611387575b602090604051908152f35b506020813d6020116113b2575b816113a160209383611a32565b8101031261018f576020905161137c565b3d9150611394565b3461018f575f36600319011261018f57602060ff600b5460a01c166040519015158152f35b3461018f575f36600319011261018f576020600d54604051908152f35b611b16565b3461018f575f36600319011261018f57600b546040516001600160a01b039091168152602090f35b3461018f575f36600319011261018f5761144e60018060a01b036001541633146120d4565b6114566122b9565b600b5460ff8160a81c16156115ca576040516370a0823160e01b8152306004820152906001600160a01b0316602082602481845afa91821561057a575f92611595575b506020826114e6926114ac821515612130565b60015460405163a9059cbb60e01b81526001600160a01b0390911660048201526024810192909252909283919082905f9082906044820190565b03925af190811561057a575f91611576575b501561153d576001546040519182526001600160a01b0316907feaff4b37086828766ad3268786972c0cd24259d4c87a80f9d3963a3c3d999b0d90602090a260015f55005b60405162461bcd60e51b815260206004820152601160248201527015da5d1a191c985dd85b0819985a5b1959607a1b6044820152606490fd5b61158f915060203d602011610573576105658183611a32565b826114f8565b9091506020813d6020116115c2575b816115b160209383611a32565b8101031261018f5751906020611499565b3d91506115a4565b60405162461bcd60e51b815260206004820152601760248201527f4f66666572206d75737420626520636f6d706c657465640000000000000000006044820152606490fd5b3461018f5761161d36611a54565b61162b60ff60095416611f2f565b61163d60ff600b5460a01c1615611f71565b61165360018060a01b0360015416331415611fb6565b335f908152600c6020526040902054611675906001600160a01b03161561200e565b60405190611682826119f9565b3380835260208084018381524260408087019182525f6060880181815260808901828152968252600c90955220955186546001600160a01b0319166001600160a01b03919091161786559051805190959293929190600183019067ffffffffffffffff8111610abc576116f58254611bb7565b601f81116117e6575b506020601f82116001146117915791816003949261086296946117519a9b5f926109ff5750508160011b915f1990871b1c19161790555160028201550192511515839060ff801983541691151516179055565b61175a3361204e565b7f6873da866771cd3de75446bd168a8ed23f58103edc9fad518cf0a4575df0e2af6040518061178c33944290836120b8565b0390a2005b601f19821698835f52815f20995f5b8181106117ce575092611751999a610862979593600193836003999710610a4857505050811b019055610845565b838301518c556001909b019a602093840193016117a0565b825f5260205f20601f830160051c81019160208410611821575b601f0160051c01905b81811061181657506116fe565b5f8155600101611809565b9091508190611800565b3461018f575f36600319011261018f576002546040516001600160a01b039091168152602090f35b3461018f575f36600319011261018f57604051806020600d5492838152018092600d5f527fd7b6990105719101dabeb77144f2a3385c8033acd3af97e9423a695e81ad1eb5905f5b8181106118fc57505050816118b1910382611a32565b604051918291602083019060208452518091526040830191905f5b8181106118da575050500390f35b82516001600160a01b03168452859450602093840193909201916001016118cc565b82546001600160a01b031684526020909301926001928301920161189b565b3461018f575f36600319011261018f57600754600854610de460ff60095416600a5490611946611bef565b9361194f611ca6565b95611958611d3b565b611960611dd0565b9060405198899889611991565b805180835260209291819084018484015e5f828201840152601f01601f1916010190565b94989796939060e096936119c76119e3946119b96119d5946101008b526101008b019061196d565b9089820360208b015261196d565b90878203604089015261196d565b90858203606087015261196d565b96608084015260a0830152151560c08201520152565b60a0810190811067ffffffffffffffff821117610abc57604052565b610100810190811067ffffffffffffffff821117610abc57604052565b90601f8019910116810190811067ffffffffffffffff821117610abc57604052565b602060031982011261018f5760043567ffffffffffffffff811161018f578160238201121561018f5780600401359067ffffffffffffffff8211610abc5760405192611aaa601f8401601f191660200185611a32565b8284526024838301011161018f57815f92602460209301838601378301015290565b9060018060a01b038251168152608080611af5602085015160a0602086015260a085019061196d565b93604081015160408501526060810151151560608501520151151591015290565b3461018f57602036600319011261018f576004356001600160a01b0381169081900361018f57611b4461218b565b505f52600c602052610de460405f2060ff600360405192611b64846119f9565b80546001600160a01b03168452611b7d60018201611e65565b60208501526002810154604085015201548181161515606084015260081c1615156080820152604051918291602083526020830190611acc565b90600182811c92168015611be5575b6020831014611bd157565b634e487b7160e01b5f52602260045260245ffd5b91607f1691611bc6565b604051905f8260035491611c0283611bb7565b8083529260018116908115611c875750600114611c28575b611c2692500383611a32565b565b5060035f90815290917fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b5b818310611c6b575050906020611c2692820101611c1a565b6020919350806001915483858901015201910190918492611c53565b60209250611c2694915060ff191682840152151560051b820101611c1a565b604051905f8260045491611cb983611bb7565b8083529260018116908115611c875750600114611cdc57611c2692500383611a32565b5060045f90815290917f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b5b818310611d1f575050906020611c2692820101611c1a565b6020919350806001915483858901015201910190918492611d07565b604051905f8260055491611d4e83611bb7565b8083529260018116908115611c875750600114611d7157611c2692500383611a32565b5060055f90815290917f036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db05b818310611db4575050906020611c2692820101611c1a565b6020919350806001915483858901015201910190918492611d9c565b604051905f8260065491611de383611bb7565b8083529260018116908115611c875750600114611e0657611c2692500383611a32565b5060065f90815290917ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f5b818310611e49575050906020611c2692820101611c1a565b6020919350806001915483858901015201910190918492611e31565b9060405191825f825492611e7884611bb7565b8084529360018116908115611ee15750600114611e9d575b50611c2692500383611a32565b90505f9291925260205f20905f915b818310611ec5575050906020611c26928201015f611e90565b6020919350806001915483858901015201910190918492611eac565b905060209250611c2694915060ff191682840152151560051b8201015f611e90565b600d54811015611f1b57600d5f5260205f2001905f90565b634e487b7160e01b5f52603260045260245ffd5b15611f3657565b60405162461bcd60e51b81526020600482015260136024820152724f66666572206973206e6f742061637469766560681b6044820152606490fd5b15611f7857565b60405162461bcd60e51b815260206004820152601660248201527513d999995c88185b1c9958591e481858d8d95c1d195960521b6044820152606490fd5b15611fbd57565b60405162461bcd60e51b8152602060048201526024808201527f4f776e65722063616e6e6f742072657175657374207468656972206f776e206f604482015263333332b960e11b6064820152608490fd5b1561201557565b60405162461bcd60e51b8152602060048201526011602482015270105b1c9958591e481c995c5d595cdd1959607a1b6044820152606490fd5b600d5468010000000000000000811015610abc5760018101600d55600d54811015611f1b57600d5f527fd7b6990105719101dabeb77144f2a3385c8033acd3af97e9423a695e81ad1eb50180546001600160a01b0319166001600160a01b03909216919091179055565b9291906120cf60209160408652604086019061196d565b930152565b156120db57565b60405162461bcd60e51b815260206004820152602760248201527f4f6e6c79206f66666572206f776e65722063616e2063616c6c207468697320666044820152663ab731ba34b7b760c91b6064820152608490fd5b1561213757565b60405162461bcd60e51b81526020600482015260146024820152734e6f2066756e647320746f20776974686472617760601b6044820152606490fd5b9081602091031261018f5751801515810361018f5790565b60405190612198826119f9565b5f608083828152606060208201528260408201528260608201520152565b156121bd57565b60405162461bcd60e51b815260206004820152601060248201526f139bc81c995c5d595cdd08199bdd5b9960821b6044820152606490fd5b156121fc57565b60405162461bcd60e51b815260206004820152601760248201527f4f6666657220616c726561647920636f6d706c657465640000000000000000006044820152606490fd5b67ffffffffffffffff8111610abc5760051b60200190565b8051821015611f1b5760209160051b010190565b1561227457565b60405162461bcd60e51b815260206004820152601760248201527f5061796d656e74207472616e73666572206661696c65640000000000000000006044820152606490fd5b60025f54146122c85760025f55565b60405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606490fdfea264697066735822122083cf460560367da8613f3b5b1e6757548307945b2bb524cbbcef21855963125164736f6c634300081c00333eea958396a6891e3cb24c953fbfb9b82843162fbb89db057597e6c7ed5ba836"
};
