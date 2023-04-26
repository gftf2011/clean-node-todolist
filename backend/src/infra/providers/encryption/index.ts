/* eslint-disable max-classes-per-file */
import crypto from 'crypto';
import { EncryptionProvider } from '../../../app/contracts/providers';

abstract class EncryptionProviderProduct implements EncryptionProvider {
  protected abstract encryption: string;

  constructor(protected readonly key: string, protected readonly iv: string) {}

  public encrypt(value: string): string {
    const cipher = crypto.createCipheriv(
      this.encryption,
      Buffer.from(this.key, 'hex'),
      Buffer.from(this.iv, 'hex'),
    );

    let encrypted = cipher.update(value);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return encrypted.toString('hex');
  }
}

class Aes256CBCEncryptionProviderProduct extends EncryptionProviderProduct {
  protected encryption = 'aes-256-cbc';

  constructor(
    protected override readonly key: string,
    protected override readonly iv: string,
  ) {
    super(key, iv);
  }
}

abstract class EncryptionProviderCreator implements EncryptionProvider {
  private product: EncryptionProviderProduct;

  constructor(private readonly key: string, private readonly iv: string) {
    this.product = this.factoryMethod(this.key, this.iv);
  }

  protected abstract factoryMethod(
    key: string,
    iv: string,
  ): EncryptionProviderProduct;

  public encrypt(value: string): string {
    const response = this.product.encrypt(value);
    return response;
  }
}

class Aes256CBCEncryptionProviderCreator extends EncryptionProviderCreator {
  protected factoryMethod(key: string, iv: string): EncryptionProviderProduct {
    return new Aes256CBCEncryptionProviderProduct(key, iv);
  }
}

export enum ENCRYPTION_FACTORIES {
  AES_256_CBC = 'AES_256_CBC',
}

export class EncryptionFactory {
  constructor(private readonly key: string, private readonly iv: string) {}

  // eslint-disable-next-line consistent-return
  public make(factoryType: ENCRYPTION_FACTORIES): EncryptionProvider {
    if (factoryType === ENCRYPTION_FACTORIES.AES_256_CBC) {
      return new Aes256CBCEncryptionProviderCreator(this.key, this.iv);
    }
  }
}
