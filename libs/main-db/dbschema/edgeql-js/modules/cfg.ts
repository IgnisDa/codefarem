import { $ } from "edgedb";
import * as _ from "../imports";
import type * as _std from "./std";
export type $AllowBareDDL = {
  AlwaysAllow: $.$expr_Literal<$AllowBareDDL>;
  NeverAllow: $.$expr_Literal<$AllowBareDDL>;
} & $.EnumType<"cfg::AllowBareDDL", ["AlwaysAllow", "NeverAllow"]>;
const AllowBareDDL: $AllowBareDDL = $.makeType<$AllowBareDDL>(_.spec, "9235c654-6c65-11ed-a83c-13cd6bca7798", _.syntax.literal);

export type $ConnectionTransport = {
  TCP: $.$expr_Literal<$ConnectionTransport>;
  HTTP: $.$expr_Literal<$ConnectionTransport>;
} & $.EnumType<"cfg::ConnectionTransport", ["TCP", "HTTP"]>;
const ConnectionTransport: $ConnectionTransport = $.makeType<$ConnectionTransport>(_.spec, "9236834b-6c65-11ed-9129-9354fadfe366", _.syntax.literal);

export type $memory = $.ScalarType<"cfg::memory", _.edgedb.ConfigMemory>;
const memory: $.scalarTypeWithConstructor<$memory, string> = $.makeType<$.scalarTypeWithConstructor<$memory, string>>(_.spec, "00000000-0000-0000-0000-000000000130", _.syntax.literal);

export type $ConfigObjectλShape = $.typeutil.flatten<_std.$BaseObjectλShape & {
}>;
type $ConfigObject = $.ObjectType<"cfg::ConfigObject", $ConfigObjectλShape, null>;
const $ConfigObject = $.makeType<$ConfigObject>(_.spec, "92373f0e-6c65-11ed-86cc-11908c3e6f3c", _.syntax.literal);

const ConfigObject: $.$expr_PathNode<$.TypeSet<$ConfigObject, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($ConfigObject, $.Cardinality.Many), null, true);

export type $AbstractConfigλShape = $.typeutil.flatten<$ConfigObjectλShape & {
  "session_idle_timeout": $.PropertyDesc<_std.$duration, $.Cardinality.One, false, false, false, true>;
  "session_idle_transaction_timeout": $.PropertyDesc<_std.$duration, $.Cardinality.One, false, false, false, true>;
  "query_execution_timeout": $.PropertyDesc<_std.$duration, $.Cardinality.One, false, false, false, false>;
  "listen_port": $.PropertyDesc<_std.$int16, $.Cardinality.One, false, false, false, true>;
  "listen_addresses": $.PropertyDesc<_std.$str, $.Cardinality.Many, false, false, false, false>;
  "allow_dml_in_functions": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, true>;
  "allow_bare_ddl": $.PropertyDesc<$AllowBareDDL, $.Cardinality.AtMostOne, false, false, false, true>;
  "apply_access_policies": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, true>;
  "allow_user_specified_id": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, true>;
  "shared_buffers": $.PropertyDesc<$memory, $.Cardinality.AtMostOne, false, false, false, false>;
  "query_work_mem": $.PropertyDesc<$memory, $.Cardinality.AtMostOne, false, false, false, false>;
  "effective_cache_size": $.PropertyDesc<$memory, $.Cardinality.AtMostOne, false, false, false, false>;
  "effective_io_concurrency": $.PropertyDesc<_std.$int64, $.Cardinality.AtMostOne, false, false, false, false>;
  "default_statistics_target": $.PropertyDesc<_std.$int64, $.Cardinality.AtMostOne, false, false, false, false>;
  "auth": $.LinkDesc<$Auth, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $AbstractConfig = $.ObjectType<"cfg::AbstractConfig", $AbstractConfigλShape, null>;
const $AbstractConfig = $.makeType<$AbstractConfig>(_.spec, "929b1c5d-6c65-11ed-8a11-57743e3757f1", _.syntax.literal);

const AbstractConfig: $.$expr_PathNode<$.TypeSet<$AbstractConfig, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($AbstractConfig, $.Cardinality.Many), null, true);

