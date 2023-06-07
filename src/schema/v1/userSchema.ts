import { ajvInstance, JSONSchemaType } from "./ajv-instance";

interface SignUp {
  name: string;
  email: string;
  password: string;
}

interface SignIn {
  email: string;
  password: string;
}

const signUpSchema: JSONSchemaType<SignUp> = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 2 },
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 6 },
  },
  required: ["name", "email", "password"],
  additionalProperties: false,
};

export const userSignUpSchema = ajvInstance.compile(signUpSchema);

const signInSchema: JSONSchemaType<SignIn> = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 6 },
  },
  required: ["email", "password"],
  additionalProperties: false,
  errorMessage: {
    properties: {
      email: "Please provide a valid email address.",
      password: "Password should be of minimum 6 characters",
    },
    required: {
      email: "Email is required",
      password: "Password is required",
    },
  },
};

export const userSignInSchema = ajvInstance.compile(signInSchema);