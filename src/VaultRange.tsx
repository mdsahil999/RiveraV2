import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react'
import { useAccount, useContract, useContractRead, useProvider, useSigner } from 'wagmi';
import { strategyAbi } from './assets/json/strategyAbi.js'
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { InputNumber } from 'primereact/inputnumber';
//import Dropdown from "react-dropdown";
//import {strategyContractAddress} from './constants/global.js'
import { useParams } from 'react-router-dom';
import vaultAbiJson from '../src/assets/json/RiveraAutoCompoundingVaultV2Public.json'

export default function VaultRange() {
    //const contractAddress = "0xA7B88e482d3C9d17A1b83bc3FbeB4DF72cB20478";
    const strategyAbiLocal = [
        {
          "inputs": [
            {
              "components": [
                {
                  "internalType": "bool",
                  "name": "isTokenZeroDeposit",
                  "type": "bool"
                },
                {
                  "internalType": "int24",
                  "name": "tickLower",
                  "type": "int24"
                },
                {
                  "internalType": "int24",
                  "name": "tickUpper",
                  "type": "int24"
                },
                {
                  "internalType": "address",
                  "name": "stake",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "chef",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "reward",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "tickMathLib",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "sqrtPriceMathLib",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "liquidityMathLib",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "safeCastLib",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "liquidityAmountsLib",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "fullMathLib",
                  "type": "address"
                },
                {
                  "internalType": "uint24",
                  "name": "poolFee",
                  "type": "uint24"
                }
              ],
              "internalType": "struct CakePoolParams",
              "name": "_cakePoolParams",
              "type": "tuple"
            },
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "vault",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "router",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "NonfungiblePositionManager",
                  "type": "address"
                }
              ],
              "internalType": "struct CommonAddresses",
              "name": "_commonAddresses",
              "type": "tuple"
            },
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "OrderManager",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "indexTokenChainlink",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "leverage",
                  "type": "uint256"
                }
              ],
              "internalType": "struct ShortParams",
              "name": "_shortParams",
              "type": "tuple"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "tvl",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "Deposit",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "previousOwner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "OwnershipTransferred",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "Paused",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "int24",
              "name": "tickLower",
              "type": "int24"
            },
            {
              "indexed": false,
              "internalType": "int24",
              "name": "tickUpper",
              "type": "int24"
            }
          ],
          "name": "RangeChange",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "manager",
              "type": "address"
            }
          ],
          "name": "SetManager",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "unirouter",
              "type": "address"
            }
          ],
          "name": "SetRouter",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "vault",
              "type": "address"
            }
          ],
          "name": "SetVault",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "harvester",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "stakeHarvested",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "tvl",
              "type": "uint256"
            }
          ],
          "name": "StratHarvest",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "Unpaused",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "tvl",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "Withdraw",
          "type": "event"
        },
        {
          "inputs": [],
          "name": "NonfungiblePositionManager",
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
          "name": "OrderManager",
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
          "name": "_getChainlinkPrice",
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
          "name": "_increaseLiquidity",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "assetRatio",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "amount0Ratio",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amount1Ratio",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "balanceOf",
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
          "name": "balanceOfPool",
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
          "name": "beforeDeposit",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "int24",
              "name": "_tickLower",
              "type": "int24"
            },
            {
              "internalType": "int24",
              "name": "_tickUpper",
              "type": "int24"
            }
          ],
          "name": "changeRange",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "chef",
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
          "name": "deposit",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "depositV3",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "fullMathLib",
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
          "name": "getDepositToken",
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
          "name": "harvest",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "indexTokenChainlink",
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
          "name": "isTokenZeroDeposit",
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
          "name": "lastHarvest",
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
          "name": "leverage",
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
          "name": "liquidityAmountsLib",
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
          "name": "liquidityMathLib",
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
          "name": "lpToken0",
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
          "name": "lpToken1",
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
          "name": "manager",
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
          "name": "managerHarvest",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            },
            {
              "internalType": "bytes",
              "name": "",
              "type": "bytes"
            }
          ],
          "name": "onERC721Received",
          "outputs": [
            {
              "internalType": "bytes4",
              "name": "",
              "type": "bytes4"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "onlyManager",
          "outputs": [],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "onlyVault",
          "outputs": [],
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
          "name": "panic",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "pause",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "paused",
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
          "name": "poolFee",
          "outputs": [
            {
              "internalType": "uint24",
              "name": "",
              "type": "uint24"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "renounceOwnership",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "retireStrat",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "reward",
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
          "name": "rewardsAvailable",
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
          "name": "router",
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
          "name": "safeCastLib",
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
              "name": "_manager",
              "type": "address"
            }
          ],
          "name": "setManager",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_router",
              "type": "address"
            }
          ],
          "name": "setRouter",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_vault",
              "type": "address"
            }
          ],
          "name": "setVault",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "sqrtPriceMathLib",
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
          "name": "stake",
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
          "name": "tickLower",
          "outputs": [
            {
              "internalType": "int24",
              "name": "",
              "type": "int24"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "tickMathLib",
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
          "name": "tickUpper",
          "outputs": [
            {
              "internalType": "int24",
              "name": "",
              "type": "int24"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "tokenID",
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
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "transferOwnership",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "unpause",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "vault",
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
              "internalType": "uint256",
              "name": "_amount",
              "type": "uint256"
            }
          ],
          "name": "withdraw",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "withdrawResidualBalance",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_amount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_sizeChange",
              "type": "uint256"
            },
            {
              "internalType": "enum MarketNeutralV1.UpdatePositionType",
              "name": "_updateType",
              "type": "uint8"
            }
          ],
          "name": "withdrawShortPosition",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        }
      ];
    const [strategyAddress, setStrategyAddress] = useState('');
    const provider = useProvider();
    const { data: signer, isError, isLoading } = useSigner();
    
    const { address } = useAccount()
    //const [haveMetamask, sethaveMetamask] = useState(true);
    const [accountAddress, setAccountAddress] = useState("");
    const [accountBalance, setAccountBalance] = useState("");
    const [isConnected, setIsConnected] = useState(true);
    const [minRange, setminRange] = useState(0.0028779);
    const [maxRange, setmaxRange] = useState(0.0035503);
    //const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const options = ["0.05"];
    const [seletedFee, setSelectedFee] = useState(options[0]);
    const [whiteListedAddresses, setWhiteListedAddresses] = useState([
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "0x78731d3ca6b7e34ac0f824c42a7cc18a495cabab",
    ]);

    const [rangeType, setRangeType] = useState<string>('manual');

    let { vaultAddress } = useParams();

    //const { ethereum } = window;
    //const provider = new ethers.providers.Web3Provider(window.ethereum);

    useEffect(() => {
        // const { ethereum } = window;
        // const checkMetamaskAvailability = async () => {
        //   if (!ethereum) {
        //     sethaveMetamask(false);
        //   }
        //   sethaveMetamask(true);
        // };
        //checkMetamaskAvailability();
        
        //getCurrentRange();
    }, []);

    //   const connectWallet = async () => {
    //     if (ethereum.networkVersion == 56) {
    //       try {
    //         if (!ethereum) {
    //           sethaveMetamask(false);
    //         }
    //         // console.log(ethereum.networkVersion, "window.ethereum.networkVersion");
    //         const accounts = await ethereum.request({
    //           method: "eth_requestAccounts",
    //         });
    //         let balance = await provider.getBalance(accounts[0]);
    //         let bal = ethers.utils.formatEther(balance);
    //         console.log(bal, "bal");
    //         setAccountAddress(accounts[0]);
    //         setAccountBalance(bal);
    //         setIsConnected(true);
    //       } catch (error) {
    //         setIsConnected(false);
    //       }
    //     } else {
    //       alert("Please connect to BSC network");
    //     }
    //   };

    const getContract = (address: string, abi: any, provider: any) => {
        return new ethers.Contract(address, abi, provider);
    }

    const updateStrategyContractAddress = async () =>{
        debugger
        const contract = getContract(vaultAddress as string, vaultAbiJson['abi'], signer);
        const result = await contract.strategy();
        return result;
    }

    const getCurrentRange = async () => {
        if (typeof window.ethereum !== "undefined") {
            
            const strategyAddressVal =  await updateStrategyContractAddress();
            //const signer = provider.getSigner();
            
            const marketNeutralContract = getContract(
                strategyAddressVal,
                strategyAbiLocal,
                signer
            );
            debugger
            let currentTickLower = await marketNeutralContract.tickLower();
            let currentTickUpper = await marketNeutralContract.tickUpper();
            let lowerRange = Math.pow(1.0001, currentTickLower);
            let upperRange = Math.pow(1.0001, currentTickUpper);
            setminRange(lowerRange);
            setmaxRange(upperRange);
            console.log(lowerRange, "lowerRange");
            console.log(upperRange, "upperRange");
        } else {
            alert("Please install MetaMask");
        }
    };

    const calculateTicks = (price: number) => {
        // //gtihub got
        // const tickSpacing = 60;
        // const tick =
        //   Math.round(Math.log(price) / Math.log(1.0001) / tickSpacing) *
        //   tickSpacing;
        // return tick;

        //akshays
        const tick = Math.round(Math.log(price) / Math.log(1.0001));
        return tick;
    };

    const submitFunction = async () => {
        // setNumber(0);
        //setLoading(true);
        
        if (typeof window.ethereum !== "undefined") {
            //const signer = provider.getSigner();
            const strategyAddressVal = await updateStrategyContractAddress();
            debugger
            const marketNeutralContract = getContract(
                strategyAddressVal,
                strategyAbiLocal,
                signer
            );
            console.log(minRange, "minRange");
            console.log(maxRange, "maxRange");
            console.log(seletedFee, "seletedFee");
            let tickLower = calculateTicks(minRange);
            let tickUpper = calculateTicks(maxRange);
            console.log(tickLower, "tickLower");
            console.log(tickUpper, "tickUpper");

            let manager = await marketNeutralContract.manager();
            console.log(manager, "manager");
            const transactionResponse = await marketNeutralContract.changeRange(
                tickLower,
                tickUpper
            );

            console.log(transactionResponse);
            // await transactionResponse.wait();
            await listenForTransactionMine(transactionResponse, provider);
            getCurrentRange();

            try {
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        } else {
            alert("Please install MetaMask");
        }
    };

    const whiteListAddress = async () => {
        console.log(address, "address");
    };

    function listenForTransactionMine(transactionResponse: any, provider: any): any {
        console.log(`Mining ${transactionResponse.hash}`);
        return new Promise<void>((resolve, reject) => {
            provider.once(transactionResponse.hash, (transactionReceipt: any) => {
                console.log(
                    `Completed with ${transactionReceipt.confirmations} confirmations. `
                );
                alert("Update Completed");
                resolve();
            });
        });
    }

    return (
        <div className='container'>
            <div className='outer_section'>
                <div className='mrgn_left_10'>Vault Name: USDT-Neutral CAKE Farming</div>
                <div className='mrgn_left_10'>Pool: USDT-BNB LP</div>
                <div className='mrgn_left_10'>DEX: PancakeSwap v3</div>
                <div className='mrgn_left_10 mb-3'>APR: 34.56%</div>
                <div className='mrgn_left_10 fnt_wgt_600'>Short Position Setup</div>
                <div className='mrgn_left_10'>Perpetual protocol: Level Finance</div>
                <div className='mrgn_left_10'>Short Leverage: 3</div>
                <div className='mrgn_left_10 mb-4'>Rebalancing Threshold: 10%</div>
                <div className='outer_section'>
                    <div>v3 Liquidity Range selection</div>
                    <div className="mb-3 mt-1">
                        <div className="mb-1">
                            <RadioButton inputId="ingredient1" name="pizza" value="automatic" onChange={(e: RadioButtonChangeEvent) => setRangeType(e.value)} checked={rangeType === 'automatic'} />
                            <label htmlFor="ingredient1" className="ml-2">Automatic</label>
                        </div>
                        <div>
                            <RadioButton inputId="ingredient2" name="pizza" value="manual" onChange={(e: RadioButtonChangeEvent) => setRangeType(e.value)} checked={rangeType === 'manual'} />
                            <label htmlFor="ingredient2" className="ml-2">Manual</label>
                        </div>
                    </div>
                    <div className="d-flex flex-wrap gap-3 mb-3">
                        <div>Fee tier</div>
                        <div>
                            <RadioButton inputId="feeTier1" name="pizza" value="0.05" onChange={(e: RadioButtonChangeEvent) => setSelectedFee(e.value)} checked={seletedFee === '0.05'} />
                            <label htmlFor="feeTier1" className="ml-2">0.05</label>
                        </div>
                        <div>
                            <RadioButton inputId="feeTier2" name="pizza" value="0.3" onChange={(e: RadioButtonChangeEvent) => setSelectedFee(e.value)} checked={seletedFee === '0.3'} />
                            <label htmlFor="feeTier2" className="ml-2">0.3</label>
                        </div>
                        <div>
                            <RadioButton inputId="feeTier3" name="pizza" value="1" onChange={(e: RadioButtonChangeEvent) => setSelectedFee(e.value)} checked={seletedFee === '1'} />
                            <label htmlFor="feeTier3" className="ml-2">1</label>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3 p-fluid mb-3">
                        <div className="flex-auto mb-2">
                            <label htmlFor="min-buttons" className="font-bold block mb-2">Min Range</label>
                            {/* <input value={minRange} onChange={(e: any) => setminRange(e.value)} /> */}
                            <InputNumber inputId="min-buttons" value={minRange} onValueChange={(e: any) => setminRange(e.value)} maxFractionDigits={10}  showButtons min={0} max={100} />
                        </div>
                        <div className="flex-auto">
                            <label htmlFor="max-buttons" className="font-bold block mb-2">Max Range</label>
                            {/* <input value={minRange} onChange={(e: any) => setmaxRange(e.value)} /> */}
                            <InputNumber inputId="max-buttons" value={maxRange} onValueChange={(e: any) => setmaxRange(e.value)} maxFractionDigits={10}  showButtons min={0} max={100} />
                        </div>
                    </div>
                    <div>
                        <button className='btn btn-riv-primary' onClick={submitFunction}>Update</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
