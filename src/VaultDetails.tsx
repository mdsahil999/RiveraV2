import { BigNumber, ethers } from 'ethers';
import { of } from 'rxjs';
import { pipe } from 'rxjs';
import { distinct } from 'rxjs/operators';
import { from } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAccount, useContract, useContractRead, useProvider, useSigner } from 'wagmi';
import { TabView, TabPanel } from 'primereact/tabview';
import { ProductService } from './service/ProductService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { ProgressBar } from 'primereact/progressbar';
import btcImg from './assets/images/btc.png'
import usdtImg from './assets/images/usdt.svg'
import lockImg from './assets/images/lock.png'
import checkCircleImg from './assets/images/check-circle.png'
import arrowImg from './assets/images/arrow.png'
import cashaaImg from './assets/images/cashaa.png';
import licensedImg from './assets/images/licensed.png';
import upImg from './assets/images/up.png';
import downImg from './assets/images/down.png';
import helpImg from './assets/images/help-circle.png';
import pancakeImg from './assets/images/pancake.svg';
import venusImg from './assets/images/venus.svg';
import levelFinanceImg from './assets/images/level.png';
import globeImg from './assets/images/globe.png';
import arrowUpImg from './assets/images/arrow-up-right.png';
import copyImg from './assets/images/copy.png';
import eternalLinkImg from './assets/images/external-link.png';
import helpCircle2 from './assets/images/help-circle-2.png';
import bnbImg from './assets/images/bnb.png';
import ethImg from './assets/images/eth.png';
import riveraAutoCompoundingVaultV2PublicJson from './abi/out/RiveraAutoCompoundingVaultV2Public.sol/RiveraAutoCompoundingVaultV2Public.json'
import vaultAbiJson from '../src/assets/json/RiveraAutoCompoundingVaultV2Public.json'
import assetsAbiJson from '../src/assets/json/assets.json'
//import { erc20Abi } from '../src/assets/json/erc20Abi.js'
import erc20Json from './abi/out/ERC20.sol/ERC20.json'
import dollarImg from './assets/images/dollar.png';
import saftyImg from './assets/images/safty.png';
import graphIMg from './assets/images/graph.png';
import pancakeWhitelistedVaultFactoryV2Json from './abi/out/PancakeWhitelistedVaultFactoryV2.sol/PancakeWhitelistedVaultFactoryV2.json'
import riveraAutoCompoundingVaultV2WhitelistedJson from './abi/out/RiveraAutoCompoundingVaultV2Whitelisted.sol/RiveraAutoCompoundingVaultV2Whitelisted.json'
import { FACTORY_CONTRACT_DEPLOYMENT_BLOCK, RPCUrl, whitelistedFactoryAddress } from './constants/global.js'
import { ProgressSpinner } from 'primereact/progressspinner';

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

  const [deatils, setDeatils] = useState({
    "vaultName": "",
    "assetName": "",
    "assetImg": "",
    "tvl": "",
    "tvlInusd": "",
    "holding": "",
    // "userShare": "",
    // "overallReturn": "",
  });
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
  const { address } = useAccount()
  const [products, setProducts] = useState<Product[]>([]);
  let { vaultAddress } = useParams();
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    //for static design(will remove in the future)
    setLoading(true);
    ProductService.getProductsMini().then(data => setProducts(data));
    if (address) {
      checkAllowance();
    }
    getAllDetails();

  }, []);

  async function getLatestBlock() {
    const blockNumber = await provider.getBlockNumber();
    console.log('Latest block number test 1:', blockNumber);
    setLatestBlockNumber(blockNumber);
    console.log('Latest block number test 2:', latestBlockNumber);
    // const block = await provider.getBlock(blockNumber);
    // console.log('Latest block:', block);
  }

  const getContract = (address: string, abi: any, provider: any) => {
    return new ethers.Contract(address, abi, provider);
  }

  const checkAllowance = async () => {
    //local 
    //const localProvider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed1.binance.org');
    const localProvider = new ethers.providers.JsonRpcProvider(RPCUrl);

    const valutContract = getContract(vaultAddress as string, riveraAutoCompoundingVaultV2WhitelistedJson.abi, localProvider.getSigner());
    const valutAssetAdress = await valutContract.asset();

    const erc20Contract = getContract(valutAssetAdress, erc20Json.abi, localProvider.getSigner())
    const allowance = await erc20Contract.allowance(address, vaultAddress); //address:- login user address  //assetAdress:-valut asset address
    let convertedallowance = allowance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 18 });
    convertedallowance = convertedallowance.replace(/,/g, '');
    console.log("allowance value ", convertedallowance)
    if (+convertedallowance > 0) {
      setisApproved(true);
      //await approve(assetAdress);
    }
  }



  const deposit = async () => {
    //console.log("signer:", signer);
    const contract = getContract(vaultAddress as string, riveraAutoCompoundingVaultV2WhitelistedJson.abi, signer);
    const assetAdress = await contract.asset();
    //console.log("assetAdress:", assetAdress);
    //convverting the deposit ampount to 10^18 format
    const amount = depositAmout * Math.pow(10, 18);
    let convertedAmount = amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 18 });
    convertedAmount = convertedAmount.replace(/,/g, '');

    console.log("amount", convertedAmount);
    console.log("receiver address", address);


    //calling the deposit method
    const aprvTxt = await contract.deposit(convertedAmount, address, {
      gasLimit: 800000
    });
    setLoading(true);
    await aprvTxt.wait().then((e: any) => {
      getAllDetails();
      console.log("Deposit working fine", e);
    });
  }

  const withdraw = async () => {
    console.log("withdraw");
    const contract = getContract(vaultAddress as string, riveraAutoCompoundingVaultV2WhitelistedJson.abi, signer);
    //convverting the deposit ampount to 10^18 format
    const amount = withdrawAmout * Math.pow(10, 18);
    let convertedAmount = amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 18 });
    convertedAmount = convertedAmount.replace(/,/g, '');

    //calling the deposit method
    const aprvTxt = await contract.withdraw(convertedAmount, address, address);
    setLoading(true);
    await aprvTxt.wait().then((e: any) => {
      getAllDetails();
      //setLoading(false);
      console.log("Deposit working fine", e);
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
      // console.log("Current", current);
      const sectionHeight = current['offsetHeight'];
      const sectionTop = (current.getBoundingClientRect().top + window.pageYOffset) - 100;
      const sectionId = current.getAttribute("id");

      if (
        scrollY > sectionTop &&
        scrollY <= sectionTop + sectionHeight
      ) {
        // console.log("add");
        document.querySelector(".navigation a[href*=" + sectionId + "]")?.classList.add("active");
      } else {
        document.querySelector(".navigation a[href*=" + sectionId + "]")?.classList.remove("active");
        // console.log("remove");
      }
    });
  }

  const getAllDetails = async () => {

    // const vaultContract = getContract(vaultAddress as string, riveraAutoCompoundingVaultV2WhitelistedJson.abi, signer);

    const localProvider = new ethers.providers.JsonRpcProvider(RPCUrl);
    const vaultContract = getContract(vaultAddress as string, riveraAutoCompoundingVaultV2WhitelistedJson.abi, localProvider.getSigner());

    const asset = await vaultContract.asset(); //it will return the name of the asset of the valut

    let assetName = "";
    let assetImg = "";
    if (asset === "0x2170Ed0880ac9A755fd29B2688956BD959F933F8") {
      assetName = "ETH";
      assetImg = ethImg;

    } else if (asset === "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c") {
      assetName = "BNB";
      assetImg = bnbImg;
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
    }
    setDeatils(detailsVal);


    if (address) {
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


      //mofied code start

      const depositFilter = vaultContract.filters.Deposit();

      let totalValutDeposit = 0;
      let totalValutDepositWithTime = 0;
      let totalUserDeposit = 0;
      let totalUserDepositWithTime = 0;
      const distinctDepositerSet = new Set();
      const latestBlockNumberval = await provider.getBlockNumber();
      console.log("latestBlockNumberval", latestBlockNumberval)
      const batchSize = 10000;
      const blocksToProcess = latestBlockNumberval - FACTORY_CONTRACT_DEPLOYMENT_BLOCK;

      for (let i = 0; i < blocksToProcess; i += batchSize) {
        const firstBlock = FACTORY_CONTRACT_DEPLOYMENT_BLOCK + i;
        const lastBlock = Math.min(firstBlock + batchSize - 1, latestBlockNumberval);
        console.log("firstBlock", firstBlock);
        console.log("lastBlock", lastBlock);

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

      }




      console.log("totalValutDeposit", totalValutDeposit);
      console.log("totalValutDepositWithTime", totalValutDepositWithTime);
      console.log("totalUserDeposit", totalUserDeposit);
      console.log("totalUserDepositWithTime", totalUserDepositWithTime);

      //mofied code end


      //modied code start
      let totalValutwithdraw = 0;
      let totalValutwithdrawWithTime = 0;
      let totalUserwithdraw = 0;
      let totalUserwithdrawWithTime = 0;
      const withdrawFilter = vaultContract.filters.Withdraw();
      for (let i = 0; i < blocksToProcess; i += batchSize) {
        const firstBlock = FACTORY_CONTRACT_DEPLOYMENT_BLOCK + i;
        const lastBlock = Math.min(firstBlock + batchSize - 1, latestBlockNumberval);
        const withdrawLogs = await vaultContract.queryFilter(withdrawFilter, firstBlock, lastBlock);
        //await Promise.all(depositLogs.map(async (log: any) => {
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

        console.log("totalValutwithdraw", totalValutwithdraw);
        console.log("totalValutwithdrawWithTime", totalValutwithdrawWithTime);
        console.log("totalUserwithdraw", totalUserwithdraw);
        console.log("totalUserwithdrawWithTime", totalUserwithdrawWithTime);
      }

      //modofide code end



      let overallReturn = ((userShareVal + totalUserwithdraw) - totalUserDeposit);
      setUserOverallReturn(overallReturn.toFixed(2));

      const userApyVal = (userShareVal - (totalUserDeposit - totalUserwithdraw)) / (totalUserDepositWithTime - totalUserwithdrawWithTime);
      setUserApy(userApyVal.toFixed(2));

      const valutApyVal = (tvl - (totalValutDeposit - totalValutwithdraw)) / (totalValutDepositWithTime - totalValutwithdrawWithTime);
      setVaultApy(valutApyVal.toFixed(2));

    }
    setLoading(false);
  }

  async function getPriceInUsd(address: string): Promise<any> {
    let priceAddress = "";
    if (address === "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c") {
      priceAddress = "0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE";
    } else if (address === "0x2170Ed0880ac9A755fd29B2688956BD959F933F8") {
      priceAddress = "0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e";
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



  return (
    <>
      {loading ? <><div className="loader-container">
        <div className="spinner"></div>
      </div></> : <>
        <div className='custom-container mt-4'>
          <div className='row'>
            <div className='col-md-8'>
              <div className="small-div-1"></div>
              <div className='first_section outer_section'>
                <div className='dsp'>
                  <div className='header_font_size'><span><img src={deatils?.assetImg} alt='btc img' className='btc_img_width' /></span>{deatils?.vaultName}</div>
                  <div>
                    <span className='wthlist_back'><img src={lockImg} alt='lock img' className='wthlist_back_img' />Whitelisted</span>
                    <span className='kyc_back'><img src={checkCircleImg} alt='lock img' className='wthlist_back_img' /> KYC Completed</span>
                  </div>
                </div>
                <div className='trdng_outer'>
                  <span className='trdng_width'><img src={arrowImg} className='trdnImgMargn' alt='arrow img' />Trending</span>
                </div>
                <div className='dsp mb-3'>
                  <div>Average APY <br /> <span className='holding_val'>{vaultApy}%</span></div>
                  <div>TVL <br /> <span className='fnt_wgt_600'>${deatils.tvlInusd}</span></div>
                  <div>Safety Score <br /> <span className='holding_val'>9.1 <img src={saftyImg} alt='safty img' className='sftyImgWdth' /></span></div>
                  <div>Protocols <br /> <span><img className='pancakeWdth' src={pancakeImg} alt='pancake' /></span></div>
                </div>
                <div className='backGrd'>
                  <div className='mb-2'><img src={cashaaImg} alt='lock img' className='cashaa logo' /></div>
                  <div className='dsp'>
                    <div>Fund Manager <br /> <span className='fnt_wgt_600'>Cashaa Ltd.</span></div>
                    <div>Year Founded <br /> <span className='fnt_wgt_600'>2016</span></div>
                    <div>Location <br /> <span className='fnt_wgt_600'>London, UK</span></div>
                    <div><img src={licensedImg} alt='licensed' /></div>
                  </div>
                  <div className='mt-2'>
                    <span className='mrInf'>More Info</span>
                  </div>
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
                      <li>A Market-Neutral Strategy (Pseudo-Delta-Neutral) is a yield farming strategy where you can yield farm
                        high APY pairs while minimizing your risk by hedging out market exposure. The Automated Vault eliminates
                        market risk by farming long & short positions simultaneously, and rebalancing them for you to maintain
                        neutral exposure.
                      </li>
                      <li>Underlying Farming Pool: Thena Finance USDT-BNB</li>
                      <li>A professional team of asset managers active manage liquidity range of the farming pool</li>
                    </ul>
                  </span>
                </div>
              </section>
              <section id='risk'>
                <div className='fourth_section outer_section'>
                  <span className='hdr_txt mb-2'>Risk</span>
                  <div className='backGrd mb-3 mt-3'>
                    <div className='mb-2'><div className='opt_67'>Safety Score </div> <span className='holding_val'>9.1 <img src={saftyImg} alt='safty img' className='sftyImgWdth' /></span></div>
                    <div className='mb-2'><img src={upImg} alt='up' /> <span className='opt_67 mrgn_18'>Low-complexity strategy </span><img src={helpImg} alt='help icon' /> <br /> <span className='rvr_sty'>Rivera</span></div>
                    <div className='mb-2'><img src={upImg} alt='up' /> <span className='opt_67 mrgn_18'>Strategy is battle tested</span> <img src={helpImg} alt='help icon' /> <br /> <span className='rvr_sty'>Rivera</span></div>
                    <div className='mb-2'><img src={downImg} alt='down' /><span className='opt_67 mrgn_18'>High expected IL</span> <img src={helpImg} alt='help icon' /> <br /> <span className='rvr_sty'>Asset</span></div>
                    <div className='mb-2'><img src={downImg} alt='down' /><span className='opt_67 mrgn_18'>Medium market-capitalziation, average volatility asset</span> <img src={helpImg} alt='help icon' /> <br /> <span className='rvr_sty'>Rivera</span></div>
                    <div className='mb-2'><img src={upImg} alt='up' /> <span className='opt_67 mrgn_18'>Project assets are verified</span> <img src={helpImg} alt='help icon' /> <br /> <span className='rvr_sty'>Platform</span></div>
                  </div>
                  <div className='fnt_wgt_600 mb-3 font_18 redHatFont'>Risks</div>
                  <div>
                    <ul className='pdng_18'>
                      <li className='mrgn_btm_15'><span className='fnt_wgt_600'>Principal Risk:</span> Impermanent loss associated with AMM liquidity farming can lead to a
                        loss of principal amount.</li>
                      <li><span className='fnt_wgt_600'>Smart Contract Risk:</span> There is a risk of smart contract failure in the underlying vault or the protocols we work with.  </li>
                    </ul>
                  </div>
                  <div className='backGrd'>
                    <div className='dsp mb-2'>
                      <div className='fnt_wgt_600'><img src={pancakeImg} alt='pancake' /> PancakeSwap Finance</div>
                      <div className='d-flex'>
                        <div>
                          <span className='westBtn'><img src={globeImg} alt='website' /> Website</span>
                        </div>
                        <div>
                          <span className='westBtn'><img src={arrowUpImg} alt='website' /> Contract</span>
                        </div>
                      </div>
                    </div>
                    <div className='fnt_14 mt-3'>
                      Lorem ipsum dolor sit amet consectetur. Pretium sit consequat odio egestas placerat integer viverra eu ut.
                      Commodo porttitor diam vitae viverra rutrum adipiscing.
                    </div>
                  </div>
                  <div className='backGrd mt-3 mb-3'>
                    <div className='dsp mb-2'>
                      <div className='fnt_wgt_600'><img src={levelFinanceImg} alt='pancake' /> Level Finance</div>
                      <div className='d-flex'>
                        <div>
                          <span className='westBtn'><img src={globeImg} alt='website' /> Website</span>
                        </div>
                        <div>
                          <span className='westBtn'><img src={arrowUpImg} alt='website' /> Contract</span>
                        </div>
                      </div>
                    </div>
                    <div className='fnt_14 mt-3'>
                      Lorem ipsum dolor sit amet consectetur. Pretium sit consequat odio egestas placerat integer viverra eu ut.
                      Commodo porttitor diam vitae viverra rutrum adipiscing.
                    </div>
                  </div>
                </div>
              </section>
              <section id='portfolioManager'>
                <div className='fifth_section outer_section'>
                  <div className='hdr_txt mb-2'>Portfolio Manager</div>
                  <div className='mb-3'><img src={cashaaImg} alt='cashaa logo' /></div>
                  <div className='dsp mb-3'>
                    <div>Fund Manager <br /> <span className='fnt_wgt_600'>Cashaa Ltd.</span></div>
                    <div>Year Founded <br /> <span className='fnt_wgt_600'>2016</span></div>
                    <div>Location <br /> <span className='fnt_wgt_600'>London, UK</span></div>
                    <div><img src={licensedImg} alt='licensed' /></div>
                  </div>
                  <div>
                    Lorem ipsum dolor sit amet consectetur. Quam consectetur a odio eget mi libero arcu pharetra. Sit eu nisl
                    semper justo. Lorem ipsum dolor sit amet consectetur. Quam consectetur a odio eget mi libero arcu pharetra.
                    Sit eu nisl semper justo.
                  </div>
                  <div className='mt-4'>
                    <span className='fnt_wgt_600'>Vault owner</span>
                    <div className='dsp wdth_50 prtfol_back mt-2 mb-3'>
                      <div className='fnt_14'>0x6db5ed9557fds5645fds266f4ffsd220dfsdsff0</div>
                      <div><img src={copyImg} alt='copy img' /></div>
                      <div><img src={eternalLinkImg} alt='external link img' /></div>
                    </div>
                  </div>
                  <div className='mt-4'>
                    <span className='fnt_wgt_600'>Fund Manager</span>
                    <div className='dsp wdth_50 prtfol_back mt-2 mb-3'>
                      <div className='fnt_14'>0x6db5ed9557fds5645fds266f4ffsd220dfsdsff0</div>
                      <div><img src={copyImg} alt='copy img' /></div>
                      <div><img src={eternalLinkImg} alt='external link img' /></div>
                    </div>
                  </div>
                  <div className='mt-4'>
                    <span className='fnt_wgt_600'>Compliance Manger</span>
                    <div className='dsp wdth_50 prtfol_back mt-2 mb-3'>
                      <div className='fnt_14'>0x6db5ed9557fds5645fds266f4ffsd220dfsdsff0</div>
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
                        <tr>
                          <td>Management Fee</td>
                          <td>Rate <br /> 2.00%</td>
                          <td>Vault Owner <br />
                            0x6db5ed9557fds5645fds266f4ffsd220dfsdsff0 <span className='mrgn_5'><img src={eternalLinkImg} alt='external link img' /></span> <span ><img src={copyImg} alt='copy img' /></span></td>
                        </tr>
                        <tr>
                          <td >Performance Fee</td>
                          <td>Rate <br /> 2.00%</td>
                          <td>Vault Owner <br />
                            0x6db5ed9557fds5645fds266f4ffsd220dfsdsff0 <span className='mrgn_5'><img src={eternalLinkImg} alt='external link img' /></span> <span ><img src={copyImg} alt='copy img' /></span></td>
                        </tr>
                        <tr>
                          <td >Exit Fee</td>
                          <td>Rate <br /> 2.00%</td>
                          <td>Vault <span><img src={helpCircle2} alt='external link img' /></span></td>
                        </tr>
                        <tr>
                          <td >Protocol Fee</td>
                          <td>Rate <br /> 0.25% <img src={helpCircle2} alt='copy img' /></td>
                          <td> Protocol Fee contract <span><img src={helpCircle2} alt='copy img' /></span></td>
                        </tr>
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
                        <tr>
                          <td ><span className='fnt_14'>April-05-2023 11:19:33Am</span>  <img src={eternalLinkImg} className='trsnaCpyImg' alt='external link img' /><div className='fnt_wgt_600 mb-3'>Deposit</div><div className='pdng_10'> <img className='transactionVenusWdth' src={venusImg} alt='venus' /> 0x6db5.........sff0 <img src={copyImg} className='trnsCpyWdth' alt='copy img' /></div></td>
                          <td>Value <br /> Txn. fee</td>
                          <td>100 CAKE <br />
                            0.02BNB</td>
                        </tr>
                        <tr>
                          <td><span className='fnt_14'>April-05-2023 11:19:33Am</span> <img src={eternalLinkImg} className='trsnaCpyImg' alt='external link img' /><div className='fnt_wgt_600 mb-3'>Deposit</div><div className='pdng_10'> <img className='transactionVenusWdth' src={venusImg} alt='venus' /> 0x6db5.........sff0 <img src={copyImg} className='trnsCpyWdth' alt='copy img' /></div></td>
                          <td>Value <br /> Txn. fee</td>
                          <td>100 CAKE <br />
                            0.02BNB</td>
                        </tr>
                        <tr>
                          <td ><span className='fnt_14'>April-05-2023 11:19:33Am</span> <img src={eternalLinkImg} className='trsnaCpyImg' alt='external link img' /><div className='fnt_wgt_600 mb-3'>Deposit</div><div className='pdng_10'> <img className='transactionVenusWdth' src={venusImg} alt='venus' /> 0x6db5.........sff0 <img src={copyImg} className='trnsCpyWdth' alt='copy img' /></div></td>
                          <td>Value <br /> Txn. fee</td>
                          <td>100 CAKE <br />
                            0.02BNB</td>
                        </tr>
                        <tr>
                          <td ><span className='fnt_14'>April-05-2023 11:19:33Am</span> <img src={eternalLinkImg} className='trsnaCpyImg' alt='external link img' /><div className='fnt_wgt_600 mb-3'>Deposit</div><div className='pdng_10'> <img className='transactionVenusWdth' src={venusImg} alt='venus' /> 0x6db5.........sff0 <img src={copyImg} className='trnsCpyWdth' alt='copy img' /></div></td>
                          <td>Value <br /> Txn. fee</td>
                          <td>100 CAKE <br />
                            0.02BNB</td>
                        </tr>
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
                        <tr>
                          <td >0X920........8383</td>
                          <td>BTC 0.02</td>
                          <td>11,563</td>
                          <td>100.00%</td>
                        </tr>
                        <tr>
                          <td >0X920........8383</td>
                          <td>BTC 0.02</td>
                          <td>11,563</td>
                          <td>100.00%</td>
                        </tr>
                        <tr>
                          <td >0X920........8383</td>
                          <td>BTC 0.02</td>
                          <td>11,563</td>
                          <td>100.00%</td>
                        </tr>
                        <tr>
                          <td >0X920........8383</td>
                          <td>BTC 0.02</td>
                          <td>11,563</td>
                          <td>100.00%</td>
                        </tr>
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
                      <AccordionTab header="What asset are the vault yields paid in?">
                        <p className="m-0">
                          Yields on every strategy are paid in the same asset you deposit. So, for the MVLP vault, your yields will be paid out in MVLP itself.
                        </p>
                      </AccordionTab>
                      <AccordionTab header="What happens if I don't withdraw at the end of a cycle?">
                        <p className="m-0">
                          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                          quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
                          sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                          Consectetur, adipisci velit, sed quia non numquam eius modi.
                        </p>
                      </AccordionTab>
                      <AccordionTab header="What are the fees associated with using the vault?">
                        <p className="m-0">
                          At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti
                          quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt
                          mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
                          Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                        </p>
                      </AccordionTab>
                      <AccordionTab header="I'm having trouble using the app. What should I do?">
                        <p className="m-0">
                          At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti
                          quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt
                          mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
                          Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
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
                        <ProgressBar value={50}></ProgressBar>
                      </div>
                      <div className='dsp mb-3'>
                        <div>Capacity</div>
                        <div>${tvlCapInUsd}</div>
                      </div>
                      <div className='dsp backGrd mb-3'>
                        <div className='fnt_wgt_600'><img src={deatils?.assetImg} className='wdth_50' alt='usdt' /> <br /> {deatils?.assetName}</div>
                        <div><input
                          maxLength={5}
                          type="text"
                          id="first_name"
                          name="first_name"
                          value={depositAmout}
                          onChange={handledepositAmoutChange}
                        /></div>
                      </div>
                      <div className='dsp'>
                        <div>Wallet balance</div>
                        <div>500 {deatils?.assetName}</div>
                      </div>
                      <div className='buy_cake mt-1 mb-2'>Buy {deatils?.assetName}</div>
                      <div className='dsp'>
                        <div>Min. Limit </div>
                        <div>50 {deatils?.assetName}</div>
                      </div>
                      <div className='dsp'>
                        <div>Max. Limit</div>
                        <div>10,000 {deatils?.assetName}</div>
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
                        {isApproved ? <button className='btn btn-riv-primary wdth_100' onClick={deposit} >Continue</button>
                          : <button className='btn btn-riv-primary wdth_100' onClick={approveIntilize} >Approve</button>}

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
                        <ProgressBar value={50}></ProgressBar>
                      </div>
                      <div className='dsp mb-3'>
                        <div>Capacity</div>
                        <div>${tvlCapInUsd}</div>
                      </div>
                      <div className='dsp backGrd mb-3'>
                        <div className='fnt_wgt_600'><img src={deatils?.assetImg} className='wdth_50' alt='usdt' /> <br /> {deatils?.assetName}</div>
                        <div><input
                          maxLength={5}
                          type="text"
                          id="first_name_2"
                          name="first_name_2"
                          value={withdrawAmout}
                          onChange={handlewithdrawAmoutChange}
                        /></div>
                      </div>
                      <div className='dsp'>
                        <div>Wallet balance</div>
                        <div>20.5 {deatils?.assetName}</div>
                      </div>
                      <div className='buy_cake mt-1 mb-2'>Buy {deatils?.assetName}</div>
                      <div className='dsp'>
                        <div>Min. Limit </div>
                        <div>0.5 {deatils?.assetName}</div>
                      </div>
                      <div className='dsp'>
                        <div>Max. Limit</div>
                        <div>20 {deatils?.assetName}</div>
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
                        <button className='btn btn-riv-primary wdth_100' onClick={withdraw}>Continue</button>
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
