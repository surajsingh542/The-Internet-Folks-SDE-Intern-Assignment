import CustomError, { IErrorSeralized } from "../utils/AppErr";

export class PlatformError extends CustomError {
  statusCode: number = 400;

  errors: IErrorSeralized[] = [];

  constructor(errors: IErrorSeralized[]) {
    super("InvalidRequest"); // send to parent class

    this.message = "InvalidRequest";

    this.errors = errors;

    Object.setPrototypeOf(this, PlatformError.prototype);
  }

  serialize(): IErrorSeralized[] {
    return this.errors.map((item) => ({
      message: item.message,
      param: item.param,
      code: item.code,
    }));
  }
}
