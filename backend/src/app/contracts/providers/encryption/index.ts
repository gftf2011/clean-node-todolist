export interface EncryptionProvider {
  encrypt: (value: string) => string;
}
