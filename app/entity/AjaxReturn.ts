
export default class AjaxReturn<T> {
  stateCode: number;
  data: T | any;
  message?: string;

  constructor (stateCode: number, message?: string, data?: T | any) {
    this.stateCode = stateCode;
    this.message = message;
    this.data = data;
  }
}
