import { BigNumber, ethers } from 'ethers';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAccount, useBalance, useNetwork, useProvider, useSigner, useSwitchNetwork } from 'wagmi';
import { TabView, TabPanel } from 'primereact/tabview';
import { ProductService } from './service/ProductService';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { ProgressBar } from 'primereact/progressbar';
import lockImg from './assets/images/lock.png'
import upImg from './assets/images/up.png';
import helpImg from './assets/images/help-circle.png';
import venusImg from './assets/images/venus.svg';
import globeImg from './assets/images/globe.png';
import arrowUpImg from './assets/images/arrow-up-right.png';
import copyImg from './assets/images/copy.png';
import eternalLinkImg from './assets/images/external-link.png';
import bnbImg from './assets/images/bnb.png';
import ethImg from './assets/images/eth.png';
import erc20Json from './abi/out/ERC20.sol/ERC20.json'
import dollarImg from './assets/images/dollar.png';
import saftyImg from './assets/images/safty.png';
import graphIMg from './assets/images/graph.png';
import riveraAutoCompoundingVaultV2WhitelistedJson from './abi/out/RiveraAutoCompoundingVaultV2Whitelisted.sol/RiveraAutoCompoundingVaultV2Whitelisted.json'
import { FACTORY_CONTRACT_DEPLOYMENT_BLOCK, RPCUrl, mantleRPCUrl } from './constants/global.js'
import pancakeFullImg from './assets/images/pancakeFull.svg';
import StablePairColorImg from './assets/images/StablePairColor.svg';
import almImg from './assets/images/alm.svg';
import LSDFarmingImg from './assets/images/LSDFarming.svg';
import bitLogoImg from './assets/images/bitLogo.png';
import { Toast } from 'primereact/toast';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  quantity: number;
  inventoryStatus: string;
  rating: number;
}

