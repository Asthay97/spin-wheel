import React, { useState } from 'react';
import { useWallet } from '@txnlab/use-wallet-react';
import AppCalls from './components/AppCalls';
import ConnectWallet from './components/ConnectWallet';
import Transact from './components/Transact';
import WheelSpinner from './WheelSpinner';
import { CircleDashed } from 'lucide-react';

const Home: React.FC = () => {
  const [openWalletModal, setOpenWalletModal] = useState(false);
  const [openDemoModal, setOpenDemoModal] = useState(false);
  const [appCallsDemoModal, setAppCallsDemoModal] = useState(false);

  const { activeAddress } = useWallet();

  const toggleWalletModal = () => setOpenWalletModal(!openWalletModal);
  const toggleDemoModal = () => setOpenDemoModal(!openDemoModal);
  const toggleAppCallsModal = () => setAppCallsDemoModal(!appCallsDemoModal);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50" >
     <header className="bg-black text-white py-6">
  <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
    {/* Left: Logo */}
    <div className="flex items-center gap-3">
      <img src="/algorand-logo-light.svg" alt="Algorand Logo" className="h-8" />
    </div>

    {/* Center: Title + Icon */}
    <div className="flex items-center gap-4 text-center">
      <div className="bg-white/5 p-2 rounded-xl backdrop-blur-lg">
        <CircleDashed size={32} className="text-emerald-400" />
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
          Spinning Wheel
        </h1>
        <p className="text-gray-400 text-sm mt-1">Decentralised Decision Making</p>
      </div>
    </div>

    {/* Right: Connect Wallet Button */}
    <div>
      <button
        className="btn btn-outline btn-sm text-white border-white"
        onClick={toggleWalletModal}
      >
        {activeAddress ? 'Wallet Connected' : 'Connect Wallet'}
      </button>
    </div>
  </div>
</header>

      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto" style={{ backgroundImage: "url('/Algorand-Video-background.png')" }}>
        {activeAddress && (
          <div className="flex-1 min-w-0">
            <WheelSpinner />
          </div>
        )}
      </div>
      <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
          <Transact openModal={openDemoModal} setModalState={setOpenDemoModal} />
          <AppCalls openModal={appCallsDemoModal} setModalState={setAppCallsDemoModal} />
    </div>
  );
};

export default Home;
