import React, { useState, useCallback, useEffect } from 'react';
import { useWallet } from '@txnlab/use-wallet-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { enqueueSnackbar } from 'notistack';

import { Participant, WheelState } from './types';
import { getColorByIndex } from './utils/colors';
import { calculateWinnerRotation, getRandomNumber } from './utils/animations';
import { spinAndCallHello } from './components/spinAndCall';

import Wheel from './components/Wheel';
import SpinButton from './components/SpinButton';
import ParticipantList from './components/ParticipantList';

const INITIAL_PARTICIPANTS: Participant[] = [
  { id: '1', name: 'Alexander', color: getColorByIndex(0) },
  { id: '2', name: 'Benjamin', color: getColorByIndex(1) },
  { id: '3', name: 'Catherine', color: getColorByIndex(2) },
  { id: '4', name: 'Dominique', color: getColorByIndex(3) },
];

const DEFAULT_SPIN_DURATION = 5000;

const WheelSpinner: React.FC = () => {
  const { activeAddress, transactionSigner } = useWallet();
  const { width, height } = useWindowSize();

  const [state, setState] = useState<WheelState>({
    isSpinning: false,
    winner: null,
    participants: INITIAL_PARTICIPANTS,
    spinDuration: DEFAULT_SPIN_DURATION,
  });

  const [rotation, setRotation] = useState<number>(0);
  const [pendingWinner, setPendingWinner] = useState<Participant | null>(null);

  const handleUpdateParticipants = useCallback((participants: Participant[]) => {
    setState(prev => ({ ...prev, participants }));
  }, []);

  // 🔁 Reset rotation when participants change
  useEffect(() => {
    setRotation(0);
  }, [state.participants]);

  const handleStartSpin = useCallback(async () => {
    if (state.participants.length < 2 || state.isSpinning) return;

    setState(prev => ({ ...prev, isSpinning: true, winner: null }));

    // ⏱ Delay to let UI re-render updated wheel
    await new Promise(resolve => setTimeout(resolve, 50));

    try {
      const winner = await spinAndCallHello(state.participants, transactionSigner, activeAddress);
      setPendingWinner(winner);

      const winnerIndex = state.participants.findIndex(p => p.id === winner.id);
      if (winnerIndex === -1) {
        throw new Error("Winner returned by contract is not in participant list");
      }

      const newRotation = calculateWinnerRotation(state.participants, winnerIndex);
      console.log('Participants:', state.participants.map(p => p.name));
      console.log('Winner:', winner.name, 'at index', winnerIndex);
      console.log('Final rotation:', newRotation);

      setRotation(newRotation);

      setState(prev => ({
        ...prev,
        isSpinning: true,
        spinDuration: DEFAULT_SPIN_DURATION + getRandomNumber(-1000, 1000),
      }));

    } catch (e: any) {
      enqueueSnackbar(`Contract error: ${e.message}`, { variant: 'error' });
      setPendingWinner(null);
      setState(prev => ({ ...prev, isSpinning: false }));
    }
  }, [state.participants, state.isSpinning, transactionSigner, activeAddress]);

  const handleSpinComplete = useCallback(() => {
    setState(prev => ({
      ...prev,
      isSpinning: false,
      winner: pendingWinner,
    }));

    if (pendingWinner?.name) {
      enqueueSnackbar(`🎉 Winner from contract: ${pendingWinner.name}`, { variant: 'success' });
    }

    setPendingWinner(null);
  }, [pendingWinner]);

  const handleReset = useCallback(() => {
    setState(prev => ({
      ...prev,
      winner: null,
    }));
  }, []);

  useEffect(() => {
    document.title = "Decision Wheel | Professional Selection Tool";
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="flex flex-col items-center justify-start">
            <div className="bg-white rounded-2xl shadow-xl p-10 w-full flex flex-col items-center justify-center">
              <Wheel
                participants={state.participants}
                isSpinning={state.isSpinning}
                rotation={rotation}
                spinDuration={state.spinDuration}
                onSpinComplete={handleSpinComplete}
              />
              <SpinButton
                onClick={handleStartSpin}
                disabled={state.participants.length < 2 || state.isSpinning}
                isSpinning={state.isSpinning}
              />
            </div>
          </div>

          <div>
            <ParticipantList
              participants={state.participants}
              onUpdateParticipants={handleUpdateParticipants}
              isSpinning={state.isSpinning}
            />
          </div>
        </div>
      </main>

      {state.winner && (
        <>
          <Confetti width={width} height={height} numberOfPieces={400} recycle={false} />
          <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex flex-col justify-center items-center">
            <h1 className="text-5xl font-extrabold text-white mb-4 animate-bounce">
              🎉 {state.winner.name} Wins! 🎉
            </h1>
            <button className="btn btn-accent text-lg" onClick={handleReset}>
              Close Celebration
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default WheelSpinner;
