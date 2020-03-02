import { SyncHook } from "tapable";

import ExcelModel from "./ExcelModel";
import { Request } from "express";
import Express from "./Express";
import IExpress from "./types/IExpress";


export default class UploadHandler {
  hooks: {
    run: SyncHook;
  };

  constructor() {
    this.hooks = Object.freeze({
      run: new SyncHook(["request"])
    });
  }

  apply(express: Express): UploadHandler {
    express.hooks.handler.for("/update").tap("UpdateHandler", (req, context) => {
      this.handle(req, context);
    });
    return this;
  }

  handle(request: Request, context: IExpress) {
    context.schemaModelFactory.create("");
    this.hooks.run.call(request);
  }
}
