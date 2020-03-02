import { HookMap, SyncBailHook, SyncHook } from "tapable";
import SchemaModelFactory from "../SchemaModelFactory";
import MongoDBModel from "../MongoDBModel";
import UpdateHandler from "../UpdateHandler";
import UploadHandler from "../UploadHandler";

import { Request } from "express";
interface IExpress {
  hooks: {
    init: SyncHook<IExpress, initPara>;
    handler: HookMap<Request, IExpress>;
  };
  schemaModelFactory: SchemaModelFactory;
  dbModel: MongoDBModel;
}

export type initPara = {
  updateHandler: UpdateHandler;
  uploadHandler: UploadHandler;
  schemaModelFactory: SchemaModelFactory;
  dbModel: MongoDBModel;
};

export default IExpress;
