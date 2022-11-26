import { $ } from "edgedb";
import * as _ from "../imports";
import type * as _std from "./std";
import type * as _learning from "./learning";
export type $UserλShape = $.typeutil.flatten<_std.$Object_8859a36f6c6511edbac839b92730dce8λShape & {
  "auth": $.LinkDesc<$UserAuth, $.Cardinality.One, {}, false, false,  false, false>;
  "profile": $.LinkDesc<$UserProfile, $.Cardinality.One, {}, false, false,  false, false>;
  "<authored_by[is learning::Question]": $.LinkDesc<_learning.$Question, $.Cardinality.Many, {}, false, false,  false, false>;
  "<authored_by": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $User = $.ObjectType<"users::User", $UserλShape, null>;
const $User = $.makeType<$User>(_.spec, "e0f40a8f-6cd0-11ed-9c8c-a5c75bc8df84", _.syntax.literal);

const User: $.$expr_PathNode<$.TypeSet<$User, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($User, $.Cardinality.Many), null, true);

export type $StudentλShape = $.typeutil.flatten<$UserλShape & {
  "classes": $.LinkDesc<_learning.$Class, $.Cardinality.Many, {}, false, true,  false, false>;
  "<students[is learning::Class]": $.LinkDesc<_learning.$Class, $.Cardinality.Many, {}, false, false,  false, false>;
  "<students": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Student = $.ObjectType<"users::Student", $StudentλShape, null>;
const $Student = $.makeType<$Student>(_.spec, "e0f5d0f7-6cd0-11ed-9b07-456050b21113", _.syntax.literal);

const Student: $.$expr_PathNode<$.TypeSet<$Student, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Student, $.Cardinality.Many), null, true);

export type $TeacherλShape = $.typeutil.flatten<$UserλShape & {
  "classes": $.LinkDesc<_learning.$Class, $.Cardinality.Many, {}, false, true,  false, false>;
  "<teachers[is learning::Class]": $.LinkDesc<_learning.$Class, $.Cardinality.Many, {}, false, false,  false, false>;
  "<teachers": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Teacher = $.ObjectType<"users::Teacher", $TeacherλShape, null>;
const $Teacher = $.makeType<$Teacher>(_.spec, "e0f99076-6cd0-11ed-98f1-fd927848e115", _.syntax.literal);

const Teacher: $.$expr_PathNode<$.TypeSet<$Teacher, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Teacher, $.Cardinality.Many), null, true);

export type $UserAuthλShape = $.typeutil.flatten<_std.$Object_8859a36f6c6511edbac839b92730dce8λShape & {
  "password_hash": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "<auth[is users::User]": $.LinkDesc<$User, $.Cardinality.Many, {}, false, false,  false, false>;
  "<auth[is users::Student]": $.LinkDesc<$Student, $.Cardinality.Many, {}, false, false,  false, false>;
  "<auth[is users::Teacher]": $.LinkDesc<$Teacher, $.Cardinality.Many, {}, false, false,  false, false>;
  "<auth": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $UserAuth = $.ObjectType<"users::UserAuth", $UserAuthλShape, null>;
const $UserAuth = $.makeType<$UserAuth>(_.spec, "e0f049c9-6cd0-11ed-9d81-3fc1f19e91db", _.syntax.literal);

const UserAuth: $.$expr_PathNode<$.TypeSet<$UserAuth, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($UserAuth, $.Cardinality.Many), null, true);

export type $UserProfileλShape = $.typeutil.flatten<_std.$Object_8859a36f6c6511edbac839b92730dce8λShape & {
  "email": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, false, false>;
  "username": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, false, false>;
  "<profile[is users::User]": $.LinkDesc<$User, $.Cardinality.Many, {}, false, false,  false, false>;
  "<profile[is users::Student]": $.LinkDesc<$Student, $.Cardinality.Many, {}, false, false,  false, false>;
  "<profile[is users::Teacher]": $.LinkDesc<$Teacher, $.Cardinality.Many, {}, false, false,  false, false>;
  "<profile": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $UserProfile = $.ObjectType<"users::UserProfile", $UserProfileλShape, null>;
const $UserProfile = $.makeType<$UserProfile>(_.spec, "e0f19e23-6cd0-11ed-9cc1-018f0933e104", _.syntax.literal);

const UserProfile: $.$expr_PathNode<$.TypeSet<$UserProfile, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($UserProfile, $.Cardinality.Many), null, true);



export { $User, User, $Student, Student, $Teacher, Teacher, $UserAuth, UserAuth, $UserProfile, UserProfile };

type __defaultExports = {
  "User": typeof User;
  "Student": typeof Student;
  "Teacher": typeof Teacher;
  "UserAuth": typeof UserAuth;
  "UserProfile": typeof UserProfile
};
const __defaultExports: __defaultExports = {
  "User": User,
  "Student": Student,
  "Teacher": Teacher,
  "UserAuth": UserAuth,
  "UserProfile": UserProfile
};
export default __defaultExports;
