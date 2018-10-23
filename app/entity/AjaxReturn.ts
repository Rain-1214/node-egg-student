
export default class AjaxReturn<T> {
  stateCode: number;
  message: string;
  data?: T | any;

  constructor (stateCode: number, message: string, data?: T) {
    this.stateCode = stateCode;
    this.message = message;
    this.data = data;
  }
}
