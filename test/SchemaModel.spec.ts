import SchemaModel from "../ilb/SchemaModel";
import { Schema, SchemaType, SchemaItem } from "../ilb/types/Schema";

describe("test SchemaModel", () => {
  let schema = new SchemaModel("test");
  schema.setSchema({
    test: {
      prop: "testfiled",
      type: SchemaType.String,
      required: true,
      parse: () => true,
      description: "test"
    }
  });
  test("should graphqlSchema correct", () => {
    expect(schema.graphqlSchema().trim()).toEqual(
      `
      type test {
        _id: ID!
        testfiled: String!
      }

      type RootQuery {
        testQuery: [test!]!
      }

      schema {
        query: RootQuery
      }
      `.trim()
    );
  });

  test("should excelSchema correct", () => {
    expect(schema.excelSchema()).toEqual({
      test: {
        prop: "testfiled",
        type: String,
        required: true,
        parse: expect.any(Function)
      }
    });
  });

});
