import express from "express";
import roleRoutes from "./api/v1/Role/role";
import userRoutes from "./api/v1/User/user";
import communityRoutes from "./api/v1/Community/community";
import memberRoutes from "./api/v1/Member/member";
import globalErrHandler from "./middlewares/globalErrHandler";
import FrameworkLoader from "./loaders/v1/framework";
import Logger from "./universe/v1/libraries/logger";
import Env from "./loaders/v1/env";

const server = (): express.Application => {
  const app = express();

  // Loaders
  Env.Loader();
  FrameworkLoader(app);
  Logger.Loader();

  // Routes
  app.use("/v1", roleRoutes);
  app.use("/v1/community", communityRoutes);
  app.use("/v1/auth", userRoutes);
  app.use("/v1/member", memberRoutes);

  // Error handlers
  app.use(globalErrHandler);

  return app;
};

export default server;
