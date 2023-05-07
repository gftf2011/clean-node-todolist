/* eslint-disable max-classes-per-file */
import crypto from 'crypto';
import { DecryptionProvider } from '../../../app/contracts/providers';

abstract class DecryptionProviderProduct implements DecryptionProvider {
  protected abstract decryption: string;

  constructor(protected readonly key: string, protected readonly iv: string) {}

  public decrypt(value: string): string {
    const encryptedText = value;
    const decipher = crypto.createDecipheriv(
      this.decryption,
      Buffer.from(this.key, 'hex'),
      Buffer.from(this.iv, 'hex'),
    ) as any;

    let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');

    return decrypted;
  }
}

class Aes256CBCDecryptionProviderProduct extends DecryptionProviderProduct {
  protected decryption = 'aes-256-cbc';

  constructor(
    protected override readonly key: string,
    protected override readonly iv: string,
  ) {
    super(key, iv);
  }
}

abstract class DecryptionProviderCreator implements DecryptionProvider {
  private product: DecryptionProvider;

  constructor(private readonly key: string, private readonly iv: string) {
    this.product = this.factoryMethod(this.key, this.iv);
  }

  protected abstract factoryMethod(
    key: string,
    iv: string,
  ): DecryptionProviderProduct;

  public decrypt(value: string): string {
    const response = this.product.decrypt(value);
    return response;
  }
}

class Aes256CBCDecryptionProviderCreator extends DecryptionProviderCreator {
  protected factoryMethod(key: string, iv: string): DecryptionProviderProduct {
    return new Aes256CBCDecryptionProviderProduct(key, iv);
  }
}

export enum DECRYPTION_FACTORIES {
  AES_256_CBC = 'AES_256_CBC',
}

export class DecryptionFactory {
  constructor(private readonly key: string, private readonly iv: string) {}

  // eslint-disable-next-line consistent-return
  public make(factoryType: DECRYPTION_FACTORIES): DecryptionProvider {
    if (factoryType === DECRYPTION_FACTORIES.AES_256_CBC) {
      return new Aes256CBCDecryptionProviderCreator(this.key, this.iv);
    }
  }
}
