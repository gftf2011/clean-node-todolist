/* eslint-disable max-classes-per-file */
import crypto from 'crypto';
import { promisify } from 'util';

import { HashProvider } from '../../../app/contracts/providers';

abstract class HashProviderProduct implements HashProvider {
  protected abstract encoding: string;

  async encode(value: string, salt: string): Promise<string> {
    const buffer = await promisify(crypto.pbkdf2)(
      value,
      salt,
      50000,
      512,
      this.encoding,
    );
    return buffer.toString('hex');
  }
}

class HashSha512ProviderProduct extends HashProviderProduct {
  protected encoding = 'sha512';
}

abstract class HashProviderCreator implements HashProvider {
  protected abstract factoryMethod(): HashProviderProduct;

  public async encode(value: string, salt: string): Promise<string> {
    const hashProvider = this.factoryMethod();
    const response = await hashProvider.encode(value, salt);
    return response;
  }
}

export class HashSha512ProviderCreator extends HashProviderCreator {
  protected factoryMethod(): HashProviderProduct {
    return new HashSha512ProviderProduct();
  }
}
