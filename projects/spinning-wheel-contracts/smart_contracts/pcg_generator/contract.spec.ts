import { TestExecutionContext } from '@algorandfoundation/algorand-typescript-testing'
import { describe, expect, it } from 'vitest'
import { PcgGenerator } from './contract.algo'

describe('PcgGenerator contract', () => {
  const ctx = new TestExecutionContext()
  it('Logs the returned value when sayHello is called', () => {
    const contract = ctx.contract.create(PcgGenerator)

    const result = contract.hello('Sally')

    expect(result).toBe('Hello Sally')
  })
})
