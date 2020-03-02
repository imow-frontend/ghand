//@ts-nocheck
import ListHandler from "../ilb/ListHandler";
import Express from "./support/Express";
import express from "jest-express";
import { Request } from "jest-express/lib/request";

jest.mock("express", () => {
  return express;
});

describe("test", () => {
  test("should ", done => {
    let listHandler = new ListHandler();
    let express = new Express();
    listHandler.apply(express);
    express.dbModel.findAll = jest.fn(() => {
      return [
        {
          _doc: {
            testfiled: "1234"
          },
          id: 1234
        }
      ];
    });
    let request = new Request(
      "/users?gql={ testQuery { testfiled } }&name=test"
    );
   
    express.hooks.handler
      .for("/list")
      .promise(request, express)
      .then(x => {
        expect(x.data.testQuery[0]).toEqual({ testfiled: "1234" });
        done();
      });
     
  });
});
