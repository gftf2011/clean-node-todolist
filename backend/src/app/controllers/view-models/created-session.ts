export class CreatedSessionViewModel {
  private constructor(public readonly token: string) {}

  public static map(token: string): CreatedSessionViewModel {
    return new CreatedSessionViewModel(token);
  }
}
