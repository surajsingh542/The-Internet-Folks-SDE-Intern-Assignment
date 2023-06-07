import { ajvInstance, JSONSchemaType } from "./ajv-instance";

interface MyData {
  name: string;
}

const createSchema: JSONSchemaType<MyData> = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 2 },
  },
  required: ["name"],
  additionalProperties: false,
  errorMessage: {
    properties: {
      name: "Name should be at least 2 characters.",
    },
    required: {
      name: "Name is required",
    },
  },
};

export const createCommunitySchema = ajvInstance.compile(createSchema);
