import { config } from "dotenv";
config();
import express from "express";
// import { Server } from "http";
import roleRoutes from "./routes/Role/role";
import userRoutes from "./routes/User/user";
import communityRoutes from "./routes/Community/community";
import memberRoutes from "./routes/Member/member";
import globalErrHandler from "./middlewares/globalErrHandler";

const app = express();

//pass incoming data
app.use(express.json());
// pass form data
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/v1", roleRoutes);
app.use("/v1/community", communityRoutes);
app.use("/v1/auth", userRoutes);
app.use("/v1/member", memberRoutes);

// Error handlers
app.use(globalErrHandler);

const PORT: number = parseInt(process.env.PORT as string, 10) || 9000;
app.listen(PORT, () => {
  console.log(`Server is up and running on ${PORT}`);
});
