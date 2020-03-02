export enum SchemaType {
  String,
  Number,
  Boolean,
  Date,
  Id,
  Float
}
export type Schema = {
  [propName: string]: SchemaItem;
};

export type SchemaItem = {
  prop: string;
  type: SchemaType;
  required: boolean;
  parse: (value: any) => any;
  description: string;
};
