export * from "./syntax/external";
export * from "./types";
export { createClient } from "edgedb";
import { $, _edgedbJsVersion } from "edgedb";
import * as $syntax from "./syntax/syntax";
import * as $op from "./operators";
import _std from "./modules/std";
import _cal from "./modules/cal";
import _cfg from "./modules/cfg";
import _external from "./modules/external";
import _schema from "./modules/schema";
import _sys from "./modules/sys";
import _learning from "./modules/learning";
import _users from "./modules/users";
import _math from "./modules/math";
import _default from "./modules/default";

if (_edgedbJsVersion !== "0.22.8") {
  throw new Error(
    `The query builder was generated by a different version of edgedb-js (v0.22.8)` +
      ` than the one currently installed (v${_edgedbJsVersion}).\n` +
      `Run 'npx edgeql-js' to re-generate a compatible version.\n`
  );
}

const ExportDefault: typeof _std & 
  typeof _default & 
  $.util.OmitDollarPrefixed<typeof $syntax> & 
  typeof $op & {
  "std": typeof _std;
  "cal": typeof _cal;
  "cfg": typeof _cfg;
  "external": typeof _external;
  "schema": typeof _schema;
  "sys": typeof _sys;
  "learning": typeof _learning;
  "users": typeof _users;
  "math": typeof _math;
  "default": typeof _default;
} = {
  ..._std,
  ..._default,
  ...$.util.omitDollarPrefixed($syntax),
  ...$op,
  "std": _std,
  "cal": _cal,
  "cfg": _cfg,
  "external": _external,
  "schema": _schema,
  "sys": _sys,
  "learning": _learning,
  "users": _users,
  "math": _math,
  "default": _default,
};
const Cardinality = $.Cardinality;
type Cardinality = $.Cardinality;
export type Set<
  Type extends $.BaseType,
  Card extends $.Cardinality = $.Cardinality.Many
> = $.TypeSet<Type, Card>;


export default ExportDefault;
export { Cardinality };
