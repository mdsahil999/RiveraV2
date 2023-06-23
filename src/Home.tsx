import './App.css';
import { useNavigate } from 'react-router-dom';

import { FACTORY_CONTRACT_DEPLOYMENT_BLOCK, RPCUrl, mantleRPCUrl } from './constants/global.js'
import { whitelistedBNBFactoryAddress, whitelistedMantleFactoryAddress } from './constants/global.js'
import btcImg from './assets/images/btc.png'
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
import globeImg from './assets/images/globe.png';
import arrowUpImg from './assets/images/arrow-up-right.png';
import copyImg from './assets/images/copy.png';
import eternalLinkImg from './assets/images/external-link.png';
import tvlIMg from './assets/images/tvl.png';
import assetsManagerImg from './assets/images/assetsManager.png';
import rocketImg from './assets/images/rocket.png';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useProvider, useSigner } from 'wagmi';
import section1IMg from './assets/images/section1.png';
import section2IMg from './assets/images/section2.png';
import { ProgressBar } from 'primereact/progressbar';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import buttonArrowImg from './assets/images/button_arrow.png';
import saftyImg from './assets/images/safty.png';
import keyCircleImg from './assets/images/keyCircle.png';
import seetingCircleImg from './assets/images/seetingCircle.png';
import erc20Json from './abi/out/ERC20.sol/ERC20.json'
import pancakeWhitelistedVaultFactoryV2Json from './abi/out/PancakeWhitelistedVaultFactoryV2.sol/PancakeWhitelistedVaultFactoryV2.json'
import RiveraAutoCompoundingVaultV2WhitelistedJson from './abi/out/RiveraAutoCompoundingVaultV2Whitelisted.sol/RiveraAutoCompoundingVaultV2Whitelisted.json'
import { take } from 'rxjs/operators';
import bnbImg from './assets/images/bnb.png';
import ethImg from './assets/images/eth.png';
import deltaNeutralImg from './assets/images/deltaNeutral.svg';
import stablePairImg from './assets/images/stablePair.svg';
import liquidityMinigImg from './assets/images/liquidityMinig.svg';
import bitLogoImg from './assets/images/bitLogo.png';

import StablePairColorImg from './assets/images/StablePairColor.svg';
import almImg from './assets/images/alm.svg';
import LSDFarmingImg from './assets/images/LSDFarming.svg';

