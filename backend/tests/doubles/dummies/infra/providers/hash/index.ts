import { HashProvider } from '../../../../../../src/app/contracts/providers';

export class HashProviderDummy implements HashProvider {
  encode: (value: string, salt?: string) => Promise<string>;
}