export default function VaultDetails() {

  const toast = useRef<Toast>(null);
  const [deatils, setDeatils] = useState({
    "vaultName": "",
    "assetName": "",
    "assetImg": "",
    "tvl": "",
    "tvlInusd": "",
    "holding": "",
    "networkImg": ""
  });
  const [isWhiteListed, setWhiteListed] = useState(false);
  const [maxLimit, setMaxLimit] = useState(0);
  const [valutJsonData, setValutJsonData] = useState<any>();
  const [latestBlockNumber, setLatestBlockNumber] = useState(0);
  const [tvlCap, setTvlCal] = useState("");
  const [userTvlCap, setUserTvlCap] = useState("");

  const [tvlCapInUsd, setTvlCalInUsd] = useState("");
  const [userTvlCapInUsd, setUserTvlCapInUsd] = useState("");

  const [depositerNumber, setDepositerNumber] = useState("");

  const [userApy, setUserApy] = useState("");
  const [vaultApy, setVaultApy] = useState("");
  const [holding, setHolding] = useState("");
  const [userShare, setUserShare] = useState("");
  const [userShareInUsd, setUserShareInUsd] = useState("");
  const [useroverallReturn, setUserOverallReturn] = useState("");
  const [isApproved, setisApproved] = useState(false);
  const [depositAmout, setdepositAmout] = useState(0);
  const [withdrawAmout, setwithdrawAmout] = useState(0);
  const provider = useProvider();
  const { data: signer, isError, isLoading } = useSigner();
  const { address, isConnected } = useAccount()
  const [products, setProducts] = useState<Product[]>([]);
  let { vaultAddress } = useParams();
  const [loading, setLoading] = useState(false);
  const balance = useBalance({
    address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
  });
  const switchNetwork = useSwitchNetwork();
  const { chain } = useNetwork();

  useEffect(() => {
    setLoading(true);
    ProductService.getProductsMini().then(data => setProducts(data));
    fetchJsonData();
    if (address) {
      checkAllowance();
    }
    getAllDetails();

  }, []);

  const showWarn = (message: string) => {
    
    toast.current?.show({severity:'warn', summary: 'Warning', detail:message, life: 3000});
}

  const fetchJsonData = async () => {
    try {
      const response = await fetch('/vaultDetails.json'); 
      const data = await response.json();
      setValutJsonData(data[vaultAddress as string]);
    } catch (error) {
      console.log('Error fetching JSON data:', error);
    }
  };

  const getContract = (address: string, abi: any, provider: any) => {
    return new ethers.Contract(address, abi, provider);
  }

  const checkAllowance = async () => {
    const response = await fetch('/vaultDetails.json');
    const data = await response.json();
    const valutChainId = data[vaultAddress as string]

    let localProvider;
    let vaultContract;
    if (valutChainId.id === "56") {
      localProvider = new ethers.providers.JsonRpcProvider(RPCUrl);
      vaultContract = getContract(vaultAddress as string, riveraAutoCompoundingVaultV2WhitelistedJson.abi, localProvider.getSigner());
    } else {
      localProvider = new ethers.providers.JsonRpcProvider(mantleRPCUrl);
      vaultContract = getContract(vaultAddress as string, riveraAutoCompoundingVaultV2WhitelistedJson.abi, localProvider.getSigner());
    }


    const valutAssetAdress = await vaultContract.asset();

    const erc20Contract = getContract(valutAssetAdress, erc20Json.abi, localProvider.getSigner())
    const allowance = await erc20Contract.allowance(address, vaultAddress); //address:- login user address  //assetAdress:-valut asset address
    let convertedallowance = allowance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 18 });
    convertedallowance = convertedallowance.replace(/,/g, '');
    setMaxLimit(convertedallowance / Math.pow(10, 18));
    if (+convertedallowance > 0) {
      setisApproved(true);
    }
  }



  const deposit = async () => {

    if(depositAmout < 0.0001 || depositAmout > maxLimit){
      const message = "Please enter a valid amount.";
      showWarn(message);
      return;
    }
   
    const contract = getContract(vaultAddress as string, riveraAutoCompoundingVaultV2WhitelistedJson.abi, signer);
    const amount = depositAmout * Math.pow(10, 18);
    let convertedAmount = amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 18 });
    convertedAmount = convertedAmount.replace(/,/g, '');


    //calling the deposit method
    const aprvTxt = await contract.deposit(convertedAmount, address, {
      gasLimit: 800000
    });
    setLoading(true);
    await aprvTxt.wait().then((e: any) => {
      checkAllowance();
      getAllDetails();
    });
  }

  const withdraw = async () => {

    if(withdrawAmout < 0.0001 || withdrawAmout > Number(userShare)){
      const message = "Please enter a valid amount.";
      showWarn(message);
      return;
    }

    const contract = getContract(vaultAddress as string, riveraAutoCompoundingVaultV2WhitelistedJson.abi, signer);
    //convverting the deposit ampount to 10^18 format
    const amount = withdrawAmout * Math.pow(10, 18);
    let convertedAmount = amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 18 });
    convertedAmount = convertedAmount.replace(/,/g, '');

    //calling the deposit method
    const aprvTxt = await contract.withdraw(convertedAmount, address, address);
    setLoading(true);
    await aprvTxt.wait().then((e: any) => {
      checkAllowance();
      getAllDetails();
    });
  }

  const approveIntilize = async () => {
    const contract = getContract(vaultAddress as string, riveraAutoCompoundingVaultV2WhitelistedJson.abi, signer);
    const assetAdress = await contract.asset();
    await approve(assetAdress);
  }

  async function approve(assetsAddress: string) {

    const contract = getContract(assetsAddress, erc20Json.abi, signer);
    try {
      const amount = 500e18;
      let convertedAmount = amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 18 });
      convertedAmount = convertedAmount.replace(/,/g, '')
      const aprvTxt = await contract.approve(vaultAddress, BigNumber.from(convertedAmount));
      await aprvTxt.wait().then((e: any) => {
        setisApproved(true);
      });

    } catch (err: any) {
      console.log('revert reason:', err.message);
    }
  }

  const handledepositAmoutChange = (event: any) => {
    setdepositAmout(event.target.value);
  };

  const handlewithdrawAmoutChange = (event: any) => {
    setwithdrawAmout(event.target.value);
  };

  // Get all sections that have an ID defined
  const sections = document.querySelectorAll("section[id]");

  // Add an event listener listening for scroll
  window.addEventListener("scroll", navHighlighter);

  function navHighlighter() {

    // Get current scroll position
    let scrollY = window.pageYOffset;

    // Now we loop through sections to get height, top and ID values for each
    sections.forEach((current: any) => {
      const sectionHeight = current['offsetHeight'];
      const sectionTop = (current.getBoundingClientRect().top + window.pageYOffset) - 100;
      const sectionId = current.getAttribute("id");

      if (
        scrollY > sectionTop &&
        scrollY <= sectionTop + sectionHeight
      ) {
        document.querySelector(".navigation a[href*=" + sectionId + "]")?.classList.add("active");
      } else {
        document.querySelector(".navigation a[href*=" + sectionId + "]")?.classList.remove("active");
      }
    });
  }

  const getAllDetails = async () => {

    const response = await fetch('/vaultDetails.json'); // Assuming the JSON file is named "data.json" and located in the public folder.
    const data = await response.json();
    const valutChainId = data[vaultAddress as string]

    let localProvider;
    let vaultContract;
    
    if (valutChainId.id === "56") {
      localProvider = new ethers.providers.JsonRpcProvider(RPCUrl);
      vaultContract = getContract(vaultAddress as string, riveraAutoCompoundingVaultV2WhitelistedJson.abi, localProvider.getSigner());
    } else {
      localProvider = new ethers.providers.JsonRpcProvider(mantleRPCUrl);
      vaultContract = getContract(vaultAddress as string, riveraAutoCompoundingVaultV2WhitelistedJson.abi, localProvider.getSigner());
    }

    const asset = await vaultContract.asset(); //it will return the name of the asset of the valut

    let assetName = "";
    let assetImg = "";
    let networkImg = "";
    if (asset === "0x2170Ed0880ac9A755fd29B2688956BD959F933F8") {
      assetName = "ETH";
      assetImg = ethImg;
      networkImg = "../img/bnbChain.png";
    } else if (asset === "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c") {
      assetName = "BNB";
      assetImg = bnbImg;
      networkImg = "../img/bnbChain.png";
    } else if (asset === "0x8734110e5e1dcF439c7F549db740E546fea82d66") {
      assetName = "MNT";
      assetImg = "../img/mantle.svg";
      networkImg = "../img/mantleLogo.png"
    }

    //get asset current price
    const convertedPrice = await getPriceInUsd(asset);

    //fetch valut name
    const valutName = await vaultContract.name();

    let totalAssets = await vaultContract.totalAssets(); //it will return the total assets of the valut
    totalAssets = (totalAssets / Math.pow(10, 18));

    //calculate tvl and tvl inusd
    const tvl = totalAssets;
    const tvlInUsd = Number(tvl * convertedPrice).toFixed(2);


    const detailsVal = {
      "vaultName": valutName.toString(),
      "assetName": assetName,
      "assetImg": assetImg,
      "tvl": tvl.toString(),
      "tvlInusd": tvlInUsd.toString(),
      "holding": "",
      "networkImg": networkImg
    }
    setDeatils(detailsVal);

    let totalValutDeposit = 0;
    let totalValutDepositWithTime = 0;
    let totalUserDeposit = 0;
    let totalUserDepositWithTime = 0;

    let totalValutwithdraw = 0;
    let totalValutwithdrawWithTime = 0;
    let totalUserwithdraw = 0;
    let totalUserwithdrawWithTime = 0;

    if (address) {
      const isWhiteListed = await vaultContract.whitelist(address);
      setWhiteListed(isWhiteListed);
      let tvlCap = await vaultContract.totalTvlCap();
      tvlCap = tvlCap / Math.pow(10, 18);
      setTvlCal(tvlCap);
      const tvlCapInUsdval = (tvlCap * convertedPrice).toFixed(2);
      setTvlCalInUsd(tvlCapInUsdval);

      let userTvlCap = await vaultContract.userTvlCap(address);
      userTvlCap = userTvlCap / Math.pow(10, 18);
      setUserTvlCap(userTvlCap);
      const userTvlCapInUsdval = (userTvlCap * convertedPrice).toFixed(2);
      setUserTvlCapInUsd(userTvlCapInUsdval);

      let share = await vaultContract.balanceOf(address);
      share = share / Math.pow(10, 18);
      let totalSupply = await vaultContract.totalSupply();
      totalSupply = totalSupply / Math.pow(10, 18);
      const userShareVal = (totalAssets * share) / totalSupply;
      setUserShare(userShareVal.toFixed(2));
      setUserShareInUsd((userShareVal * convertedPrice).toFixed(2));


      const depositFilter = vaultContract.filters.Deposit();
      const withdrawFilter = vaultContract.filters.Withdraw();

      const distinctDepositerSet = new Set();
      const latestBlockNumberval = await localProvider.getBlockNumber();
      const batchSize = 10000;
      const blocksToProcess = latestBlockNumberval - FACTORY_CONTRACT_DEPLOYMENT_BLOCK;

      for (let i = 0; i < blocksToProcess; i += batchSize) {
        const firstBlock = FACTORY_CONTRACT_DEPLOYMENT_BLOCK + i;
        const lastBlock = Math.min(firstBlock + batchSize - 1, latestBlockNumberval);

        const depositLogs = await vaultContract.queryFilter(depositFilter, firstBlock, lastBlock);

        // eslint-disable-next-line no-loop-func
        await Promise.all(depositLogs.map(async (log: any) => {
          const timestamp = (await log.getBlock()).timestamp;
          const depositer = log.args[0];
          const assets = Number(log.args.assets);
          const dateTime = timestamp;

          totalValutDeposit += assets;
          totalValutDepositWithTime += assets * dateTime;
          distinctDepositerSet.add(depositer);

          if (depositer === address) {
            totalUserDeposit += assets;
            totalUserDepositWithTime += assets * dateTime;
          }
        }));

        const distinctDepositerCount = distinctDepositerSet.size;
        setDepositerNumber(distinctDepositerCount.toString());

        totalValutDeposit /= Math.pow(10, 18);
        totalValutDepositWithTime /= Math.pow(10, 18);
        totalUserDeposit /= Math.pow(10, 18);
        totalUserDepositWithTime /= Math.pow(10, 18);


        const withdrawLogs = await vaultContract.queryFilter(withdrawFilter, firstBlock, lastBlock);
        // eslint-disable-next-line no-loop-func
        await Promise.all(withdrawLogs.map(async (log: any) => {
          const timestamp = (await log.getBlock()).timestamp;
          const assets = Number(log.args.assets);
          const dateTime = timestamp;
          const isUserWithdrawal = log.args[0] === address

          totalValutwithdraw += assets;
          totalValutwithdrawWithTime += assets * dateTime;

          if (isUserWithdrawal) {
            totalUserwithdraw += assets;
            totalUserwithdrawWithTime += assets * dateTime;
          }

        }));

        totalValutwithdraw /= Math.pow(10, 18);
        totalValutwithdrawWithTime /= Math.pow(10, 18);
        totalUserwithdraw /= Math.pow(10, 18);
        totalUserwithdrawWithTime /= Math.pow(10, 18);

      }


      let overallReturn = ((userShareVal + totalUserwithdraw) - totalUserDeposit);
      setUserOverallReturn(overallReturn.toFixed(2));

      const userApyVal = (userShareVal - (totalUserDeposit - totalUserwithdraw)) / (totalUserDepositWithTime - totalUserwithdrawWithTime);
      setUserApy(userApyVal.toFixed(2));

      const valutApyVal = (tvl - (totalValutDeposit - totalValutwithdraw)) / (totalValutDepositWithTime - totalValutwithdrawWithTime);
      setVaultApy(valutApyVal.toFixed(2));

    } else {
      let tvlCap = await vaultContract.totalTvlCap();
      tvlCap = tvlCap / Math.pow(10, 18);
      setTvlCal(tvlCap);
      const tvlCapInUsdval = (tvlCap * convertedPrice).toFixed(2);
      setTvlCalInUsd(tvlCapInUsdval);

      const depositFilter = vaultContract.filters.Deposit();
      const withdrawFilter = vaultContract.filters.Withdraw();

      const distinctDepositerSet = new Set();
      const latestBlockNumberval = await localProvider.getBlockNumber();
      const batchSize = 10000;
      const blocksToProcess = latestBlockNumberval - FACTORY_CONTRACT_DEPLOYMENT_BLOCK;

      for (let i = 0; i < blocksToProcess; i += batchSize) {
        const firstBlock = FACTORY_CONTRACT_DEPLOYMENT_BLOCK + i;
        const lastBlock = Math.min(firstBlock + batchSize - 1, latestBlockNumberval);

        const depositLogs = await vaultContract.queryFilter(depositFilter, firstBlock, lastBlock);

        // eslint-disable-next-line no-loop-func
        await Promise.all(depositLogs.map(async (log: any) => {
          const timestamp = (await log.getBlock()).timestamp;
          const depositer = log.args[0];
          const assets = Number(log.args.assets);
          const dateTime = timestamp;

          totalValutDeposit += assets;
          totalValutDepositWithTime += assets * dateTime;
          distinctDepositerSet.add(depositer);
        }));

        const distinctDepositerCount = distinctDepositerSet.size;
        setDepositerNumber(distinctDepositerCount.toString());

        totalValutDeposit /= Math.pow(10, 18);
        totalValutDepositWithTime /= Math.pow(10, 18);

        const withdrawLogs = await vaultContract.queryFilter(withdrawFilter, firstBlock, lastBlock);
        // eslint-disable-next-line no-loop-func
        await Promise.all(withdrawLogs.map(async (log: any) => {
          const timestamp = (await log.getBlock()).timestamp;
          const assets = Number(log.args.assets);
          const dateTime = timestamp;

          totalValutwithdraw += assets;
          totalValutwithdrawWithTime += assets * dateTime;

        }));

        totalValutwithdraw /= Math.pow(10, 18);
        totalValutwithdrawWithTime /= Math.pow(10, 18);
      }

      const valutApyVal = (tvl - (totalValutDeposit - totalValutwithdraw)) / (totalValutDepositWithTime - totalValutwithdrawWithTime);
      setVaultApy(valutApyVal.toFixed(2));
    }
    setLoading(false);
  }

  const networkSwitchHandler = (networkId: number) => {
    (switchNetwork as any).switchNetwork(networkId)
  };

  async function getPriceInUsd(address: string): Promise<any> {
    let priceAddress = "";
    if (address === "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c") {
      priceAddress = "0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE";
    } else if (address === "0x2170Ed0880ac9A755fd29B2688956BD959F933F8") {
      priceAddress = "0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e";
    } else if (address === "0x8734110e5e1dcF439c7F549db740E546fea82d66") {
      return new Promise((resolve, reject) => {
        resolve(Number(0.5));
      });
    }
    const providerVal = new ethers.providers.JsonRpcProvider("https://bsc-dataseed1.binance.org")  //https://data-seed-prebsc-1-s1.binance.org:8545/ for local testnet
    const aggregatorV3InterfaceABI = [{ "inputs": [{ "internalType": "address", "name": "_aggregator", "type": "address" }, { "internalType": "address", "name": "_accessController", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "int256", "name": "current", "type": "int256" }, { "indexed": true, "internalType": "uint256", "name": "roundId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "updatedAt", "type": "uint256" }], "name": "AnswerUpdated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "roundId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "startedBy", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "startedAt", "type": "uint256" }], "name": "NewRound", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }], "name": "OwnershipTransferRequested", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "inputs": [], "name": "acceptOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "accessController", "outputs": [{ "internalType": "contract AccessControllerInterface", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "aggregator", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_aggregator", "type": "address" }], "name": "confirmAggregator", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "description", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_roundId", "type": "uint256" }], "name": "getAnswer", "outputs": [{ "internalType": "int256", "name": "", "type": "int256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint80", "name": "_roundId", "type": "uint80" }], "name": "getRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_roundId", "type": "uint256" }], "name": "getTimestamp", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestAnswer", "outputs": [{ "internalType": "int256", "name": "", "type": "int256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestRound", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestTimestamp", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint16", "name": "", "type": "uint16" }], "name": "phaseAggregators", "outputs": [{ "internalType": "contract AggregatorV2V3Interface", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "phaseId", "outputs": [{ "internalType": "uint16", "name": "", "type": "uint16" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_aggregator", "type": "address" }], "name": "proposeAggregator", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "proposedAggregator", "outputs": [{ "internalType": "contract AggregatorV2V3Interface", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint80", "name": "_roundId", "type": "uint80" }], "name": "proposedGetRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "proposedLatestRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_accessController", "type": "address" }], "name": "setController", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_to", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }]
    const priceFeed = new ethers.Contract(priceAddress, aggregatorV3InterfaceABI, providerVal)
    const roundData = await priceFeed.latestRoundData();
    let decimals = await priceFeed.decimals();
    return new Promise((resolve, reject) => {
      resolve(Number((roundData.answer.toString() / Math.pow(10, decimals)).toFixed(2)));
    });
  }

  const goToUrl = (url: any) => {
    window.open(url, '_blank');
  }

  const gotoDiscord = () =>{
    const url = 'https://discord.com/invite/sbMxwS6VEV';
    window.open(url, '_blank');
  }



  return (
    <>
      {loading ? <><div className="loader-container">
        <div className="spinner"></div>
      </div></> : <>
        <div className='custom-container mt-4'>
        <Toast ref={toast} />
          <div className='row'>
            <div className='col-md-8'>
              <div className="small-div-1"></div>
              <div className='first_section outer_section'>
                <div className='dsp'>
                  <div className='header_font_size'><span><img src={deatils?.assetImg} alt='btc img' className='btc_img_width' /></span>{deatils?.vaultName}</div>
                  <div className='chain_pos_det'>
                    <span><img src={deatils?.networkImg} alt='chain' /></span>
                  </div>
                </div>
                <div className='dsp dspWrap mt-3 mb-4'>
                  
                    {valutJsonData?.isStablePair ? 
                    <><div className='trdng_outer'> <span className='trdng_width'><img src={StablePairColorImg} className='ml_8' alt='arrow img' />Stable Pair</span> </div></>:<></>}
                   
                 
                  
                    {valutJsonData?.isLiquidityMining ? 
                    <><div className='trdng_outer'> <span className='trdng_width'><img src={almImg} className='ml_8' alt='arrow img' />Liquidity Mining</span> </div></> : <></>}    
                 
                  
                    {valutJsonData?.isLSDFarming ? 
                    <><div className='trdng_outer'> <span className='trdng_width'><img src={LSDFarmingImg} className='ml_8' alt='arrow img' />LSD Farming</span> </div></> : <></>}
                 
                 
                    {valutJsonData?.isVolatilePair ? 
                    <>  <div className='trdng_outer'> <span className='trdng_width'><img src={StablePairColorImg} className='ml_8' alt='arrow img' />Volatile Pair</span> </div></> : <></>}
                  

                  <div className='trdng_outer'>
                    <span className='wthlist_back'><img src={lockImg} alt='lock img' className='wthlist_back_img' />Whitelisted</span>
                  </div>
                  <div className='trdng_outer'>
                    <div>Safety Score <br /> <span className='holding_val'>{valutJsonData?.risk?.safetyScore} <img src={saftyImg} alt='safty img' className='sftyImgWdth' /></span></div>
                  </div>
                </div>
                <div className='dsp mb-3 wdth_80'>
                  <div>Average APY <br /> <span className='holding_val'>{vaultApy}%</span></div>
                  <div>TVL <br /> <span className='fnt_wgt_600'>${deatils.tvlInusd}</span></div>
                  <div>DEX <br /> <span><img src={valutJsonData?.poweredBy} alt='pancake' /></span></div><div>LP Pool & Fee Tier <br /> <span className='fnt_wgt_600'>{valutJsonData?.strategy?.pool}</span></div>
                </div>

              </div>
              <div className='second_section outer_section nav_design'>
                <nav className="navigation">
                  <ul>
                    <li><a href="#overview">Overview</a></li>
                    <li><a href="#strategy">Strategy</a></li>
                    <li><a href="#risk">Risk</a></li>
                    <li><a href="#portfolioManager">Portfolio Manager</a></li>
                    <li><a href="#fees">Fees</a></li>
                    <li><a href="#transactions">Transactions</a></li>
                    <li><a href="#depositors">Depositors</a></li>
                    <li><a href="#fAQ">FAQ</a></li>
                  </ul>
                </nav>
              </div>
              <section id='overview'>
                <div className='third_section outer_section'>
                  <div className='hdr_txt mb-3'>Overview</div>
                  <div className='dsp_cont'>
                    <div className='brdr_blck pdng_box'>TVL <div className='mt-2 fnt_wgt_600'>${deatils.tvlInusd}</div></div>
                    <div className='brdr_blck pdng_box'>Depositors  <div className='mt-2 fnt_wgt_600'>{depositerNumber}</div></div>
                    <div className='brdr_blck pdng_box'>Avg. Monthly Returns <div className='mt-2 txt_clr_grn'>{vaultApy}%</div></div>
                    <div className='brdr_blck pdng_box'>Denomination Asset <div className='mt-2 fnt_wgt_600'> <img src={deatils.assetImg} alt='btc img' className='wdth_28' /> {deatils.assetName}</div></div>
                  </div>
                  <div className='mt-3'><img src={graphIMg} className='wdth_100' alt='licensed' /></div>
                </div>
              </section>
              <section id='strategy'>
                <div className='third_section outer_section'>
                  <div className='hdr_txt mb-2'>Strategy</div>
                  <div className='fnt_wgt_600 mb-2 redHatFont'>Summary</div>
                  <span>
                    <ul>
                      {valutJsonData?.strategy?.val.map((data: any, index: any) => {
                        return <><li key={index} className='mb-2'>{data}
                        </li></>
                      })}
                    </ul>
                  </span>


                  {valutJsonData?.protocols.map((data: any) => {
                    return <>
                      <div className='backGrd mb-3'>
                        <div className='dsp mb-2'>
                          <div className='fnt_wgt_600'><img src={`../img/${data.logo}`} alt='pancake' /> {data.name}</div>
                          <div className='d-flex'>
                            <div className='crsr_pntr' onClick={() => { goToUrl(data.website) }}>
                              <span className='westBtn'><img src={globeImg} alt='website' /> Website</span>
                            </div>
                            <div className='crsr_pntr' onClick={() => { goToUrl(data.contract) }}>
                              <span className='westBtn'><img src={arrowUpImg} alt='website' /> Contract</span>
                            </div>
                          </div>
                        </div>
                        <div className='fnt_14 mt-3'>
                          {data.details}
                        </div>
                      </div>
                    </>
                  })}



                </div>
              </section>
              <section id='risk'>
                <div className='fourth_section outer_section'>
                  <span className='hdr_txt mb-2'>Risk</span>
                  <div className='backGrd mb-3 mt-3'>
                    <div className='mb-2'><div className='opt_67'>Safety Score </div> <span className='holding_val'>{valutJsonData?.risk?.safetyScore} <img src={saftyImg} alt='safty img' className='sftyImgWdth' /></span></div>
                    {valutJsonData?.risk?.safetyScorePoint.map((data: any) => {
                      return <>
                        <div className='mb-2'><img src={upImg} alt='up' /> <span className='opt_67 mrgn_18'>{data.details} </span><img src={helpImg} alt='help icon' /> <br /> <span className='rvr_sty'>{data.type}</span></div>
                      </>
                    })}
                  </div>
                  <div className='fnt_wgt_600 mb-3 font_18 redHatFont'>Risks</div>
                  <div>
                    <ul className='pdng_18'>
                      {valutJsonData?.risk?.riskType.map((data: any) => {
                        return <>
                          <li className='mrgn_btm_15'><span className='fnt_wgt_600'>{data.details}:</span> {data.type}</li>
                        </>
                      })}
                    </ul>
                  </div>
                </div>
              </section>
              <section id='portfolioManager'>
                <div className='fifth_section outer_section'>
                  <div className='hdr_txt mb-2'>Portfolio Manager</div>
                  <div className='mt-4'>
                    <span className='fnt_wgt_600'>Vault owner</span>
                    <div className='dsp wdth_50 prtfol_back mt-2 mb-3'>
                      <div className='fnt_14'>{valutJsonData?.fundManager?.vaultOwner}</div>
                      <div><img src={copyImg} alt='copy img' /></div>
                      <div><img src={eternalLinkImg} alt='external link img' /></div>
                    </div>
                  </div>
                  <div className='mt-4'>
                    <span className='fnt_wgt_600'>Fund Manager</span>
                    <div className='dsp wdth_50 prtfol_back mt-2 mb-3'>
                      <div className='fnt_14'>{valutJsonData?.fundManager?.fundManagerAddress}</div>
                      <div><img src={copyImg} alt='copy img' /></div>
                      <div><img src={eternalLinkImg} alt='external link img' /></div>
                    </div>
                  </div>
                  <div className='mt-4'>
                    <span className='fnt_wgt_600'>Compliance Manger</span>
                    <div className='dsp wdth_50 prtfol_back mt-2 mb-3'>
                      <div className='fnt_14'>{valutJsonData?.fundManager?.complianceManger}</div>
                      <div><img src={copyImg} alt='copy img' /></div>
                      <div><img src={eternalLinkImg} alt='external link img' /></div>
                    </div>
                  </div>
                </div>
              </section>
              <section id='fees'>
                <div className='sixth_section outer_section'>
                  <div className='hdr_txt mb-2'>Fees</div>
                  <div>
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">Fee type</th>
                          <th scope="col">Settings</th>
                          <th scope="col">Recipent</th>
                        </tr>
                      </thead>
                      <tbody>
                        {valutJsonData?.fees.map((data: any) => {
                          return <>
                            <tr>
                              <td>{data.feeType}</td>
                              <td>{data.settings.name} <br /> {data.settings.value}</td>
                              <td>{data.recipent.name}<br />
                                {data.recipent.value} <span className='mrgn_5'><img src={eternalLinkImg} alt='external link img' /></span> <span ><img src={copyImg} alt='copy img' /></span></td>
                            </tr>
                          </>;
                        })}
                      </tbody>
                    </table>
                  </div>

                </div>
              </section>
              <section id='transactions'>
                <div className='sixth_section outer_section'>
                  <div className='hdr_txt mb-2'>Transactions</div>
                  <div>
                    <table className="table">
                      <tbody>
                        {valutJsonData?.transactions.map((data: any) => {
                          return <>
                            <tr>
                              <td ><span className='fnt_14'>{data.date}</span>  <img src={eternalLinkImg} className='trsnaCpyImg' alt='external link img' /><div className='fnt_wgt_600 mb-3'>{data.type}</div><div className='pdng_10'> <img className='transactionVenusWdth' src={venusImg} alt='venus' /> {data.address} <img src={copyImg} className='trnsCpyWdth' alt='copy img' /></div></td>
                              <td>Value <br /> Txn. fee</td>
                              <td>{data.value} <br />
                                {data.tnxFee}</td>
                            </tr>
                          </>
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
              <section id='depositors'>
                <div className='sixth_section outer_section'>
                  <div className='hdr_txt mb-2'>Depositors</div>
                  <div>
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">Depositor</th>
                          <th scope="col">Assets</th>
                          <th scope="col">Numbers of Shares</th>
                          <th scope="col">Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {valutJsonData?.depositors.map((data: any) => {
                          return <>
                            <tr>
                              <td >{data.depositor}</td>
                              <td>{data.assets}</td>
                              <td>{data.numbersOfShares}</td>
                              <td>{data.percentage}</td>
                            </tr>
                          </>
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
              <section id='fAQ'>
                <div className='sixth_section outer_section mb-5'>
                  <div className='hdr_txt mb-4'>FAQ</div>
                  <div>
                    <Accordion activeIndex={0}>
                      <AccordionTab header="Is there any lock-up period for funds?">
                        <p className="m-0">
                          No, there is no lock-up period in this vault. You can withdraw your funds at any time without any restriction or penalty.
                        </p>
                      </AccordionTab>
                      <AccordionTab header="What assets are the yields paid in?">
                        <p className="m-0">
                          The yields are paid in the denomination asset of the strategy and are compounded automatically. Unharvested rewards can be temporarily held in the form of farmed assets.
                        </p>
                      </AccordionTab>
                      <AccordionTab header="What are the fees associated with using the vault?">
                        <p className="m-0">
                          During the testing period, there are no fees for using Rivera vaults. A management & performance fee will be applied after the protocol's mainnet launch.
                        </p>
                      </AccordionTab>
                      <AccordionTab header="I'm having trouble using the app. What should I do?">
                        <p className="m-0">
                          Join our Discord community and help us improve our app by reporting your issue. Win exclusive rewards, bounty & more for your contribution.
                        </p>
                      </AccordionTab>
                      <AccordionTab header="I love Rivera! How can I get involved?">
                        <p className="m-0">
                          We are recruiting DeFi pros who can help us redefine the future of DeFi liquidity management. Join us in testing the Rivera protocol and contributing to its development. We are awarding exclusive OG NFTs to the top 100 testers. Get started by joining our Discord.
                        </p>
                      </AccordionTab>
                    </Accordion>
                  </div>
                </div>
              </section>
            </div>
            <div className='col-md-4'>
              <div className="small-div-2"></div>
              {address ?
                <>
                  <div className='first_section outer_section'>
                    <div className='dsp'>
                      <div>
                        <div className='holding_header'>Your Holdings</div>
                        <div className='holding_header_inner mb-3'>{userShare} {deatils?.assetName}</div>
                      </div>
                      <div className='txtAlgnRight'>
                        <img src={dollarImg} className='dllrImgwdth' alt='dollar' />
                      </div>
                    </div>

                    <div className='dsp'>
                      <div>Overall Returns <br /> <span className='holding_val'>{useroverallReturn} {deatils?.assetName}</span></div>
                      <div>Average APY <br /> <span className='holding_val'>{userApy}%</span></div>
                    </div>
                  </div>
                </> : <></>}


              <div className='second_section outer_section pos_sticky'>
                <TabView>
                  <TabPanel header="Deposit">
                    <div className='mt-3'>
                      <div className='dsp'>
                        <div>Deposits</div>
                        <div>${userShareInUsd}</div>
                      </div>
                      <div>
                        <ProgressBar value={Number(((Number(userShareInUsd) / Number(tvlCapInUsd)) * 100).toFixed(4))}></ProgressBar>
                      </div>
                      <div className='dsp mb-3'>
                        <div>Capacity</div>
                        <div>${tvlCapInUsd}</div>
                      </div>
                      <div className='dsp backGrd mb-3'>
                        <div className='fnt_wgt_600'><img src={deatils?.assetImg} className='wdth_50' alt='usdt' /> <br /> {deatils?.assetName}</div>
                        <div><input
                         
                          type="number"
                          id="first_name"
                          name="first_name"
                          value={depositAmout}
                          onChange={handledepositAmoutChange}
                        /></div>
                      </div>
                      {/* <div className='dsp'>
                        <div>Wallet balance</div>
                        <div>500 {deatils?.assetName}</div>
                      </div> */}
                      <div className='buy_cake mt-1 mb-2'>Buy {deatils?.assetName}</div>
                      <div className='dsp'>
                        <div>Min. Limit </div>
                        <div>0.0001 {deatils?.assetName}</div>
                      </div>
                      <div className='dsp'>
                        <div>Max. Limit</div>
                        <div>{maxLimit} {deatils?.assetName}</div>
                      </div>
                      <hr />
                      <div className='dsp'>
                        <div>Deposit fee</div>
                        <div>0%</div>
                      </div>
                      <div className='dsp'>
                        <div>Withdraw fee</div>
                        <div>0%</div>
                      </div>
                      <div className='mt-3 text-center'>
                        {isConnected ? isWhiteListed ?
                        (chain as any)?.id !== Number(valutJsonData?.id) ? 
                        <button className='btn btn-riv-primary wdth_100' onClick={() => { networkSwitchHandler(Number(valutJsonData?.id)) }} >Switch to {valutJsonData?.chainname}</button>
                        : isApproved ? <button className='btn btn-riv-primary wdth_100' onClick={deposit} >Deposit</button>
                        : <button className='btn btn-riv-primary wdth_100' onClick={approveIntilize} >Approve</button> : <>
                        <div>
                          <div className='mb-1'>Whitelist your address to proceed.</div>
                          <button className='btn btn-riv-primary wdth_100' onClick={gotoDiscord}>Get Whitelisted</button>
                          </div>
                        </> :
                        <>
                         <div className='d-flex justify-content-center'><ConnectButton /></div>
                        </>}
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel header="Withdraw">
                    <div className='mt-3'>
                      <div className='dsp'>
                        <div>Deposits</div>
                        <div>${userShareInUsd}</div>
                      </div>
                      <div>
                        <ProgressBar value={Number(((Number(userShareInUsd) / Number(tvlCapInUsd)) * 100).toFixed(4))}></ProgressBar>
                      </div>
                      <div className='dsp mb-3'>
                        <div>Capacity</div>
                        <div>${tvlCapInUsd}</div>
                      </div>
                      <div className='dsp backGrd mb-3'>
                        <div className='fnt_wgt_600'><img src={deatils?.assetImg} className='wdth_50' alt='usdt' /> <br /> {deatils?.assetName}</div>
                        <div><input
                          type="number"
                          id="first_name_2"
                          name="first_name_2"
                          value={withdrawAmout}
                          onChange={handlewithdrawAmoutChange}
                        /></div>
                      </div>
                      {/* <div className='dsp'>
                        <div>Wallet balance</div>
                        <div>20.5 {deatils?.assetName}</div>
                      </div> */}
                      <div className='buy_cake mt-1 mb-2'>Buy {deatils?.assetName}</div>
                      <div className='dsp'>
                        <div>Min. Limit </div>
                        <div>0.0001 {deatils?.assetName}</div>
                      </div>
                      <div className='dsp'>
                        <div>Max. Limit</div>
                        <div>{userShare} {deatils?.assetName}</div>
                      </div>
                      <hr />
                      <div className='dsp'>
                        <div>Deposit fee</div>
                        <div>0%</div>
                      </div>
                      <div className='dsp'>
                        <div>Withdraw fee</div>
                        <div>0%</div>
                      </div>
                      <div className='mt-3 text-center'>

                      {isConnected ? isWhiteListed ?
                        (chain as any)?.id !== Number(valutJsonData?.id) ? 
                        <button className='btn btn-riv-primary wdth_100' onClick={() => { networkSwitchHandler(Number(valutJsonData?.id)) }} >Switch to {valutJsonData?.chainname}</button>
                        :  <button className='btn btn-riv-primary wdth_100' onClick={withdraw}>Withdraw</button>
                        : <>
                        <div>
                        <div className='mb-1'>Whitelist your address to proceed.</div>
                          <button className='btn btn-riv-primary wdth_100' onClick={gotoDiscord}>Get Whitelisted</button>
                          </div>
                        </> :
                        <>

                        <div className='d-flex justify-content-center'><ConnectButton /></div>
                        </>}

                       
                      </div>
                    </div>
                  </TabPanel>
                </TabView>

              </div>
            </div>
          </div>
        </div>
      </>}

    </>
  )
}
