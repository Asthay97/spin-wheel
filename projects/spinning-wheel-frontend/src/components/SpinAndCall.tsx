// components/spinAndCall.ts
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { OnSchemaBreak, OnUpdate } from '@algorandfoundation/algokit-utils/types/app'
import { LibPcg64ExposerAlgoTsFactory } from '../contracts/LibPcg64ExposerAlgoTs'
import { getAlgodConfigFromViteEnvironment, getIndexerConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

export const spinAndCallHello = async (
  participants: string[],
  transactionSigner: any,
  activeAddress: string | null,
): Promise<string | null> => {
  if (participants.length === 0) return null

  const upperBound = BigInt(participants.length)
  const lowerBound = BigInt(0)
  const length = BigInt(1)

  const seedBytes = window.crypto.getRandomValues(new Uint8Array(16)) // 16 bytes = 128 bits
  console.log('seed bytes: ', seedBytes)
  const algodConfig = getAlgodConfigFromViteEnvironment()
  const indexerConfig = getIndexerConfigFromViteEnvironment()

  const algorand = AlgorandClient.fromConfig({ algodConfig, indexerConfig })
  algorand.setDefaultSigner(transactionSigner)

  const factory = new LibPcg64ExposerAlgoTsFactory({
    defaultSender: activeAddress ?? undefined,
    algorand,
  })

  const deployResult = await factory.deploy({
    onSchemaBreak: OnSchemaBreak.AppendApp,
    onUpdate: OnUpdate.AppendApp,
  })

  if (!deployResult) throw new Error('Contract deployment failed')

  const { appClient } = deployResult

  const response = await appClient.send.boundedRandUint64({
    args: {
      seed: seedBytes,
      lowerBound: BigInt(lowerBound),
      upperBound: upperBound,
      length: length,
    },
  })

  const resultArray = response?.return as bigint[]
  if (!resultArray || resultArray.length === 0) throw new Error('No output from boundedRandUint64')

  const selectedIndex = Number(resultArray[0])
  const selectedName = participants[selectedIndex]

  return selectedName
}
