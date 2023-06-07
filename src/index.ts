import Env from "./loaders/v1/env";
import Logger from "./universe/v1/libraries/logger";
import server from "./server";

(async () => {
  const app = server();
  const PORT: number = parseInt(Env.variable.PORT as string, 10) || 5000;
  app.listen(PORT, () => {
    Logger.instance.info(`Server is up and running on ${PORT}`);
  });
})();
