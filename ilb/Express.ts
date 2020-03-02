import { HookMap, SyncBailHook, SyncHook } from "tapable";
import express, { Request } from "express";
import UpdateHandler from "./UpdateHandler";
import UploadHandler from "./UploadHandler";
import SchemaModelFactory from "./SchemaModelFactory";
import MongoDBModel from "./MongoDBModel";
import IExpress, { initPara } from "./types/IExpress";

export default class Express implements IExpress {
  hooks: {
    init: SyncHook<Express, initPara>;
    handler: HookMap<Request, IExpress>;
  };
  private isInit: boolean;
  private port;
  private host;
  schemaModelFactory: SchemaModelFactory;
  dbModel: MongoDBModel;
  constructor(port = null, host = null) {
    this.hooks = Object.freeze({
      init: new SyncHook(["express", "initPara"]),
      handler: new HookMap(() => new SyncBailHook(["req", "context"]))
    });
    this.isInit = false;
    this.host = host || process.env.HOST || "0.0.0.0";
    this.port = port || process.env.PORT || 3001;
    this.schemaModelFactory = new SchemaModelFactory();
    this.dbModel = new MongoDBModel();
  }

  init() {
    if (!this.isInit) {
      let updateHandler = new UpdateHandler().apply(this);
      let uploadHandler = new UploadHandler().apply(this);
      this.hooks.init.call(this, {
        updateHandler,
        uploadHandler,
        schemaModelFactory: this.schemaModelFactory,
        dbModel: this.dbModel
      });
      this.isInit = true;
    }
  }

  run() {
    this.init();
    const app = express();
    app.use((req, res, next) => {
      let path = req.path;
      this.hooks.handler.for(path).call(req, this);
    });
    app.listen(this.port, this.host, () => {});
  }
}
