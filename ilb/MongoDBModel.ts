import { HookMap, SyncHook } from "tapable";
import { MongoClient, Collection } from "mongodb";
import SchemaModel from "./SchemaModel";

export default class MongoDBModel {
  hooks: {
    url: SyncHook;
    db: SyncHook<SchemaModel>;
    collection: SyncHook<SchemaModel>;
    insert: SyncHook<any, SchemaModel>;
    update: SyncHook<any, SchemaModel>;
  };

  constructor() {
    this.hooks = Object.freeze({
      url: new SyncHook(),
      db: new SyncHook(["schema"]),
      collection: new SyncHook(["schema"]),
      insert: new SyncHook(["data", "schema"]),
      update: new SyncHook(["data", "schema"])
    });
  }
  async connect() {
    let url = this.hooks.url.call();
    let clint = await MongoClient.connect(url);
    return clint;
  }

  async getCollection(schema: SchemaModel): Promise<Collection> {
    let client = await this.connect();
    let dbName = this.hooks.db.callAsync(schema);
    let db = client.db(dbName);
    let collectionName = this.hooks.collection.callAsync(schema);
    return db.collection(collectionName);
  }

  async insert(data, schema: SchemaModel) {
    let collection = await this.getCollection(schema);
    data = this.hooks.insert.call(data, schema);
    collection.insertMany(data);
  }

  async update(data, schema: SchemaModel) {
    let collection = await this.getCollection(schema);
    data = this.hooks.update.call(data, schema);
    collection.updateMany({ a: 1 }, { $set: { b: 1 } });
  }

  async findAll(schema: SchemaModel){
    let collection = await this.getCollection(schema);
    return collection.find();
  }
}
