import { Contract } from '@algorandfoundation/algorand-typescript'

export class SpinningWheel extends Contract {
  public hello(name: string): string {
    return `Hello, ${name}`
  }
}
