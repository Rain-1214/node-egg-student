
class Tool {

  private static emailRegexp = /^[\w\-]+[\.\w\-]*@[\w\-]+[\.\w\-]+$/;
  private static validCharRegexp = /^[\s\w\-]{6,16}$/;

  public static checkParamValid(...params: any[]): boolean {
    return !params.some((e) => e === '' || e === null || e === undefined);
  }

  public static checkEmail(emailAddress: string): boolean {
    return this.emailRegexp.test(emailAddress);
  }

  public static createRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  public static checkValidChar(value: string): boolean {
    return this.validCharRegexp.test(value);
  }

}

export default Tool;
