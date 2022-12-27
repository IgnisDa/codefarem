import { $ } from "edgedb";
import * as _ from "../imports";
import type * as _std from "./std";
import type * as _learning from "./learning";
export type $AccountType = {
  Student: $.$expr_Literal<$AccountType>;
  Teacher: $.$expr_Literal<$AccountType>;
} & $.EnumType<"users::AccountType", ["Student", "Teacher"]>;
const AccountType: $AccountType = $.makeType<$AccountType>(_.spec, "71e7fc5a-85a2-11ed-9218-5515f9375584", _.syntax.literal);

export type $UserλShape = $.typeutil.flatten<_std.$Object_008214927ccf11eda8a2756e5970bb5fλShape & {
  "auth": $.LinkDesc<$UserAuth, $.Cardinality.One, {}, false, false,  false, false>;
  "profile": $.LinkDesc<$UserProfile, $.Cardinality.One, {}, false, false,  false, false>;
}>;
type $User = $.ObjectType<"users::User", $UserλShape, null>;
const $User = $.makeType<$User>(_.spec, "7207d155-85a2-11ed-87d3-078e1ca84ed9", _.syntax.literal);

const User: $.$expr_PathNode<$.TypeSet<$User, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($User, $.Cardinality.Many), null, true);

export type $StudentλShape = $.typeutil.flatten<$UserλShape & {
  "classes": $.LinkDesc<_learning.$Class, $.Cardinality.Many, {}, false, true,  false, false>;
  "<students[is learning::Class]": $.LinkDesc<_learning.$Class, $.Cardinality.Many, {}, false, false,  false, false>;
  "<students": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Student = $.ObjectType<"users::Student", $StudentλShape, null>;
const $Student = $.makeType<$Student>(_.spec, "7209a650-85a2-11ed-91b1-376d87844e6e", _.syntax.literal);

const Student: $.$expr_PathNode<$.TypeSet<$Student, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Student, $.Cardinality.Many), null, true);

export type $TeacherλShape = $.typeutil.flatten<$UserλShape & {
  "classes": $.LinkDesc<_learning.$Class, $.Cardinality.Many, {}, false, true,  false, false>;
  "<teachers[is learning::Class]": $.LinkDesc<_learning.$Class, $.Cardinality.Many, {}, false, false,  false, false>;
  "<teachers": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Teacher = $.ObjectType<"users::Teacher", $TeacherλShape, null>;
const $Teacher = $.makeType<$Teacher>(_.spec, "720db3eb-85a2-11ed-b0b0-d3e3dc55bc13", _.syntax.literal);

const Teacher: $.$expr_PathNode<$.TypeSet<$Teacher, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Teacher, $.Cardinality.Many), null, true);

export type $UserAuthλShape = $.typeutil.flatten<_std.$Object_008214927ccf11eda8a2756e5970bb5fλShape & {
  "hanko_id": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, false, false>;
  "<auth[is users::User]": $.LinkDesc<$User, $.Cardinality.Many, {}, false, false,  false, false>;
  "<auth[is users::Student]": $.LinkDesc<$Student, $.Cardinality.Many, {}, false, false,  false, false>;
  "<auth[is users::Teacher]": $.LinkDesc<$Teacher, $.Cardinality.Many, {}, false, false,  false, false>;
  "<auth": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $UserAuth = $.ObjectType<"users::UserAuth", $UserAuthλShape, null>;
const $UserAuth = $.makeType<$UserAuth>(_.spec, "72037258-85a2-11ed-a416-f5d6c6a434e4", _.syntax.literal);

const UserAuth: $.$expr_PathNode<$.TypeSet<$UserAuth, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($UserAuth, $.Cardinality.Many), null, true);

export type $UserProfileλShape = $.typeutil.flatten<_std.$Object_008214927ccf11eda8a2756e5970bb5fλShape & {
  "email": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, false, false>;
  "username": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, false, false>;
  "<profile[is users::User]": $.LinkDesc<$User, $.Cardinality.Many, {}, false, false,  false, false>;
  "<profile[is users::Student]": $.LinkDesc<$Student, $.Cardinality.Many, {}, false, false,  false, false>;
  "<profile[is users::Teacher]": $.LinkDesc<$Teacher, $.Cardinality.Many, {}, false, false,  false, false>;
  "<profile": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $UserProfile = $.ObjectType<"users::UserProfile", $UserProfileλShape, null>;
const $UserProfile = $.makeType<$UserProfile>(_.spec, "72054a08-85a2-11ed-a665-732bc73ccca5", _.syntax.literal);

const UserProfile: $.$expr_PathNode<$.TypeSet<$UserProfile, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($UserProfile, $.Cardinality.Many), null, true);



export { AccountType, $User, User, $Student, Student, $Teacher, Teacher, $UserAuth, UserAuth, $UserProfile, UserProfile };

type __defaultExports = {
  "AccountType": typeof AccountType;
  "User": typeof User;
  "Student": typeof Student;
  "Teacher": typeof Teacher;
  "UserAuth": typeof UserAuth;
  "UserProfile": typeof UserProfile
};
const __defaultExports: __defaultExports = {
  "AccountType": AccountType,
  "User": User,
  "Student": Student,
  "Teacher": Teacher,
  "UserAuth": UserAuth,
  "UserProfile": UserProfile
};
export default __defaultExports;
