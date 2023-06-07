import { ajvInstance, JSONSchemaType } from "./ajv-instance";

interface Role {
  name: string;
}

const roleSchema: JSONSchemaType<Role> = {
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

export const addRoleSchema = ajvInstance.compile(roleSchema);
