import { ajvInstance, JSONSchemaType } from "./ajv-instance";

interface MyData {
  name: string;
}

const schema: JSONSchemaType<MyData> = {
  type: "object",
  properties: {
    name: { type: "string" },
  },
  required: ["name"],
  additionalProperties: false,
};

const validate = ajvInstance.compile(schema);

// or, if you did not use type annotation for the schema,
// type parameter can be used to make it type guard:
// const validate = ajv.compile<MyData>(schema)

const data = {
  name: "as",
  bar: "abc",
};

if (validate(data)) {
  // data is MyData here
  console.log(data.name);
} else {
  console.log(validate.errors);
}
