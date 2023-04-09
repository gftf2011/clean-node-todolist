export interface DecryptionProvider {
  decrypt: (value: string) => string;
}
