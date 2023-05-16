import { HashFactory, HASH_FACTORIES } from '../../../../src/infra/providers';

describe('Hash Provider', () => {
  describe('Node JS - SHA 512', () => {
    it('should return hashed value', async () => {
      const response =
        '1843e0e1170aa22686b10f488609f5e528bece7062610e41ea21b38e5e6f6ef950bd18679b79501b155196bb1333aeb0719d8274360fffdff76ed1dd00550f5734c2e4d31b7b7281048e716497065f0e5df445813bb8eebd5eea3959a2cdd9746e7e33f64797038bd3c3945d6a9a2146759b87d5d790ba408421fdebd6390e54bd6e1adec6314d6e8356a0e8c06984ab0816863fba007cc284e9fecb5481c10603668e418264fc3f8bddcc650e882c740e09c8ddafe918dc6f21f8df691a4bed8a577ae6d7d0fe03062b58293bccd5881623dc12044774fd7e6bc3660d41cbdfbb962b0f49879bc9c4c95374edd813bac81809d5324fa90a1fdadf49c6c480b4aaecaa8439c6fdaad441890cca1b2a4ac3ccae764bbad778e14d1fc41ab1525bc0e434086f0788a018ff999656181d2a867f16924b4c1a0bd13f1c47c83b2d56ce56c7a317eae1b7163c44873ec06d54e366d93bd4bb2252054a06cba190ee0be25dd865deb321b6e0935b81d54e5fcbca505e4d222387a3fd262d5ddc40056bf4f71e49598adf662baab7232437f024ace0936621d7e6bb3e504e9389520f8d85cc42704fc403af390b0eabf8c8e5084901a4f1d52bf35d52ab2daedaef7090d25c03c164c2512b2730716f99aa66122e1701d15c4a1bfe1016b40d24b60fe3b27a187781b0bc2533620fd5cc506f39a956982e786ef76c5f020279590e69d9';
      const provider = new HashFactory().make(HASH_FACTORIES.SHA_521);

      const value =
        "That's one small step for a man, a giant leap for mankind.";

      const salt = 'sea salt.';

      const encodedValue = await provider.encode(value, salt);

      expect(encodedValue).toBe(response);
    });
  });
});
