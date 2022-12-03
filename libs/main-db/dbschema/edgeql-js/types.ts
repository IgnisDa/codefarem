import type * as edgedb from "edgedb";
export namespace std {
  export interface BaseObject {
    "id": string;
    "__type__": schema.ObjectType;
  }
  export interface $Object extends BaseObject {}
  export interface FreeObject extends BaseObject {}
  export enum JsonEmpty {
    ReturnEmpty = "ReturnEmpty",
    ReturnTarget = "ReturnTarget",
    Error = "Error",
    UseNull = "UseNull",
    DeleteKey = "DeleteKey",
  }
}
export namespace schema {
  export enum AccessKind {
    Select = "Select",
    UpdateRead = "UpdateRead",
    UpdateWrite = "UpdateWrite",
    Delete = "Delete",
    Insert = "Insert",
  }
  export interface $Object extends std.BaseObject {
    "name": string;
    "internal": boolean;
    "builtin": boolean;
    "computed_fields"?: string[] | null;
  }
  export interface SubclassableObject extends $Object {
    "abstract"?: boolean | null;
    "is_abstract"?: boolean | null;
    "final": boolean;
    "is_final": boolean;
  }
  export interface InheritingObject extends SubclassableObject {
    "inherited_fields"?: string[] | null;
    "bases": InheritingObject[];
    "ancestors": InheritingObject[];
  }
  export interface AnnotationSubject extends $Object {
    "annotations": Annotation[];
  }
  export interface AccessPolicy extends InheritingObject, AnnotationSubject {
    "access_kinds": AccessKind[];
    "condition"?: string | null;
    "action": AccessPolicyAction;
    "expr"?: string | null;
    "subject": ObjectType;
  }
  export enum AccessPolicyAction {
    Allow = "Allow",
    Deny = "Deny",
  }
  export interface Alias extends AnnotationSubject {
    "expr": string;
    "type": Type;
  }
  export interface Annotation extends InheritingObject, AnnotationSubject {
    "inheritable"?: boolean | null;
  }
  export interface Type extends SubclassableObject, AnnotationSubject {
    "expr"?: string | null;
    "from_alias"?: boolean | null;
    "is_from_alias"?: boolean | null;
  }
  export interface PrimitiveType extends Type {}
  export interface CollectionType extends PrimitiveType {}
  export interface Array extends CollectionType {
    "dimensions"?: number[] | null;
    "element_type": Type;
  }
  export interface CallableObject extends AnnotationSubject {
    "return_typemod"?: TypeModifier | null;
    "params": Parameter[];
    "return_type"?: Type | null;
  }
  export enum Cardinality {
    One = "One",
    Many = "Many",
  }
  export interface VolatilitySubject extends $Object {
    "volatility"?: Volatility | null;
  }
  export interface Cast extends AnnotationSubject, VolatilitySubject {
    "allow_implicit"?: boolean | null;
    "allow_assignment"?: boolean | null;
    "from_type"?: Type | null;
    "to_type"?: Type | null;
  }
  export interface ConsistencySubject extends $Object, InheritingObject, AnnotationSubject {
    "constraints": Constraint[];
  }
  export interface Constraint extends CallableObject, InheritingObject {
    "expr"?: string | null;
    "subjectexpr"?: string | null;
    "finalexpr"?: string | null;
    "errmessage"?: string | null;
    "delegated"?: boolean | null;
    "except_expr"?: string | null;
    "subject"?: ConsistencySubject | null;
    "params": Parameter[];
  }
  export interface Delta extends $Object {
    "parents": Delta[];
  }
  export interface Extension extends AnnotationSubject, $Object {
    "package": sys.ExtensionPackage;
  }
  export interface Function extends CallableObject, VolatilitySubject {
    "body"?: string | null;
    "language": string;
    "preserves_optionality"?: boolean | null;
    "used_globals": Global[];
  }
  export interface FutureBehavior extends $Object {}
  export interface Global extends AnnotationSubject {
    "required"?: boolean | null;
    "cardinality"?: Cardinality | null;
    "expr"?: string | null;
    "default"?: string | null;
    "target": Type;
  }
  export interface Index extends InheritingObject, AnnotationSubject {
    "expr"?: string | null;
    "except_expr"?: string | null;
  }
  export interface Pointer extends InheritingObject, ConsistencySubject, AnnotationSubject {
    "cardinality"?: Cardinality | null;
    "required"?: boolean | null;
    "readonly"?: boolean | null;
    "default"?: string | null;
    "expr"?: string | null;
    "source"?: Source | null;
    "target"?: Type | null;
  }
  export interface Source extends $Object {
    "pointers": Pointer[];
    "indexes": Index[];
  }
  export interface Link extends Pointer, Source {
    "on_target_delete"?: TargetDeleteAction | null;
    "on_source_delete"?: SourceDeleteAction | null;
    "target"?: ObjectType | null;
    "properties": Property[];
  }
  export interface Migration extends AnnotationSubject, $Object {
    "script": string;
    "message"?: string | null;
    "parents": Migration[];
  }
  export interface Module extends $Object, AnnotationSubject {}
  export interface ObjectType extends InheritingObject, ConsistencySubject, AnnotationSubject, Type, Source {
    "compound_type": boolean;
    "is_compound_type": boolean;
    "union_of": ObjectType[];
    "intersection_of": ObjectType[];
    "properties": Property[];
    "links": Link[];
    "access_policies": AccessPolicy[];
  }
  export interface Operator extends CallableObject, VolatilitySubject {
    "operator_kind"?: OperatorKind | null;
    "is_abstract"?: boolean | null;
    "abstract"?: boolean | null;
  }
  export enum OperatorKind {
    Infix = "Infix",
    Postfix = "Postfix",
    Prefix = "Prefix",
    Ternary = "Ternary",
  }
  export interface Parameter extends $Object {
    "typemod": TypeModifier;
    "kind": ParameterKind;
    "num": number;
    "default"?: string | null;
    "type": Type;
  }
  export enum ParameterKind {
    VariadicParam = "VariadicParam",
    NamedOnlyParam = "NamedOnlyParam",
    PositionalParam = "PositionalParam",
  }
  export interface Property extends Pointer {}
  export interface PseudoType extends InheritingObject, Type {}
  export interface Range extends CollectionType {
    "element_type": Type;
  }
  export interface ScalarType extends InheritingObject, ConsistencySubject, AnnotationSubject, PrimitiveType {
    "default"?: string | null;
    "enum_values"?: string[] | null;
  }
  export enum SourceDeleteAction {
    DeleteTarget = "DeleteTarget",
    Allow = "Allow",
    DeleteTargetIfOrphan = "DeleteTargetIfOrphan",
  }
  export enum TargetDeleteAction {
    Restrict = "Restrict",
    DeleteSource = "DeleteSource",
    Allow = "Allow",
    DeferredRestrict = "DeferredRestrict",
  }
  export interface Tuple extends CollectionType {
    "named": boolean;
    "element_types": TupleElement[];
  }
  export interface TupleElement extends std.BaseObject {
    "name"?: string | null;
    "type": Type;
  }
  export enum TypeModifier {
    SetOfType = "SetOfType",
    OptionalType = "OptionalType",
    SingletonType = "SingletonType",
  }
  export enum Volatility {
    Immutable = "Immutable",
    Stable = "Stable",
    Volatile = "Volatile",
  }
}
export namespace cfg {
  export interface ConfigObject extends std.BaseObject {}
  export interface AbstractConfig extends ConfigObject {
    "session_idle_timeout": edgedb.Duration;
    "session_idle_transaction_timeout": edgedb.Duration;
    "query_execution_timeout": edgedb.Duration;
    "listen_port": number;
    "listen_addresses": string[];
    "allow_dml_in_functions"?: boolean | null;
    "allow_bare_ddl"?: AllowBareDDL | null;
    "apply_access_policies"?: boolean | null;
    "allow_user_specified_id"?: boolean | null;
    "shared_buffers"?: edgedb.ConfigMemory | null;
    "query_work_mem"?: edgedb.ConfigMemory | null;
    "effective_cache_size"?: edgedb.ConfigMemory | null;
    "effective_io_concurrency"?: number | null;
    "default_statistics_target"?: number | null;
    "auth": Auth[];
  }
  export enum AllowBareDDL {
    AlwaysAllow = "AlwaysAllow",
    NeverAllow = "NeverAllow",
  }
  export interface Auth extends ConfigObject {
    "priority": number;
    "user": string[];
    "comment"?: string | null;
    "method"?: AuthMethod | null;
  }
  export interface AuthMethod extends ConfigObject {
    "transports": ConnectionTransport[];
  }
  export interface Config extends AbstractConfig {}
  export enum ConnectionTransport {
    TCP = "TCP",
    HTTP = "HTTP",
  }
  export interface DatabaseConfig extends AbstractConfig {}
  export interface InstanceConfig extends AbstractConfig {}
  export interface JWT extends AuthMethod {
    "transports": ConnectionTransport[];
  }
  export interface SCRAM extends AuthMethod {
    "transports": ConnectionTransport[];
  }
  export interface Trust extends AuthMethod {}
}
export namespace learning {
  export interface CaseUnit extends std.$Object {}
  export interface Class extends std.$Object {
    "name": string;
    "students": users.Student[];
    "teachers": users.Teacher[];
  }
  export interface CommonCaseUnit extends std.$Object {
    "seq": number;
    "data": CaseUnit;
  }
  export interface InputCaseUnit extends CommonCaseUnit {
    "name": string;
  }
  export interface NumberCollectionUnit extends CaseUnit {
    "number_collection_value": number[];
  }
  export interface NumberUnit extends CaseUnit {
    "number_value": number;
  }
  export interface OutputCaseUnit extends CommonCaseUnit {}
  export interface Question extends std.$Object {
    "created_at": Date;
    "name": string;
    "problem": string;
    "slug": string;
    "classes": Class[];
    "authored_by": users.User[];
    "test_cases": TestCase[];
  }
  export interface StringCollectionUnit extends CaseUnit {
    "string_collection_value": string[];
  }
  export interface StringUnit extends CaseUnit {
    "string_value": string;
  }
  export interface TestCase extends std.$Object {
    "inputs": InputCaseUnit[];
    "outputs": OutputCaseUnit[];
  }
}
export namespace users {
  export interface User extends std.$Object {
    "auth": UserAuth;
    "profile": UserProfile;
  }
  export interface Student extends User {
    "classes": learning.Class[];
  }
  export interface Teacher extends User {
    "classes": learning.Class[];
  }
  export interface UserAuth extends std.$Object {
    "hanko_id": string;
  }
  export interface UserProfile extends std.$Object {
    "email": string;
    "username": string;
  }
}
export namespace sys {
  export interface SystemObject extends schema.AnnotationSubject {}
  export interface Database extends SystemObject, schema.AnnotationSubject {
    "name": string;
  }
  export interface ExtensionPackage extends SystemObject, schema.AnnotationSubject {
    "script": string;
    "version": {major: number, minor: number, stage: VersionStage, stage_no: number, local: string[]};
  }
  export interface Role extends SystemObject, schema.InheritingObject, schema.AnnotationSubject {
    "superuser": boolean;
    "password"?: string | null;
    "name": string;
    "is_superuser": boolean;
    "member_of": Role[];
  }
  export enum TransactionIsolation {
    RepeatableRead = "RepeatableRead",
    Serializable = "Serializable",
  }
  export enum VersionStage {
    dev = "dev",
    alpha = "alpha",
    beta = "beta",
    rc = "rc",
    final = "final",
  }
}
export interface types {
  "std": {
    "BaseObject": std.BaseObject;
    "Object": std.$Object;
    "FreeObject": std.FreeObject;
    "JsonEmpty": std.JsonEmpty;
  };
  "schema": {
    "AccessKind": schema.AccessKind;
    "Object": schema.$Object;
    "SubclassableObject": schema.SubclassableObject;
    "InheritingObject": schema.InheritingObject;
    "AnnotationSubject": schema.AnnotationSubject;
    "AccessPolicy": schema.AccessPolicy;
    "AccessPolicyAction": schema.AccessPolicyAction;
    "Alias": schema.Alias;
    "Annotation": schema.Annotation;
    "Type": schema.Type;
    "PrimitiveType": schema.PrimitiveType;
    "CollectionType": schema.CollectionType;
    "Array": schema.Array;
    "CallableObject": schema.CallableObject;
    "Cardinality": schema.Cardinality;
    "VolatilitySubject": schema.VolatilitySubject;
    "Cast": schema.Cast;
    "ConsistencySubject": schema.ConsistencySubject;
    "Constraint": schema.Constraint;
    "Delta": schema.Delta;
    "Extension": schema.Extension;
    "Function": schema.Function;
    "FutureBehavior": schema.FutureBehavior;
    "Global": schema.Global;
    "Index": schema.Index;
    "Pointer": schema.Pointer;
    "Source": schema.Source;
    "Link": schema.Link;
    "Migration": schema.Migration;
    "Module": schema.Module;
    "ObjectType": schema.ObjectType;
    "Operator": schema.Operator;
    "OperatorKind": schema.OperatorKind;
    "Parameter": schema.Parameter;
    "ParameterKind": schema.ParameterKind;
    "Property": schema.Property;
    "PseudoType": schema.PseudoType;
    "Range": schema.Range;
    "ScalarType": schema.ScalarType;
    "SourceDeleteAction": schema.SourceDeleteAction;
    "TargetDeleteAction": schema.TargetDeleteAction;
    "Tuple": schema.Tuple;
    "TupleElement": schema.TupleElement;
    "TypeModifier": schema.TypeModifier;
    "Volatility": schema.Volatility;
  };
  "cfg": {
    "ConfigObject": cfg.ConfigObject;
    "AbstractConfig": cfg.AbstractConfig;
    "AllowBareDDL": cfg.AllowBareDDL;
    "Auth": cfg.Auth;
    "AuthMethod": cfg.AuthMethod;
    "Config": cfg.Config;
    "ConnectionTransport": cfg.ConnectionTransport;
    "DatabaseConfig": cfg.DatabaseConfig;
    "InstanceConfig": cfg.InstanceConfig;
    "JWT": cfg.JWT;
    "SCRAM": cfg.SCRAM;
    "Trust": cfg.Trust;
  };
  "learning": {
    "CaseUnit": learning.CaseUnit;
    "Class": learning.Class;
    "CommonCaseUnit": learning.CommonCaseUnit;
    "InputCaseUnit": learning.InputCaseUnit;
    "NumberCollectionUnit": learning.NumberCollectionUnit;
    "NumberUnit": learning.NumberUnit;
    "OutputCaseUnit": learning.OutputCaseUnit;
    "Question": learning.Question;
    "StringCollectionUnit": learning.StringCollectionUnit;
    "StringUnit": learning.StringUnit;
    "TestCase": learning.TestCase;
  };
  "users": {
    "User": users.User;
    "Student": users.Student;
    "Teacher": users.Teacher;
    "UserAuth": users.UserAuth;
    "UserProfile": users.UserProfile;
  };
  "sys": {
    "SystemObject": sys.SystemObject;
    "Database": sys.Database;
    "ExtensionPackage": sys.ExtensionPackage;
    "Role": sys.Role;
    "TransactionIsolation": sys.TransactionIsolation;
    "VersionStage": sys.VersionStage;
  };
}
