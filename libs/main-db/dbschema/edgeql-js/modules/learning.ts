import { $ } from "edgedb";
import * as _ from "../imports";
import type * as _std from "./std";
import type * as _users from "./users";
export type $CaseUnitλShape = $.typeutil.flatten<_std.$Object_8859a36f6c6511edbac839b92730dce8λShape & {
  "<data[is learning::CommonCaseUnit]": $.LinkDesc<$CommonCaseUnit, $.Cardinality.Many, {}, false, false,  false, false>;
  "<data[is learning::OutputCaseUnit]": $.LinkDesc<$OutputCaseUnit, $.Cardinality.Many, {}, false, false,  false, false>;
  "<data[is learning::InputCaseUnit]": $.LinkDesc<$InputCaseUnit, $.Cardinality.Many, {}, false, false,  false, false>;
  "<data": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $CaseUnit = $.ObjectType<"learning::CaseUnit", $CaseUnitλShape, null>;
const $CaseUnit = $.makeType<$CaseUnit>(_.spec, "e0d755cf-6cd0-11ed-81e2-452ca2a640e2", _.syntax.literal);

const CaseUnit: $.$expr_PathNode<$.TypeSet<$CaseUnit, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($CaseUnit, $.Cardinality.Many), null, true);

export type $ClassλShape = $.typeutil.flatten<_std.$Object_8859a36f6c6511edbac839b92730dce8λShape & {
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "students": $.LinkDesc<_users.$Student, $.Cardinality.Many, {}, false, false,  false, false>;
  "teachers": $.LinkDesc<_users.$Teacher, $.Cardinality.Many, {}, false, false,  false, false>;
  "<classes[is learning::Question]": $.LinkDesc<$Question, $.Cardinality.Many, {}, false, false,  false, false>;
  "<classes[is users::Student]": $.LinkDesc<_users.$Student, $.Cardinality.Many, {}, false, false,  false, false>;
  "<classes[is users::Teacher]": $.LinkDesc<_users.$Teacher, $.Cardinality.Many, {}, false, false,  false, false>;
  "<classes": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Class = $.ObjectType<"learning::Class", $ClassλShape, null>;
const $Class = $.makeType<$Class>(_.spec, "e0ef071f-6cd0-11ed-8e07-23f1ad3ae0e3", _.syntax.literal);

const Class: $.$expr_PathNode<$.TypeSet<$Class, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Class, $.Cardinality.Many), null, true);

export type $CommonCaseUnitλShape = $.typeutil.flatten<_std.$Object_8859a36f6c6511edbac839b92730dce8λShape & {
  "seq": $.PropertyDesc<_std.$int32, $.Cardinality.One, false, false, false, false>;
  "data": $.LinkDesc<$CaseUnit, $.Cardinality.One, {}, false, false,  false, false>;
}>;
type $CommonCaseUnit = $.ObjectType<"learning::CommonCaseUnit", $CommonCaseUnitλShape, null>;
const $CommonCaseUnit = $.makeType<$CommonCaseUnit>(_.spec, "e0df4fee-6cd0-11ed-ba4d-c7b7ac29acad", _.syntax.literal);

const CommonCaseUnit: $.$expr_PathNode<$.TypeSet<$CommonCaseUnit, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($CommonCaseUnit, $.Cardinality.Many), null, true);

export type $InputCaseUnitλShape = $.typeutil.flatten<$CommonCaseUnitλShape & {
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "<inputs[is learning::TestCase]": $.LinkDesc<$TestCase, $.Cardinality.Many, {}, false, false,  false, false>;
  "<inputs": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $InputCaseUnit = $.ObjectType<"learning::InputCaseUnit", $InputCaseUnitλShape, null>;
const $InputCaseUnit = $.makeType<$InputCaseUnit>(_.spec, "e0e2a5d1-6cd0-11ed-a785-0daf469806b7", _.syntax.literal);

const InputCaseUnit: $.$expr_PathNode<$.TypeSet<$InputCaseUnit, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($InputCaseUnit, $.Cardinality.Many), null, true);

export type $NumberCollectionUnitλShape = $.typeutil.flatten<$CaseUnitλShape & {
  "number_collection_value": $.PropertyDesc<$.ArrayType<_std.$float64>, $.Cardinality.One, false, false, false, false>;
}>;
type $NumberCollectionUnit = $.ObjectType<"learning::NumberCollectionUnit", $NumberCollectionUnitλShape, null>;
const $NumberCollectionUnit = $.makeType<$NumberCollectionUnit>(_.spec, "e0d8bf6e-6cd0-11ed-93d4-37be02a52411", _.syntax.literal);

const NumberCollectionUnit: $.$expr_PathNode<$.TypeSet<$NumberCollectionUnit, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($NumberCollectionUnit, $.Cardinality.Many), null, true);

export type $NumberUnitλShape = $.typeutil.flatten<$CaseUnitλShape & {
  "number_value": $.PropertyDesc<_std.$float64, $.Cardinality.One, false, false, false, false>;
}>;
type $NumberUnit = $.ObjectType<"learning::NumberUnit", $NumberUnitλShape, null>;
const $NumberUnit = $.makeType<$NumberUnit>(_.spec, "e0db5942-6cd0-11ed-bfc2-9f08a7d52eee", _.syntax.literal);

const NumberUnit: $.$expr_PathNode<$.TypeSet<$NumberUnit, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($NumberUnit, $.Cardinality.Many), null, true);