function Home() {
  const [isWhiteListed, setWhiteListed] = useState(false);
  const [totalTvl, setTotalTvl] = useState("");
  const [totalVault, setTotalVault] = useState(0);
  const [portfolio, setPortfolio] = useState("");
  const [overallReturn, setOverallReturn] = useState("");
  const [totalAverageApy, settotalAverageApy] = useState("");
  const [bnbPriceInUsd, setBnbPriceInUsd] = useState(2);
  const [erc20Abi, seterc20Abi] = useState({});
  const [valutList, setvalutList] = useState<any>([]);
  const valutList2 = ['1', '2'];
  const { address, isConnected } = useAccount();
  const provider = useProvider();
  const { data: signer, isError, isLoading } = useSigner();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getDeployedValut();
  }, []);


  const goTovaultDeatils = (path: string) => {
    navigate('vault/' + path);
  }


  const getContract = (address: string, abi: any, provider: any) => {
    return new ethers.Contract(address, abi, provider);
  }

  async function getPriceInUsd(address: string): Promise<any> {

    console.log('Checking');
    let priceAddress = "";
    if (address === "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c") {
      priceAddress = "0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE";
    } else if (address === "0x2170Ed0880ac9A755fd29B2688956BD959F933F8") {
      priceAddress = "0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e";
    } else if (address === "0x8734110e5e1dcF439c7F549db740E546fea82d66") {
      //priceAddress = "0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e";
      return new Promise((resolve, reject) => {
        resolve(Number(0.5));
      });
    }
    // const { ethers } = require("ethers") // for nodejs only
    const providerVal = new ethers.providers.JsonRpcProvider("https://bsc-dataseed1.binance.org")  //https://data-seed-prebsc-1-s1.binance.org:8545/ for local testnet
    const aggregatorV3InterfaceABI = [{ "inputs": [{ "internalType": "address", "name": "_aggregator", "type": "address" }, { "internalType": "address", "name": "_accessController", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "int256", "name": "current", "type": "int256" }, { "indexed": true, "internalType": "uint256", "name": "roundId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "updatedAt", "type": "uint256" }], "name": "AnswerUpdated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "roundId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "startedBy", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "startedAt", "type": "uint256" }], "name": "NewRound", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }], "name": "OwnershipTransferRequested", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "inputs": [], "name": "acceptOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "accessController", "outputs": [{ "internalType": "contract AccessControllerInterface", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "aggregator", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_aggregator", "type": "address" }], "name": "confirmAggregator", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "description", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_roundId", "type": "uint256" }], "name": "getAnswer", "outputs": [{ "internalType": "int256", "name": "", "type": "int256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint80", "name": "_roundId", "type": "uint80" }], "name": "getRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_roundId", "type": "uint256" }], "name": "getTimestamp", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestAnswer", "outputs": [{ "internalType": "int256", "name": "", "type": "int256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestRound", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestTimestamp", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint16", "name": "", "type": "uint16" }], "name": "phaseAggregators", "outputs": [{ "internalType": "contract AggregatorV2V3Interface", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "phaseId", "outputs": [{ "internalType": "uint16", "name": "", "type": "uint16" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_aggregator", "type": "address" }], "name": "proposeAggregator", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "proposedAggregator", "outputs": [{ "internalType": "contract AggregatorV2V3Interface", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint80", "name": "_roundId", "type": "uint80" }], "name": "proposedGetRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "proposedLatestRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_accessController", "type": "address" }], "name": "setController", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_to", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }]
    //const addr = "0xe0073b60833249ffd1bb2af809112c2fbf221DF6"
    const priceFeed = new ethers.Contract(priceAddress, aggregatorV3InterfaceABI, providerVal)
    const roundData = await priceFeed.latestRoundData();
    let decimals = await priceFeed.decimals();

    return new Promise((resolve, reject) => {
      resolve(Number((roundData.answer.toString() / Math.pow(10, decimals)).toFixed(2)));
    });


  }

  const getValutDetailsByChain = async (valultList: string[], provider: any) => {
    const valutListVal = await Promise.all(valultList?.map(async (vaultAddress: any) => {

      const vaultContract = getContract(vaultAddress, RiveraAutoCompoundingVaultV2WhitelistedJson.abi, provider.getSigner());

      const asset = await vaultContract.asset(); //it will return the name of the asset of the valut

      let assetImg = "";
      let chainImg = "";

      if (asset === "0x2170Ed0880ac9A755fd29B2688956BD959F933F8") {
        assetImg = ethImg;
        chainImg = "../img/bnbChain.png"
      } else if (asset === "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c") {
        assetImg = bnbImg;
        chainImg = "../img/bnbChain.png"
      } else if (asset === "0x8734110e5e1dcF439c7F549db740E546fea82d66") {
        assetImg = bitLogoImg;
        chainImg = "../img/mantleLogo.png"
      }

      let totalAssets = await vaultContract.totalAssets(); //it will return the total assets of the valut
      totalAssets = totalAssets / Math.pow(10, 18);
      const valutName = await vaultContract.name();
      const convertedPrice = await getPriceInUsd(asset);
      let tvlCap = await vaultContract.totalTvlCap();
      tvlCap = tvlCap / Math.pow(10, 18);
      const tvlcapInUsd = tvlCap * convertedPrice;
      let tvl = totalAssets;
      const tvlInUsd = (tvl * convertedPrice);
      // totalTvlVal = totalTvlVal + tvlInUsd;



      //deposit event call to get alldesopit amout
      const depositFilter = vaultContract.filters.Deposit();
      let totalValutDeposit = 0;
      let totalValutDepositWithTime = 0;
      let totalUserDeposit = 0;
      let totalUserDepositWithTime = 0;

      let totalValutwithdraw = 0;
      let totalValutwithdrawWithTime = 0;
      let totalUserwithdraw = 0;
      let totalUserwithdrawWithTime = 0;

      let totalPortfolio = 0;
      let totalOverallreturnVal = 0;
      let totalAverageApy = 0;
      if (address) {
        debugger
        const isWhiteListed = await vaultContract.whitelist(address);
        setWhiteListed(isWhiteListed);

        let share = await vaultContract.balanceOf(address);
        share = share / Math.pow(10, 18);
        let totalSupply = await vaultContract.totalSupply();
        totalSupply = totalSupply / Math.pow(10, 18);
        const userShareVal = (totalAssets * share) / totalSupply;
        const userShareInUsd = userShareVal * convertedPrice;


        totalPortfolio = totalPortfolio + userShareInUsd;
        // setPortfolio(totalPortfolio.toFixed(2));


        const depositFilter = vaultContract.filters.Deposit();
        const withdrawFilter = vaultContract.filters.Withdraw();


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




        console.log("totalValutDeposit", totalValutDeposit);
        console.log("totalValutDepositWithTime", totalValutDepositWithTime);
        console.log("totalUserDeposit", totalUserDeposit);
        console.log("totalUserDepositWithTime", totalUserDepositWithTime);

        //mofied code end



        let overallReturn = ((userShareVal + totalUserwithdraw) - totalUserDeposit);
        const overallReturnInUsd = overallReturn * convertedPrice;
        totalOverallreturnVal = totalOverallreturnVal + overallReturnInUsd;

        const userApyVal = (userShareVal - (totalUserDeposit - totalUserwithdraw)) / (totalUserDepositWithTime - totalUserwithdrawWithTime);

        totalAverageApy = totalAverageApy + userApyVal;

      } else {

        const latestBlockNumberval = await provider.getBlockNumber();
        const batchSize = 10000;
        const blocksToProcess = latestBlockNumberval - FACTORY_CONTRACT_DEPLOYMENT_BLOCK;


        const withdrawFilter = vaultContract.filters.Withdraw();


        for (let i = 0; i < blocksToProcess; i += batchSize) {
          const firstBlock = FACTORY_CONTRACT_DEPLOYMENT_BLOCK + i;
          const lastBlock = Math.min(firstBlock + batchSize - 1, latestBlockNumberval);
          // console.log("firstBlock", firstBlock);
          // console.log("lastBlock", lastBlock);

          const depositLogs = await vaultContract.queryFilter(depositFilter, firstBlock, lastBlock);

          // eslint-disable-next-line no-loop-func
          await Promise.all(depositLogs.map(async (log: any) => {
            const timestamp = (await log.getBlock()).timestamp;
            const assets = Number(log.args.assets);
            const dateTime = timestamp;

            totalValutDeposit += assets;
            totalValutDepositWithTime += assets * dateTime;
          }));

          totalValutDeposit /= Math.pow(10, 18);
          totalValutDepositWithTime /= Math.pow(10, 18);

          console.log("totalValutDeposit", totalValutDeposit);
          console.log("totalValutDepositWithTime", totalValutDepositWithTime);

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
      }

      const valutApyVal = (tvl - (totalValutDeposit - totalValutwithdraw)) / (totalValutDepositWithTime - totalValutwithdrawWithTime);
      debugger
      console.log("tvl tvl", tvl);


      const response = await fetch('/vaultDetails.json'); // Assuming the JSON file is named "data.json" and located in the public folder.
      const data = await response.json();
      const valutDetailsInJson = data[vaultAddress as string]

      console.log("chain details", valutDetailsInJson);

      return {
        "name": valutName,
        "assetImg": assetImg,
        "chainImg": chainImg,
        "saftyRating": valutDetailsInJson?.risk?.safetyScore,
        "tvlInUsd": tvlInUsd,
        "tvl": tvl,
        "averageApy": "23.84%",
        "valutAddress": vaultAddress,
        "tvlcapInUsd": tvlcapInUsd.toFixed(2),
        "valutApy": valutApyVal.toFixed(2),
        "percentage": ((tvlInUsd / tvlcapInUsd) * 100).toFixed(4),
        "totalPortfolio": totalPortfolio,
        "totalOverallreturnVal": totalOverallreturnVal,
        "totalAverageApy": totalAverageApy,
      };

    }));

    return valutListVal;
  }

  async function getDeployedValut() {

    const bnbLocalProvider = new ethers.providers.JsonRpcProvider(RPCUrl);
    const bnbContract = getContract(whitelistedBNBFactoryAddress, pancakeWhitelistedVaultFactoryV2Json.abi, bnbLocalProvider.getSigner());
    const mantleLocalProvied = new ethers.providers.JsonRpcProvider(mantleRPCUrl);
    const mantleContract = getContract(whitelistedMantleFactoryAddress, pancakeWhitelistedVaultFactoryV2Json.abi, mantleLocalProvied.getSigner());

    let mantleValutListVal = await mantleContract.listAllVaults();

    let bnbValutListVal = await bnbContract.listAllVaults();

    const bnbValutList = await getValutDetailsByChain(bnbValutListVal, bnbLocalProvider);
    const mantleValutList = await getValutDetailsByChain(mantleValutListVal, mantleLocalProvied);

    const finalList = [...bnbValutList, ...mantleValutList];
    debugger
    setvalutList(finalList);
    setTotalVault(finalList.length);

    const totalOverallreturnVal = finalList.reduce((accumulator, currentValue) => accumulator + currentValue.totalOverallreturnVal, 0);
    setOverallReturn(totalOverallreturnVal.toFixed(2));

    const totalAverageApy = finalList.reduce((accumulator, currentValue) => accumulator + currentValue.totalAverageApy, 0);
    settotalAverageApy(totalAverageApy.toFixed(2));

    const totalTvlVal = finalList.reduce((accumulator, currentValue) => accumulator + currentValue.tvlInUsd, 0);
    setTotalTvl(totalTvlVal.toFixed(2));

    const portfolioVal = finalList.reduce((accumulator, currentValue) => accumulator + currentValue.totalPortfolio, 0);
    setPortfolio(portfolioVal.toFixed(2));

    setLoading(false);
    // Promise.all(valutListVal).then((values) => {
    //   setTotalTvl(totalTvlVal.toFixed(2));
    //   setOverallReturn(totalOverallreturnVal.toFixed(2));
    //   settotalAverageApy(totalAverageApy.toFixed(2))
    //   setvalutList(values as any);
    //   setLoading(false);
    // });
  }

  // const getValutDetailsByChain = () =>{

  // }

  const goToUrl = (url: any) => {
    window.open(url, '_blank');
  }

  return (
    <>
      {loading ? <><div className="loader-container">
        <div className="spinner"></div>
      </div></> : <>
        <div className="custom-container">

          {/* <button onClick={getDeployedValut}>Check</button> */}
          {/* <button onClick={() =>{getPriceInUsd('0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE')}}>convert</button> */}

          {isConnected ?
            <>
              {isWhiteListed ?
                <>
                  <div className='second_section outer_section_first'>
                    <div className='dsp_cont'>
                      <div className='wdth_40'>
                        <div className='prtfol_mrgn'>
                          <div className='first_sec_heder1'>Portfolio {isWhiteListed.toString()}</div>
                          <div className='first_sec_heder2'>${portfolio}</div>
                          <div className='first_sec_dsp_intr mt-2'>
                            <div>
                              <span>Overall Returns</span>
                              <br />
                              <span className='txt_clr_grn'>${overallReturn}</span>
                            </div>
                            <div>
                              <span>Average APY</span>
                              <br />
                              <span className='txt_clr_grn'>{totalAverageApy}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='wdth_30'>
                        <div className='tvl_back pddng_20'>
                          <div className='dsp redHatFont fnt_wgt_600'>TVL <img src={tvlIMg} alt='tvl' /></div>
                          <div className='holding_header_inner'>${totalTvl}</div>
                        </div>
                        <div className='dspl_between'>
                          <div className='tvl_back pddng_20 width_48'>
                            <div className='dsp redHatFont fnt_wgt_600'>Vaults <img src={keyCircleImg} alt='tvl' /></div>
                            <div className='holding_header_inner'>{totalVault}</div>
                          </div>
                          <div className='tvl_back pddng_20 width_48'>
                            <div className='dsp redHatFont fnt_wgt_600'>Automations <img src={seetingCircleImg} alt='tvl' /></div>
                            <div className='holding_header_inner'>142</div>
                          </div>
                        </div>


                      </div>
                      <div >
                        <img src={rocketImg} alt='rocket img' />
                      </div>
                    </div>
                  </div>
                </>
                :
                <>
                  <div className='second_section outer_section_first'>
                    <div className='dsp_cont'>
                      <div className='wdth_40'>
                        <div className='holding_header_inner mb-2 redHatFont'>You are not whitelisted.</div>
                        {/* <div className='mb-3'>Explore among curated vaults to find a strategy that suits your goal. Powered by crypto’s top asset managers. </div> */}
                      </div>
                      <div className='wdth_30'>
                        <div className='tvl_back pddng_20'>
                          <div className='dsp redHatFont fnt_wgt_600'>TVL <img src={tvlIMg} alt='tvl' /></div>
                          <div className='holding_header_inner'>${totalTvl}</div>
                        </div>
                        <div className='dspl_between'>
                          <div className='tvl_back pddng_20 width_48'>
                            <div className='dsp redHatFont fnt_wgt_600'>Vaults <img src={keyCircleImg} alt='tvl' /></div>
                            <div className='holding_header_inner'>{totalVault}</div>
                          </div>
                          <div className='tvl_back pddng_20 width_48'>
                            <div className='dsp redHatFont fnt_wgt_600'>Automations <img src={seetingCircleImg} alt='tvl' /></div>
                            <div className='holding_header_inner'>142</div>
                          </div>
                        </div>


                      </div>
                      <div >
                        <img src={rocketImg} alt='rocket img' />
                      </div>
                    </div>
                  </div>
                </>}


            </>
            :
            <div className='second_section outer_section_first'>
              <div className='dsp_cont'>
                <div className='wdth_40'>
                  <div className='holding_header_inner mb-2 redHatFont'>Your crypto, your control.</div>
                  <div className='mb-3'>Explore among curated vaults to find a strategy that suits your goal. Powered by crypto’s top asset managers. </div>
                  <div><ConnectButton /></div>
                </div>
                <div className='wdth_30'>
                  <div className='tvl_back pddng_20'>
                    <div className='dsp redHatFont fnt_wgt_600'>TVL <img src={tvlIMg} alt='tvl' /></div>
                    <div className='holding_header_inner'>${totalTvl}</div>
                  </div>
                  <div className='dspl_between'>
                    <div className='tvl_back pddng_20 width_48'>
                      <div className='dsp redHatFont fnt_wgt_600'>Vaults <img src={keyCircleImg} alt='tvl' /></div>
                      <div className='holding_header_inner'>{totalVault}</div>
                    </div>
                    <div className='tvl_back pddng_20 width_48'>
                      <div className='dsp redHatFont fnt_wgt_600'>Automations <img src={seetingCircleImg} alt='tvl' /></div>
                      <div className='holding_header_inner'>142</div>
                    </div>
                  </div>


                </div>
                <div >
                  <img src={rocketImg} alt='rocket img' />
                </div>
              </div>
            </div>
          }
          <div className='second_section row'>
            <h4 className='valut_header'>Vaults</h4>

            {valutList.map((e: any, index: any) => {
              return <div className='wdth_50' key={index}>

                <div className='first_section outer_section'>
                  <div className="small-home-div-3"></div>
                  <div className='dsp'>
                    <div className='header_font_size'><span><img src={e.assetImg} alt='btc img' className='btc_img_width' /></span>{e.name}</div>
                    <div>

                      <span><span className='holding_val ml_8'>{e.saftyRating}</span>
                      {e.saftyRating ?  <img src={saftyImg} alt='lock img' className='wthlist_back_img' /> : <></>}
                     
                      </span>
                    </div>
                    <div className='chain_pos_det'>

                      <span><img src={e.chainImg} alt='chain' /></span>
                    </div>
                  </div>
                  <div className='dsp dspWrap mt-3 mb-4'>
                    {/* <div className='trdng_outer'>
                      <span className='trdng_width'><img src={stablePairImg} className='ml_8' alt='arrow img' />Stable Pair</span>
                    </div>
                    <div className='trdng_outer'>
                      <span className='trdng_width'><img src={liquidityMinigImg} className='ml_8' alt='arrow img' />Liquidity Mining</span>
                    </div>
                    <div className='trdng_outer'>
                      <span className='trdng_width'><img src={deltaNeutralImg} className='ml_8' alt='arrow img' />Delta Neutral</span>
                    </div> */}
                    <div className='trdng_outer'>
                      <span className='trdng_width'><img src={StablePairColorImg} className='ml_8' alt='arrow img' />Stable Pair</span>
                    </div>
                    <div className='trdng_outer'>
                      <span className='trdng_width'><img src={almImg} className='ml_8' alt='arrow img' />ALM</span>
                    </div>
                    <div className='trdng_outer'>
                      <span className='trdng_width'><img src={LSDFarmingImg} className='ml_8' alt='arrow img' />LSD Farming</span>
                    </div>
                    <div className='trdng_outer'>
                      <span className='wthlist_back'><img src={lockImg} alt='lock img' className='wthlist_back_img' />Require KYC</span>
                    </div>
                  </div>

                  <div className='dsp mb-5'>
                    <div className='wdth_45'>
                      <div className='mb-1'>TVL</div>
                      <span className='secondary_color fnt_wgt_600'>${e.tvlInUsd.toFixed(2)}</span>
                      <div className='d-flex'><ProgressBar value={Number(e.percentage)} className='wdth_100'></ProgressBar> <div className='prgrs_txt'>${e.tvlcapInUsd}</div></div>
                    </div>
                    <div>Average APY <br /> <span className='holding_val'>{e.valutApy}%</span></div>
                    <div>Provided By <br /> <span><img src={cashaaImg} alt='lock img' className='cashaa logo' /></span></div>
                    {/* <div className='mr_45'>Protocols <br /> <span><img className='pancakeWdth' src={pancakeImg} alt='pancake' /></span></div> */}
                  </div>

                  {/* <div className='dsp mb-5'>
                    <div>Average APY <br /> <span className='holding_val'>{e.valutApy}%</span></div>
                    <div>Provided By <br /> <span><img src={cashaaImg} alt='lock img' className='cashaa logo' /></span></div>
                  </div> */}
                  <div className='dsp_around mb-2'>
                    <div className='wdth_60'><button className='btn btn-riv-secondary view_btn_wdth' onClick={() => { goTovaultDeatils(e.valutAddress) }}>View Details <img src={buttonArrowImg} alt='arrow' /></button></div>
                    {/* <div><button className='btn btn-riv-secondary' onClick={() => { goToSetRange(e) }}>Set Range</button></div> */}
                  </div>
                </div>
              </div>
            })}


            {/* <div className='wdth_50'>
        <div className="small-home-div-4"></div>
          <div className='first_section outer_section'>
            <div className='dsp'>
              <div className='header_font_size'><span><img src={require('./assets/images/btc.png')} alt='btc img' className='btc_img_width' /></span>ETH-Neutral THENA Farming</div>
              <div>
                <span><img src={lockImg} alt='lock img' className='wthlist_back_img' />9.1</span>
              </div>
            </div>
            <div className='dsp mt-3 mb-3'>
              <div className='trdng_outer'>
                <span className='trdng_width'><img src={arrowImg} alt='arrow img' />Trending</span>
              </div>
              <div>
                <span className='wthlist_back'><img src={lockImg} alt='lock img' className='wthlist_back_img' />Require KYC</span>
              </div>
            </div>

            <div className='dsp mb-3'>
              <div>TVL <br /> <span className='secondary_color fnt_wgt_600'>$1.2 M</span></div>
              <div>Protocols <br /> <span><img className='venusWdth' src={venusImg} alt='venus' /><img className='pancakeWdth' src={pancakeImg} alt='pancake' /></span></div>
            </div>

            <div className='dsp mb-5'>
              <div>Average APY <br /> <span className='holding_val'>23.84%</span></div>
              <div>Provided By <br /> <span><img src={cashaaImg} alt='lock img' className='cashaa logo' /></span></div>
            </div>
            <div className='dsp_around mb-2'>
              <div><button className='btn btn-riv-secondary' onClick={() => { goTovaultDeatils(valut2Address) }}>View Details</button></div>
              <div><button className='btn btn-riv-secondary' onClick={() => { goToSetRange(valut2Address) }}>Set Range</button></div>
            </div>
          </div>
        </div> */}
          </div>
          <div className='second_section outer_section_last last_section_back mb-5'>
            <div className='d-flex align-items-center ml_25'>
              <div className=''>
                <div className='last_header_inner'>Asset Manager?</div>
                <div className='last_section_desc'>Provide peace of mind to your investors by offering them self-custody vaults. Build & customize powerful yield farming and structured products. </div>
                <div><button className='btn btn-riv-secondary earlyacesBtn' onClick={() => { goToUrl('https://tally.so/r/m6Lope') }}>Get Early Access</button></div>
              </div>
              <div className=''>
                <img src={assetsManagerImg} alt='tvl' />
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </>}

    </>
  );
}

export default Home;
