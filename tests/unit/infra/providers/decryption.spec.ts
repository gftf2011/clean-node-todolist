import {
  DECRYPTION_FACTORIES,
  DecryptionFactory,
} from '../../../../src/infra/providers';

describe('Decryption Provider', () => {
  describe('Node JS - AES 256 CBC', () => {
    it('should return decrypted value', () => {
      const response =
        "That's one small step for a man, a giant leap for mankind.";
      const iv = '0'.repeat(32);
      const key = '0'.repeat(64);
      const provider = new DecryptionFactory(key, iv).make(
        DECRYPTION_FACTORIES.AES_256_CBC,
      );

      const value =
        '45564e005318d0da3cf05ed2b1cbe4271c94623abcb0c2e8cce75a27b445d232ce18d90af2e2bc3618d4da38546867034fba7ddb33139b4bddcc9858f877e30b';

      const decryptedValue = provider.decrypt(value);

      expect(decryptedValue).toBe(response);
    });
  });
});