export type $OutputCaseUnitλShape = $.typeutil.flatten<$CommonCaseUnitλShape & {
  "<outputs[is learning::TestCase]": $.LinkDesc<$TestCase, $.Cardinality.Many, {}, false, false,  false, false>;
  "<outputs": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $OutputCaseUnit = $.ObjectType<"learning::OutputCaseUnit", $OutputCaseUnitλShape, null>;
const $OutputCaseUnit = $.makeType<$OutputCaseUnit>(_.spec, "e0e0e36f-6cd0-11ed-a3ab-bfa4835d6ed5", _.syntax.literal);

const OutputCaseUnit: $.$expr_PathNode<$.TypeSet<$OutputCaseUnit, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($OutputCaseUnit, $.Cardinality.Many), null, true);

export type $QuestionλShape = $.typeutil.flatten<_std.$Object_8859a36f6c6511edbac839b92730dce8λShape & {
  "created_at": $.PropertyDesc<_std.$datetime, $.Cardinality.One, false, false, false, true>;
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "problem": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "slug": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, false, false>;
  "classes": $.LinkDesc<$Class, $.Cardinality.Many, {}, false, false,  false, false>;
  "authored_by": $.LinkDesc<_users.$User, $.Cardinality.Many, {}, false, false,  false, false>;
  "test_cases": $.LinkDesc<$TestCase, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Question = $.ObjectType<"learning::Question", $QuestionλShape, null>;
const $Question = $.makeType<$Question>(_.spec, "e0ff196b-6cd0-11ed-ace9-a355cfd3bf3d", _.syntax.literal);

const Question: $.$expr_PathNode<$.TypeSet<$Question, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Question, $.Cardinality.Many), null, true);

export type $StringCollectionUnitλShape = $.typeutil.flatten<$CaseUnitλShape & {
  "string_collection_value": $.PropertyDesc<$.ArrayType<_std.$str>, $.Cardinality.One, false, false, false, false>;
}>;
type $StringCollectionUnit = $.ObjectType<"learning::StringCollectionUnit", $StringCollectionUnitλShape, null>;
const $StringCollectionUnit = $.makeType<$StringCollectionUnit>(_.spec, "e0dc9f9b-6cd0-11ed-bc6e-f53999b2fc9b", _.syntax.literal);

const StringCollectionUnit: $.$expr_PathNode<$.TypeSet<$StringCollectionUnit, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($StringCollectionUnit, $.Cardinality.Many), null, true);

export type $StringUnitλShape = $.typeutil.flatten<$CaseUnitλShape & {
  "string_value": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
}>;
type $StringUnit = $.ObjectType<"learning::StringUnit", $StringUnitλShape, null>;
const $StringUnit = $.makeType<$StringUnit>(_.spec, "e0de03da-6cd0-11ed-92ee-f17697c32736", _.syntax.literal);

const StringUnit: $.$expr_PathNode<$.TypeSet<$StringUnit, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($StringUnit, $.Cardinality.Many), null, true);

export type $TestCaseλShape = $.typeutil.flatten<_std.$Object_8859a36f6c6511edbac839b92730dce8λShape & {
  "inputs": $.LinkDesc<$InputCaseUnit, $.Cardinality.Many, {}, false, false,  false, false>;
  "outputs": $.LinkDesc<$OutputCaseUnit, $.Cardinality.Many, {}, false, false,  false, false>;
  "<test_cases[is learning::Question]": $.LinkDesc<$Question, $.Cardinality.Many, {}, false, false,  false, false>;
  "<test_cases": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $TestCase = $.ObjectType<"learning::TestCase", $TestCaseλShape, null>;
const $TestCase = $.makeType<$TestCase>(_.spec, "e0fd5789-6cd0-11ed-9eae-45003ae78878", _.syntax.literal);

const TestCase: $.$expr_PathNode<$.TypeSet<$TestCase, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($TestCase, $.Cardinality.Many), null, true);



export { $CaseUnit, CaseUnit, $Class, Class, $CommonCaseUnit, CommonCaseUnit, $InputCaseUnit, InputCaseUnit, $NumberCollectionUnit, NumberCollectionUnit, $NumberUnit, NumberUnit, $OutputCaseUnit, OutputCaseUnit, $Question, Question, $StringCollectionUnit, StringCollectionUnit, $StringUnit, StringUnit, $TestCase, TestCase };

type __defaultExports = {
  "CaseUnit": typeof CaseUnit;
  "Class": typeof Class;
  "CommonCaseUnit": typeof CommonCaseUnit;
  "InputCaseUnit": typeof InputCaseUnit;
  "NumberCollectionUnit": typeof NumberCollectionUnit;
  "NumberUnit": typeof NumberUnit;
  "OutputCaseUnit": typeof OutputCaseUnit;
  "Question": typeof Question;
  "StringCollectionUnit": typeof StringCollectionUnit;
  "StringUnit": typeof StringUnit;
  "TestCase": typeof TestCase
};
const __defaultExports: __defaultExports = {
  "CaseUnit": CaseUnit,
  "Class": Class,
  "CommonCaseUnit": CommonCaseUnit,
  "InputCaseUnit": InputCaseUnit,
  "NumberCollectionUnit": NumberCollectionUnit,
  "NumberUnit": NumberUnit,
  "OutputCaseUnit": OutputCaseUnit,
  "Question": Question,
  "StringCollectionUnit": StringCollectionUnit,
  "StringUnit": StringUnit,
  "TestCase": TestCase
};
export default __defaultExports;
