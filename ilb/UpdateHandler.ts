import { HookMap, SyncBailHook, SyncHook } from "tapable";
import { Request } from "express";
import KeyValuePair from "./types/KeyValuePair";
import Express from "./Express";
import IExpress from "./types/IExpress";


export default class UpdateHandler {
  hooks: {
    validate: HookMap<string | number>;
    update: HookMap<string | number>;
  };

  constructor() {
    this.hooks = Object.freeze({
      update: new HookMap(() => new SyncBailHook(["value"])),
      validate: new HookMap(() => new SyncBailHook(["value"]))
    });
  }

  apply(express: Express): UpdateHandler {
    express.hooks.handler
      .for("/update")
      .tap("UpdateHandler", (req, context) => {
        this.handle(req, context);
      });
    return this;
  }

  handle(request: Request, context: IExpress) {
    let uploadData = request.body[""];
    this.update(uploadData as KeyValuePair[], context);
  }
  update(uploadData: KeyValuePair[], context: IExpress) {
    let data = uploadData.map(data => {
      let value =
        this.hooks.update.for(data.key).call(data.value) || data.value;
      return { key: data.key, value };
    });
    context.dbModel.update(data, null);
  }
}
