/* eslint-disable max-classes-per-file */
import crypto from 'crypto';
import { DecryptionProvider } from '../../../app/contracts/providers';

abstract class DecryptionProviderProduct implements DecryptionProvider {
  protected abstract decryption: string;

  constructor(protected readonly key: string, protected readonly iv: string) {}

  public decrypt(value: string): string {
    const encryptedText = Buffer.from(value, 'hex');
    const decipher = crypto.createDecipheriv(
      this.decryption,
      Buffer.from(this.key),
      Buffer.from(this.iv, 'hex'),
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString('hex');
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

class Aes256GCMDecryptionProviderProduct extends DecryptionProviderProduct {
  protected decryption = 'aes-256-gcm';

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
    this.product = this.factoryMethod(key, iv);
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

class Aes256GCMDecryptionProviderCreator extends DecryptionProviderCreator {
  protected factoryMethod(key: string, iv: string): DecryptionProviderProduct {
    return new Aes256GCMDecryptionProviderProduct(key, iv);
  }
}

export enum DECRYPTION_FACTORIES {
  AES_256_CBC = 'AES_256_CBC',
  AES_256_GCM = 'AES_256_GCM',
}

export class DecryptionFactory {
  constructor(private readonly key: string, private readonly iv: string) {}

  // eslint-disable-next-line consistent-return
  public make(factoryType: DECRYPTION_FACTORIES): DecryptionProvider {
    if (factoryType === DECRYPTION_FACTORIES.AES_256_CBC) {
      return new Aes256CBCDecryptionProviderCreator(this.key, this.iv);
    }
    if (factoryType === DECRYPTION_FACTORIES.AES_256_GCM) {
      return new Aes256GCMDecryptionProviderCreator(this.key, this.iv);
    }
  }
}
