import { ConnectButton } from '@rainbow-me/rainbowkit';
import './App.css';
import { Menubar } from 'primereact/menubar';
import { Outlet, useNavigate } from 'react-router-dom';
// import { useAccount } from 'wagmi';
// import logoImg 
import logoImg from './assets/images/logo.png';
import alertTriangleImg from './assets/images/alert-triangle.png';
import { useSigner } from 'wagmi';

function RoutingLayout() {
    // const { isConnected } = useAccount()
    const { data: signer, isError, isLoading } = useSigner();
    const navigate = useNavigate();
    function navigateToPage(string: any) {
        navigate(string);
    }

    // const items = [
    //     {
    //         label: 'Home',
    //         icon: 'pi pi-fw pi-file',
    //         command: () => { navigateToPage('/') },
    //     },
    //     // {
    //     //     label: 'Range',
    //     //     icon: 'pi pi-fw pi-pencil',
    //     //     command: () => { navigateToPage('/Dashboard') },
    //     // }
    // ];
    const start = <img alt="logo" src={logoImg} height="40" className="mr-2 crsr_pntr" onClick={()=>{navigateToPage('/')}}></img>;
    const end = <ConnectButton />

    return (
        <>
            {/* <div className='header_warning'>
                <div className='header_warning_font'>
                    <img src={alertTriangleImg} className='left_wrgn_alrt' alt='alert'/>
                    <span>MVP TESTING RISK NOTICE</span>
                    <img src={alertTriangleImg} className='left_wrgn_alrt' alt='alert'/>
                    </div>
                <div>Rivera contracts are NOT audited yet. You may lose ALL funds deposited into Rivera-powered strategy vaults.</div>
            </div> */}
            <div className="card bg_gray">
                <Menubar start={start} end={end} className='custom-container' />
            </div>
            {/* {signer ? <><div className="main">
                <Outlet />
            </div></> : <></>} */}
            <div className="main">
                <Outlet />
            </div>
           
        </>
    )
}

export default RoutingLayout;