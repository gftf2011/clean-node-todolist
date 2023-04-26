import {
  ENCRYPTION_FACTORIES,
  EncryptionFactory,
} from '../../../../src/infra/providers';

describe('Encryption Provider', () => {
  describe('Node JS - AES 256 CBC', () => {
    it('should return encrypted value', () => {
      const response =
        '45564e005318d0da3cf05ed2b1cbe4271c94623abcb0c2e8cce75a27b445d232ce18d90af2e2bc3618d4da38546867034fba7ddb33139b4bddcc9858f877e30b';
      const iv = '0'.repeat(32);
      const key = '0'.repeat(64);
      const provider = new EncryptionFactory(key, iv).make(
        ENCRYPTION_FACTORIES.AES_256_CBC,
      );

      const value =
        "That's one small step for a man, a giant leap for mankind.";

      const encryptedValue = provider.encrypt(value);

      expect(encryptedValue).toBe(response);
    });
  });
});
