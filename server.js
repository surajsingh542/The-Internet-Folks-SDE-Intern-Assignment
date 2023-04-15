require("dotenv").config();
const express = require("express");
const roleRoutes = require("./routes/Role/role");
const userRoutes = require("./routes/User/user");
const globalErrHandler = require("./middlewares/globalErrHandler");
const communityRoutes = require("./routes/Community/community");
const memberRoutes = require("./routes/Member/member");
require("./config/dbconnect");
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

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is up and running on ${PORT}`);
});
