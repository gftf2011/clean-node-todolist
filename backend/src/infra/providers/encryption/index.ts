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
  constructor(private readonly key: string, private readonly iv: string) {}

  protected abstract factoryMethod(
    key: string,
    iv: string,
  ): EncryptionProviderProduct;

  public encrypt(value: string): string {
    const encryptionProvider = this.factoryMethod(this.key, this.iv);
    const response = encryptionProvider.encrypt(value);
    return response;
  }
}

export class Aes256CBCEncryptionProviderCreator extends EncryptionProviderCreator {
  protected factoryMethod(key: string, iv: string): EncryptionProviderProduct {
    return new Aes256CBCEncryptionProviderProduct(key, iv);
  }
}
