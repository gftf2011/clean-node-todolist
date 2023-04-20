import { DecryptionProvider } from '../../../../../../src/app/contracts/providers';

export class DecryptionProviderDummy implements DecryptionProvider {
  decrypt: (value: string) => string;
}
