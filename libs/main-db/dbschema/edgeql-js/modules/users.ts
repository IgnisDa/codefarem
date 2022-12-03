import { $ } from "edgedb";
import * as _ from "../imports";
import type * as _std from "./std";
import type * as _learning from "./learning";
export type $UserλShape = $.typeutil.flatten<_std.$Object_99e11e7f678f11ed8ccbaf6fbc0493e7λShape & {
  "auth": $.LinkDesc<$UserAuth, $.Cardinality.One, {}, false, false,  false, false>;
  "profile": $.LinkDesc<$UserProfile, $.Cardinality.One, {}, false, false,  false, false>;
  "<authored_by[is learning::Question]": $.LinkDesc<_learning.$Question, $.Cardinality.Many, {}, false, false,  false, false>;
  "<authored_by": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $User = $.ObjectType<"users::User", $UserλShape, null>;
const $User = $.makeType<$User>(_.spec, "a8542bd9-72d3-11ed-ad8a-6ff449e62efb", _.syntax.literal);

const User: $.$expr_PathNode<$.TypeSet<$User, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($User, $.Cardinality.Many), null, true);

export type $StudentλShape = $.typeutil.flatten<$UserλShape & {
  "classes": $.LinkDesc<_learning.$Class, $.Cardinality.Many, {}, false, true,  false, false>;
  "<students[is learning::Class]": $.LinkDesc<_learning.$Class, $.Cardinality.Many, {}, false, false,  false, false>;
  "<students": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Student = $.ObjectType<"users::Student", $StudentλShape, null>;
const $Student = $.makeType<$Student>(_.spec, "a8570ad1-72d3-11ed-9167-2d2cece4c4be", _.syntax.literal);

const Student: $.$expr_PathNode<$.TypeSet<$Student, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Student, $.Cardinality.Many), null, true);

export type $TeacherλShape = $.typeutil.flatten<$UserλShape & {
  "classes": $.LinkDesc<_learning.$Class, $.Cardinality.Many, {}, false, true,  false, false>;
  "<teachers[is learning::Class]": $.LinkDesc<_learning.$Class, $.Cardinality.Many, {}, false, false,  false, false>;
  "<teachers": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Teacher = $.ObjectType<"users::Teacher", $TeacherλShape, null>;
const $Teacher = $.makeType<$Teacher>(_.spec, "a85b276e-72d3-11ed-9840-6351f8d4e260", _.syntax.literal);

const Teacher: $.$expr_PathNode<$.TypeSet<$Teacher, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Teacher, $.Cardinality.Many), null, true);

export type $UserAuthλShape = $.typeutil.flatten<_std.$Object_99e11e7f678f11ed8ccbaf6fbc0493e7λShape & {
  "hanko_id": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, false, false>;
  "<auth[is users::User]": $.LinkDesc<$User, $.Cardinality.Many, {}, false, false,  false, false>;
  "<auth[is users::Student]": $.LinkDesc<$Student, $.Cardinality.Many, {}, false, false,  false, false>;
  "<auth[is users::Teacher]": $.LinkDesc<$Teacher, $.Cardinality.Many, {}, false, false,  false, false>;
  "<auth": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $UserAuth = $.ObjectType<"users::UserAuth", $UserAuthλShape, null>;
const $UserAuth = $.makeType<$UserAuth>(_.spec, "a8508a86-72d3-11ed-a9db-215a1edf7a27", _.syntax.literal);

const UserAuth: $.$expr_PathNode<$.TypeSet<$UserAuth, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($UserAuth, $.Cardinality.Many), null, true);

export type $UserProfileλShape = $.typeutil.flatten<_std.$Object_99e11e7f678f11ed8ccbaf6fbc0493e7λShape & {
  "email": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, false, false>;
  "username": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, false, false>;
  "<profile[is users::User]": $.LinkDesc<$User, $.Cardinality.Many, {}, false, false,  false, false>;
  "<profile[is users::Student]": $.LinkDesc<$Student, $.Cardinality.Many, {}, false, false,  false, false>;
  "<profile[is users::Teacher]": $.LinkDesc<$Teacher, $.Cardinality.Many, {}, false, false,  false, false>;
  "<profile": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $UserProfile = $.ObjectType<"users::UserProfile", $UserProfileλShape, null>;
const $UserProfile = $.makeType<$UserProfile>(_.spec, "a851d34b-72d3-11ed-8173-dd45688bab10", _.syntax.literal);

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
