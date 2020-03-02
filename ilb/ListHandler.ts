import Express from "./Express";
import { graphql, buildSchema } from "graphql";
import SchemaModel from "./SchemaModel";
import IExpress from "./types/IExpress";

export default class ListHandler {
  apply(express: IExpress): ListHandler {
    express.hooks.handler.for("/list").tap("ListHandler",async (req, context) => {
      let query = req.query["gql"];
      let name = req.query["name"];
      return await this.find(context, query, name);
    });
    return this;
  }

  async find(context: IExpress, query: string, schemaName: string) {
    let schema: SchemaModel = context.schemaModelFactory.create(schemaName);
    let graphqlSchema = buildSchema(schema.graphqlSchema());
    let resolver = this.resolver(context, schema);
    return await graphql(graphqlSchema, query, resolver);
  }

  resolver(context: IExpress, schema: SchemaModel) {
    return {
      [`${schema.name}Query`]: async function() {
        const result = await context.dbModel.findAll(schema);
        return result.map(item => {
          return {
            ...item._doc,
            _id: item.id
          };
        });
      }
    };
  }
}
