import { prisma } from "../../../universe/v1/utils/db.server";
import * as bcrypt from "bcryptjs";
import { generateToken } from "../../../universe/v1/utils/generateToken";
import { Request, Response, NextFunction } from "express";
import validator from "validator";
import * as UserService from "../../../services/v1/User/user.service";
import { PlatformError } from "../../../CustomErrors/PlatfotmError";

const userSignUpController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    let errorFound = false;
    let errors = [];

    if (!name || name.length < 2) {
      errorFound = true;
      errors.push({
        param: "name",
        message: "Name should be at least 2 characters.",
        code: "INVALID_INPUT",
      });
    }

    if (!password || password.length < 6) {
      errorFound = true;
      errors.push({
        param: "password",
        message: "Password should be at least 6 characters.",
        code: "INVALID_INPUT",
      });
    }

    // check if user already exists
    const userFound = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userFound) {
      errorFound = true;
      errors.push({
        param: "email",
        message: "User with this email address already exists.",
        code: "RESOURCE_EXISTS",
      });
    }

    if (errorFound) {
      throw new PlatformError(errors);
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // const id = Snowflake.generate().toString();

    // signup user
    const userCreated = await UserService.userSignUp({
      name,
      email,
      password: hashedPassword,
    });
    // const userCreated = await prisma.user.create({
    //   data: {
    //     id,
    //     name,
    //     email,
    //     password: hashedPassword,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    // });

    // send response
    res.json({
      status: true,
      content: {
        data: {
          id: userCreated.id,
          name: userCreated.name,
          email: userCreated.email,
          created_at: userCreated.createdAt,
        },
        meta: {
          access_token: generateToken(userCreated.id),
        },
      },
    });
  } catch (error: any) {
    next(error);
    // return next(new AppErr(error.message, 500));
  }
};

const userSignInController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const isEmailValid = validator.isEmail(email);

    let errorFound = false;
    let errors = [];

    if (!isEmailValid) {
      errorFound = true;
      errors.push({
        param: "email",
        message: "Please provide a valid email address.",
        code: "INVALID_INPUT",
      });
      throw new PlatformError(errors);
    }

    // find the user
    const userFound = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!userFound) {
      errorFound = true;
      errors.push({
        param: "email",
        message: "The credentials you provided are invalid.",
        code: "INVALID_CREDENTIALS",
      });
      throw new PlatformError(errors);
    }

    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, userFound.password);
    if (!isPasswordMatch) {
      errorFound = true;
      errors.push({
        param: "password",
        message: "The credentials you provided are invalid.",
        code: "INVALID_CREDENTIALS",
      });
    }

    if (errorFound) {
      throw new PlatformError(errors);
    }

    // send response
    res.json({
      status: true,
      content: {
        data: {
          id: userFound.id,
          name: userFound.name,
          email: userFound.email,
          created_at: userFound.createdAt,
        },
        meta: {
          access_token: generateToken(userFound.id),
        },
      },
    });
  } catch (error: any) {
    next(error);
  }
};

const userDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // find the user
    const userFound = await UserService.getUser(res.locals.user);
    // const userFound = await prisma.user.findUnique({
    //   where: { id: res.locals.user },
    //   select: {
    //     id: true,
    //     name: true,
    //     email: true,
    //     createdAt: true,
    //   },
    // });

    // send response
    if (userFound) {
      return res.json({
        status: true,
        content: {
          data: {
            id: userFound.id,
            name: userFound.name,
            email: userFound.email,
            created_at: userFound.createdAt,
          },
        },
      });
    } else {
      throw new PlatformError([
        {
          message: "User Not Found",
        },
      ]);
    }
  } catch (error: any) {
    next(error);
  }
};

export { userSignUpController, userSignInController, userDetails };