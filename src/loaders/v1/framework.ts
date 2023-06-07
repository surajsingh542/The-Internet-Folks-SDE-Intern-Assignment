import express from "express";
import cors from "cors";

const FrameworkLoader = (app: express.Application) => {
  //pass incoming data
  app.use(express.json());
  // pass form data
  app.use(express.urlencoded({ extended: true }));

  // cors
  app.use(cors());
};

export default FrameworkLoader;
