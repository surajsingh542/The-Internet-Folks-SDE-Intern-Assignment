import { ajvInstance, JSONSchemaType } from "./ajv-instance";

interface MyData {
  community: string;
  user: string;
  role: string;
}

const memberSchema: JSONSchemaType<MyData> = {
  type: "object",
  properties: {
    community: { type: "string", minLength: 2 },
    user: { type: "string" },
    role: { type: "string" },
  },
  required: ["community", "user", "role"],
  additionalProperties: false,
  errorMessage: {
    required: {
      community: "Community Id is required",
      user: "User Id is required",
      role: "Role Id is required",
    },
  },
};

export const addMemberSchema = ajvInstance.compile(memberSchema);
