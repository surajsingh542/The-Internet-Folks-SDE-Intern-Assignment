class AppErr extends Error {
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = "Failed";
  }
}
// const AppErr(message,statusCode){
//       const error = new Error(message);
//       error.statusCode = statusCode;
//       error.status = "Failed";
//       return error;
// }

export default AppErr;
