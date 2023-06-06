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
};

export const addRoleSchema = ajvInstance.compile(roleSchema);
