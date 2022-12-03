import { $ } from "edgedb";
import * as _ from "../imports";
import type * as _std from "./std";
import type * as _learning from "./learning";
export type $UserλShape = $.typeutil.flatten<_std.$Object_b0ae039572ae11eda74283b029582d28λShape & {
  "profile": $.LinkDesc<$UserProfile, $.Cardinality.One, {}, false, false,  false, false>;
  "<authored_by[is learning::Question]": $.LinkDesc<_learning.$Question, $.Cardinality.Many, {}, false, false,  false, false>;
  "<authored_by": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $User = $.ObjectType<"users::User", $UserλShape, null>;
const $User = $.makeType<$User>(_.spec, "794b3a1d-72c9-11ed-95de-2d9df3df5c53", _.syntax.literal);

const User: $.$expr_PathNode<$.TypeSet<$User, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($User, $.Cardinality.Many), null, true);

export type $StudentλShape = $.typeutil.flatten<$UserλShape & {
  "classes": $.LinkDesc<_learning.$Class, $.Cardinality.Many, {}, false, true,  false, false>;
  "<students[is learning::Class]": $.LinkDesc<_learning.$Class, $.Cardinality.Many, {}, false, false,  false, false>;
  "<students": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Student = $.ObjectType<"users::Student", $StudentλShape, null>;
const $Student = $.makeType<$Student>(_.spec, "794d1ffd-72c9-11ed-b50f-eb6e94a29884", _.syntax.literal);

const Student: $.$expr_PathNode<$.TypeSet<$Student, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Student, $.Cardinality.Many), null, true);

export type $TeacherλShape = $.typeutil.flatten<$UserλShape & {
  "classes": $.LinkDesc<_learning.$Class, $.Cardinality.Many, {}, false, true,  false, false>;
  "<teachers[is learning::Class]": $.LinkDesc<_learning.$Class, $.Cardinality.Many, {}, false, false,  false, false>;
  "<teachers": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Teacher = $.ObjectType<"users::Teacher", $TeacherλShape, null>;
const $Teacher = $.makeType<$Teacher>(_.spec, "7950f273-72c9-11ed-95f6-0b222604ce48", _.syntax.literal);

const Teacher: $.$expr_PathNode<$.TypeSet<$Teacher, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Teacher, $.Cardinality.Many), null, true);

export type $UserProfileλShape = $.typeutil.flatten<_std.$Object_b0ae039572ae11eda74283b029582d28λShape & {
  "email": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, false, false>;
  "username": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, false, false>;
  "<profile[is users::User]": $.LinkDesc<$User, $.Cardinality.Many, {}, false, false,  false, false>;
  "<profile[is users::Student]": $.LinkDesc<$Student, $.Cardinality.Many, {}, false, false,  false, false>;
  "<profile[is users::Teacher]": $.LinkDesc<$Teacher, $.Cardinality.Many, {}, false, false,  false, false>;
  "<profile": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $UserProfile = $.ObjectType<"users::UserProfile", $UserProfileλShape, null>;
const $UserProfile = $.makeType<$UserProfile>(_.spec, "793e2a41-72c9-11ed-b629-e1465827908c", _.syntax.literal);

const UserProfile: $.$expr_PathNode<$.TypeSet<$UserProfile, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($UserProfile, $.Cardinality.Many), null, true);



export { $User, User, $Student, Student, $Teacher, Teacher, $UserProfile, UserProfile };

type __defaultExports = {
  "User": typeof User;
  "Student": typeof Student;
  "Teacher": typeof Teacher;
  "UserProfile": typeof UserProfile
};
const __defaultExports: __defaultExports = {
  "User": User,
  "Student": Student,
  "Teacher": Teacher,
  "UserProfile": UserProfile
};
export default __defaultExports;
