import { useWallet } from '@txnlab/use-wallet-react'
import { enqueueSnackbar } from 'notistack'
import React, { useRef, useState } from 'react'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'
import AppCalls from './components/AppCalls'
import ConnectWallet from './components/ConnectWallet'
import { spinAndCallHello } from './components/spinAndCall'
import Transact from './components/Transact'

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  // Wallet states
  const [openWalletModal, setOpenWalletModal] = useState(false)
  const [openDemoModal, setOpenDemoModal] = useState(false)
  const [appCallsDemoModal, setAppCallsDemoModal] = useState(false)
  const { activeAddress, transactionSigner } = useWallet()

  // Wheel states
  const wheelRef = useRef<HTMLDivElement>(null)
  const [newName, setNewName] = useState('')
  const [participants, setParticipants] = useState(['Hanna', 'Gabriel', 'Charles', 'Fatima'])
  const [spinning, setSpinning] = useState(false)
  const [winner, setWinner] = useState<string | null>(null)
  const { width, height } = useWindowSize()

  // Color palette for segments
  const colors = ['#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA']

  const toggleWalletModal = () => setOpenWalletModal(!openWalletModal)
  const toggleDemoModal = () => setOpenDemoModal(!openDemoModal)
  const toggleAppCallsModal = () => setAppCallsDemoModal(!appCallsDemoModal)

  const addParticipant = () => {
    if (newName.trim() && !participants.includes(newName.trim())) {
      setParticipants([...participants, newName.trim()])
      setNewName('')
    }
  }

  const removeParticipant = (name: string) => {
    setParticipants(participants.filter((p) => p !== name))
    if (winner === name) setWinner(null)
  }

  const spinWheel = async () => {
    if (spinning || participants.length === 0) return

    setSpinning(true)
    setWinner(null)

    try {
      const result = await spinAndCallHello(participants, transactionSigner, activeAddress)
      if (result) {
        setWinner(result)
        enqueueSnackbar(`🎉 Winner from contract: ${result}`, { variant: 'success' })
      }
    } catch (e: any) {
      enqueueSnackbar(`Error: ${e.message}`, { variant: 'error' })
    } finally {
      setSpinning(false)
    }
  }

  const renderWheel = () => {
    if (participants.length === 0) {
      return (
        <div className="absolute inset-0 rounded-full bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">Add names to begin</p>
        </div>
      )
    }

    return participants.map((name, index) => {
      const angle = (360 / participants.length) * index
      const color = colors[index % colors.length]
      const textRadius = 70 // Distance from center

      return (
        <div key={`${name}-${index}`} className="absolute inset-0 origin-center" style={{ transform: `rotate(${angle}deg)` }}>
          <div
            className="absolute w-1/2 h-full left-1/2 top-0 origin-left"
            style={{
              backgroundColor: color,
              clipPath: 'polygon(0% 50%, 100% 0%, 100% 100%)',
            }}
          >
            <div
              className="absolute"
              style={{
                left: `${textRadius}px`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80px',
                textAlign: 'center',
              }}
            >
              <span className="font-bold">{name}</span>
            </div>
          </div>
        </div>
      )
    })
  }

  return (
    <div className="hero min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="hero-content text-center p-6 max-w-4xl">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Wheel Section */}
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h1 className="text-3xl font-bold text-center mb-6 text-purple-700">Spinning Wheel</h1>

            {/* Name Management */}
            <div className="mb-6">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  className="input input-bordered flex-1"
                  placeholder="Add name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
                />
                <button className="btn btn-primary" onClick={addParticipant}>
                  Add
                </button>
              </div>

              {participants.length > 0 && (
                <div className="max-h-40 overflow-y-auto">
                  {participants.map((name) => (
                    <div key={name} className="flex justify-between items-center mb-2">
                      <span>{name}</span>
                      <button className="btn btn-xs btn-error" onClick={() => removeParticipant(name)}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Wheel Display */}
            <div className="relative w-64 h-64 mx-auto mb-6">
              <div
                ref={wheelRef}
                className="absolute inset-0 rounded-full overflow-hidden border-8 border-purple-300"
                style={{ transition: spinning ? 'transform 3s cubic-bezier(0.17, 0.67, 0.21, 0.99)' : 'none' }}
              >
                {renderWheel()}
              </div>
              <div className="absolute top-0 left-1/2 w-6 h-6 bg-purple-600 transform -translate-x-1/2 -translate-y-1/2 rotate-45 z-10" />
            </div>

            <button
              onClick={spinWheel}
              disabled={spinning || participants.length === 0}
              className={`btn w-full ${spinning ? 'btn-disabled' : 'btn-accent'}`}
            >
              {spinning ? 'Spinning...' : 'Spin the Wheel!'}
            </button>

            {winner && (
              <>
                <Confetti width={width} height={height} numberOfPieces={400} recycle={false} />
                <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex flex-col justify-center items-center">
                  <h1 className="text-5xl font-extrabold text-white mb-4 animate-bounce">🎉 {winner} Wins! 🎉</h1>
                  <button className="btn btn-accent text-lg" onClick={() => setWinner(null)}>
                    Close Celebration
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Wallet Section */}
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Wallet Connection</h2>
            <div className="grid gap-4">
              <button data-test-id="connect-wallet" className="btn btn-primary w-full" onClick={toggleWalletModal}>
                Connect Wallet
              </button>

              {activeAddress && (
                <>
                  <button data-test-id="transactions-demo" className="btn btn-secondary w-full" onClick={toggleDemoModal}>
                    Transactions Demo
                  </button>
                  <button data-test-id="appcalls-demo" className="btn btn-secondary w-full" onClick={toggleAppCallsModal}>
                    Contract Interactions
                  </button>
                </>
              )}
            </div>

            <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
            <Transact openModal={openDemoModal} setModalState={setOpenDemoModal} />
            <AppCalls openModal={appCallsDemoModal} setModalState={setAppCallsDemoModal} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
