
class Tool {

  public static checkParamValid(...params: any[]): boolean {
    return !params.some((e) => e === '' || e === null || e === undefined);
  }

}

export default Tool;
