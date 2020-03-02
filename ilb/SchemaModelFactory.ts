import SchemaModel from "./SchemaModel";
import { SyncBailHook, HookMap } from "tapable";

export default class SchemaModelFactory {
  map: Map<string, SchemaModel>;

  hooks: {
    createSchema: HookMap;
  };

  constructor() {
    this.hooks = Object.freeze({
      createSchema: new HookMap(() => new SyncBailHook())
    });
    this.map = new Map<string, SchemaModel>();
  }

  create(name) {
    let schema = this.map.get(name);
    if (!schema) {
      schema = this.hooks.createSchema.for(name).call();
      this.map.set(name, schema);
    }
    return schema;
  }
}
