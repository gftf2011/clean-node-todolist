export interface HashProvider {
  encode: (value: string, salt?: string) => Promise<string>;
}
