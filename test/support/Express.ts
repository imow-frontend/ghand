import SchemaModelFactory from "../../ilb/SchemaModelFactory";
import MongoDBModel from "../../ilb/MongoDBModel";
import IExpress, { initPara } from "../../ilb/types/IExpress";
import { HookMap, SyncBailHook, SyncHook,AsyncSeriesBailHook } from "tapable";
import { Request } from "express";
import SchemaModel from "../../ilb/SchemaModel";
import { Schema, SchemaType, SchemaItem } from "../../ilb/types/Schema";

export default class Express implements IExpress {
  hooks: {
    init: SyncHook<IExpress, initPara, any>;
    handler: HookMap<Request, IExpress>;
  };
  schemaModelFactory: SchemaModelFactory;
  dbModel: MongoDBModel;
  constructor(port = null, host = null) {
    this.hooks = Object.freeze({
      init: new SyncHook(["express", "initPara"]),
      handler: new HookMap(() => new AsyncSeriesBailHook(["req", "context"]))
    });
    this.schemaModelFactory = new SchemaModelFactory();
    this.dbModel = new MongoDBModel();
    this.initSchema();
  }
  initSchema() {
    let name = "test";
    this.schemaModelFactory.hooks.createSchema
      .for(name)
      .tap("testExpress", () => {
        let schema = new SchemaModel(name);
        schema.setSchema({
          test: {
            prop: "testfiled",
            type: SchemaType.String,
            required: true,
            parse: () => true,
            description: "test"
          }
        });
        return schema;
      });
  }
}
