import { $ } from "edgedb";
import * as _ from "../imports";
import type * as _std from "./std";
import type * as _learning from "./learning";
import type * as _organizations from "./organizations";
export type $UserλShape = $.typeutil.flatten<_std.$Object_99e11e7f678f11ed8ccbaf6fbc0493e7λShape & {
  "auth": $.LinkDesc<$UserAuth, $.Cardinality.One, {}, false, false,  false, false>;
  "profile": $.LinkDesc<$UserProfile, $.Cardinality.One, {}, false, false,  false, false>;
  "<authored_by[is learning::Question]": $.LinkDesc<_learning.$Question, $.Cardinality.Many, {}, false, false,  false, false>;
  "<authored_by": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $User = $.ObjectType<"users::User", $UserλShape, null>;
const $User = $.makeType<$User>(_.spec, "3b97963b-73ad-11ed-bd27-b18454c43f92", _.syntax.literal);

const User: $.$expr_PathNode<$.TypeSet<$User, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($User, $.Cardinality.Many), null, true);

export type $StudentλShape = $.typeutil.flatten<$UserλShape & {
  "classes": $.LinkDesc<_learning.$Class, $.Cardinality.Many, {}, false, true,  false, false>;
  "<students[is learning::Class]": $.LinkDesc<_learning.$Class, $.Cardinality.Many, {}, false, false,  false, false>;
  "<students": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Student = $.ObjectType<"users::Student", $StudentλShape, null>;
const $Student = $.makeType<$Student>(_.spec, "3b997bd5-73ad-11ed-ba8d-83d1b86bbbd1", _.syntax.literal);

const Student: $.$expr_PathNode<$.TypeSet<$Student, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Student, $.Cardinality.Many), null, true);

export type $TeacherλShape = $.typeutil.flatten<$UserλShape & {
  "classes": $.LinkDesc<_learning.$Class, $.Cardinality.Many, {}, false, true,  false, false>;
  "<members[is organizations::Organization]": $.LinkDesc<_organizations.$Organization, $.Cardinality.Many, {}, false, false,  false, false>;
  "<teachers[is learning::Class]": $.LinkDesc<_learning.$Class, $.Cardinality.Many, {}, false, false,  false, false>;
  "<members": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<teachers": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Teacher = $.ObjectType<"users::Teacher", $TeacherλShape, null>;
const $Teacher = $.makeType<$Teacher>(_.spec, "3b9d3405-73ad-11ed-976a-697c5cbbef37", _.syntax.literal);

const Teacher: $.$expr_PathNode<$.TypeSet<$Teacher, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Teacher, $.Cardinality.Many), null, true);

export type $UserAuthλShape = $.typeutil.flatten<_std.$Object_99e11e7f678f11ed8ccbaf6fbc0493e7λShape & {
  "hanko_id": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, false, false>;
  "<auth[is users::User]": $.LinkDesc<$User, $.Cardinality.Many, {}, false, false,  false, false>;
  "<auth[is users::Student]": $.LinkDesc<$Student, $.Cardinality.Many, {}, false, false,  false, false>;
  "<auth[is users::Teacher]": $.LinkDesc<$Teacher, $.Cardinality.Many, {}, false, false,  false, false>;
  "<auth": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $UserAuth = $.ObjectType<"users::UserAuth", $UserAuthλShape, null>;
const $UserAuth = $.makeType<$UserAuth>(_.spec, "3b93e3cb-73ad-11ed-93af-6f01e3d014a4", _.syntax.literal);

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
const $UserProfile = $.makeType<$UserProfile>(_.spec, "3b952986-73ad-11ed-82f3-99fbf6ef0b2d", _.syntax.literal);

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