export type $AuthλShape = $.typeutil.flatten<$ConfigObjectλShape & {
  "priority": $.PropertyDesc<_std.$int64, $.Cardinality.One, true, false, true, false>;
  "user": $.PropertyDesc<_std.$str, $.Cardinality.Many, false, false, true, true>;
  "comment": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, true, false>;
  "method": $.LinkDesc<$AuthMethod, $.Cardinality.AtMostOne, {}, true, false,  true, false>;
  "<auth[is cfg::AbstractConfig]": $.LinkDesc<$AbstractConfig, $.Cardinality.Many, {}, false, false,  false, false>;
  "<auth[is cfg::Config]": $.LinkDesc<$Config, $.Cardinality.Many, {}, false, false,  false, false>;
  "<auth[is cfg::InstanceConfig]": $.LinkDesc<$InstanceConfig, $.Cardinality.Many, {}, false, false,  false, false>;
  "<auth[is cfg::DatabaseConfig]": $.LinkDesc<$DatabaseConfig, $.Cardinality.Many, {}, false, false,  false, false>;
  "<auth": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Auth = $.ObjectType<"cfg::Auth", $AuthλShape, null>;
const $Auth = $.makeType<$Auth>(_.spec, "9280235b-6c65-11ed-8923-e738c8cd9441", _.syntax.literal);

const Auth: $.$expr_PathNode<$.TypeSet<$Auth, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Auth, $.Cardinality.Many), null, true);

export type $AuthMethodλShape = $.typeutil.flatten<$ConfigObjectλShape & {
  "transports": $.PropertyDesc<$ConnectionTransport, $.Cardinality.Many, false, false, true, false>;
  "<method[is cfg::Auth]": $.LinkDesc<$Auth, $.Cardinality.AtMostOne, {}, true, false,  false, false>;
  "<method": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $AuthMethod = $.ObjectType<"cfg::AuthMethod", $AuthMethodλShape, null>;
const $AuthMethod = $.makeType<$AuthMethod>(_.spec, "924473f1-6c65-11ed-ad8f-03d85e1b6062", _.syntax.literal);

const AuthMethod: $.$expr_PathNode<$.TypeSet<$AuthMethod, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($AuthMethod, $.Cardinality.Many), null, true);

export type $ConfigλShape = $.typeutil.flatten<$AbstractConfigλShape & {
}>;
type $Config = $.ObjectType<"cfg::Config", $ConfigλShape, null>;
const $Config = $.makeType<$Config>(_.spec, "92d521d8-6c65-11ed-8b84-7544f5907c90", _.syntax.literal);

const Config: $.$expr_PathNode<$.TypeSet<$Config, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Config, $.Cardinality.Many), null, true);

export type $DatabaseConfigλShape = $.typeutil.flatten<$AbstractConfigλShape & {
}>;
type $DatabaseConfig = $.ObjectType<"cfg::DatabaseConfig", $DatabaseConfigλShape, null>;
const $DatabaseConfig = $.makeType<$DatabaseConfig>(_.spec, "935dbd20-6c65-11ed-82cc-c9e7a3c796e6", _.syntax.literal);

const DatabaseConfig: $.$expr_PathNode<$.TypeSet<$DatabaseConfig, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($DatabaseConfig, $.Cardinality.Many), null, true);

export type $InstanceConfigλShape = $.typeutil.flatten<$AbstractConfigλShape & {
}>;
type $InstanceConfig = $.ObjectType<"cfg::InstanceConfig", $InstanceConfigλShape, null>;
const $InstanceConfig = $.makeType<$InstanceConfig>(_.spec, "9324dff0-6c65-11ed-84e7-19c2e7d7d251", _.syntax.literal);

const InstanceConfig: $.$expr_PathNode<$.TypeSet<$InstanceConfig, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($InstanceConfig, $.Cardinality.Many), null, true);

export type $JWTλShape = $.typeutil.flatten<Omit<$AuthMethodλShape, "transports"> & {
  "transports": $.PropertyDesc<$ConnectionTransport, $.Cardinality.Many, false, false, true, true>;
}>;
type $JWT = $.ObjectType<"cfg::JWT", $JWTλShape, null>;
const $JWT = $.makeType<$JWT>(_.spec, "92700939-6c65-11ed-beae-a70fc1a2c7f1", _.syntax.literal);

const JWT: $.$expr_PathNode<$.TypeSet<$JWT, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($JWT, $.Cardinality.Many), null, true);

