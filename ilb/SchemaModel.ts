import { Schema, SchemaType } from "./types/Schema";

export default class SchemaModel {
  schema: Schema;

  name: string;

  constructor(name: string) {
    this.name = name;
  }

  setSchema(schema: Schema) {
    this.schema = schema;
  }

  excelSchema() {
    let schema = {};
    let keys = Object.keys(this.schema);
    keys.forEach(key => {
      let { type, prop, required, parse } = this.schema[key];
      schema[key] = {
        prop,
        type: excelSchemaType(type),
        required,
        parse
      };
    });
    return schema;
  }

  graphqlSchema() {
    let keys = Object.keys(this.schema);
    return `
      type ${this.name} {
        _id: ID!
        ${keys
          .map(key =>
            `${this.schema[key].prop}: ${graphqlSchemaType(
              this.schema[key].type
            )}`
          )
          .join("\n")}
      }

      type RootQuery {
        ${this.name}Query: [${this.name}!]!
      }

      schema {
        query: RootQuery
      }
    `;
  }

  mongodbSchema() {
    let schema = {};
    let keys = Object.keys(this.schema);
    keys.forEach(key => {
      let { type, prop, required } = this.schema[key];
      schema[prop] = {
        type: mongodbSchemaType(type),
        required
      };
    });
    return schema;
  }
}

function mongodbSchemaType(type: SchemaType) {
  switch (type) {
    case 0: //"String"
      return String;
    case 1: //"Number"
      return Number;
    case 2: //"Boolean"
      return Boolean;
    case 3: //"Date"
      return Date;
    case 4: //"Id"
      return "id";
    case 5: //"Float"
      return Number;
  }
}

function excelSchemaType(type: SchemaType) {
  switch (type) {
    case 0: //"String"
      return String;
    case 1: //"Number"
      return Number;
    case 2: //"Boolean"
      return Boolean;
    case 3: //"Date"
      return Date;
    case 4: //"Id"
      return String;
    case 5: //"Float"
      return Number;
  }
}

function graphqlSchemaType(type: SchemaType) {
  switch (type) {
    case 0: //"String"
      return "String!";
    case 1: //"Number"
      return "Number!";
    case 2: //"Boolean"
      return "Boolean!";
    case 3: //"Date"
      return "Date!";
    case 4: //"Id"
      return "ID!";
    case 5: //"Float"
      return "Float!";
  }
}
