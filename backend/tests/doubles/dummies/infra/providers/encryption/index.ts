import { EncryptionProvider } from '../../../../../../src/app/contracts/providers';

export class EncryptionProviderDummy implements EncryptionProvider {
  encrypt: (value: string) => string;
}