export type $SCRAMλShape = $.typeutil.flatten<Omit<$AuthMethodλShape, "transports"> & {
  "transports": $.PropertyDesc<$ConnectionTransport, $.Cardinality.Many, false, false, true, true>;
}>;
type $SCRAM = $.ObjectType<"cfg::SCRAM", $SCRAMλShape, null>;
const $SCRAM = $.makeType<$SCRAM>(_.spec, "92604fe2-6c65-11ed-8a7f-4d118d0c032c", _.syntax.literal);

const SCRAM: $.$expr_PathNode<$.TypeSet<$SCRAM, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($SCRAM, $.Cardinality.Many), null, true);

export type $TrustλShape = $.typeutil.flatten<$AuthMethodλShape & {
}>;
type $Trust = $.ObjectType<"cfg::Trust", $TrustλShape, null>;
const $Trust = $.makeType<$Trust>(_.spec, "92527a13-6c65-11ed-8f60-0d6976501962", _.syntax.literal);

const Trust: $.$expr_PathNode<$.TypeSet<$Trust, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Trust, $.Cardinality.Many), null, true);

type get_config_jsonλFuncExpr<
  NamedArgs extends {
    "sources"?: $.TypeSet<$.ArrayType<_std.$str>>,
    "max_source"?: _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
  },
> = $.$expr_Function<
  "cfg::get_config_json",
  [],
  _.castMaps.mapLiteralToTypeSet<NamedArgs>,
  $.TypeSet<_std.$json, $.cardinalityUtil.multiplyCardinalities<$.cardinalityUtil.optionalParamCardinality<NamedArgs["sources"]>, $.cardinalityUtil.optionalParamCardinality<NamedArgs["max_source"]>>>
>;
function get_config_json<
  NamedArgs extends {
    "sources"?: $.TypeSet<$.ArrayType<_std.$str>>,
    "max_source"?: _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
  },
>(
  namedArgs: NamedArgs,
): get_config_jsonλFuncExpr<NamedArgs>;
function get_config_json(...args: any[]) {
  const {returnType, cardinality, args: positionalArgs, namedArgs} = _.syntax.$resolveOverload('cfg::get_config_json', args, _.spec, [
    {args: [], namedArgs: {"sources": {typeId: "85c880ca-6c65-11ed-b5e8-0b3ab1466b4e", optional: true, setoftype: false, variadic: false}, "max_source": {typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false}}, returnTypeId: "00000000-0000-0000-0000-00000000010f"},
  ]);
  return _.syntax.$expressionify({
    __kind__: $.ExpressionKind.Function,
    __element__: returnType,
    __cardinality__: cardinality,
    __name__: "cfg::get_config_json",
    __args__: positionalArgs,
    __namedargs__: namedArgs,
  }) as any;
};



export { AllowBareDDL, ConnectionTransport, memory, $ConfigObject, ConfigObject, $AbstractConfig, AbstractConfig, $Auth, Auth, $AuthMethod, AuthMethod, $Config, Config, $DatabaseConfig, DatabaseConfig, $InstanceConfig, InstanceConfig, $JWT, JWT, $SCRAM, SCRAM, $Trust, Trust };

type __defaultExports = {
  "AllowBareDDL": typeof AllowBareDDL;
  "ConnectionTransport": typeof ConnectionTransport;
  "memory": typeof memory;
  "ConfigObject": typeof ConfigObject;
  "AbstractConfig": typeof AbstractConfig;
  "Auth": typeof Auth;
  "AuthMethod": typeof AuthMethod;
  "Config": typeof Config;
  "DatabaseConfig": typeof DatabaseConfig;
  "InstanceConfig": typeof InstanceConfig;
  "JWT": typeof JWT;
  "SCRAM": typeof SCRAM;
  "Trust": typeof Trust;
  "get_config_json": typeof get_config_json
};
const __defaultExports: __defaultExports = {
  "AllowBareDDL": AllowBareDDL,
  "ConnectionTransport": ConnectionTransport,
  "memory": memory,
  "ConfigObject": ConfigObject,
  "AbstractConfig": AbstractConfig,
  "Auth": Auth,
  "AuthMethod": AuthMethod,
  "Config": Config,
  "DatabaseConfig": DatabaseConfig,
  "InstanceConfig": InstanceConfig,
  "JWT": JWT,
  "SCRAM": SCRAM,
  "Trust": Trust,
  "get_config_json": get_config_json
};
export default __defaultExports;