import { $ } from "edgedb";
import * as _ from "../imports";
import type * as _std from "./std";
import type * as _users from "./users";
export type $CaseUnitλShape = $.typeutil.flatten<_std.$Object_99e11e7f678f11ed8ccbaf6fbc0493e7λShape & {
  "<data[is learning::CommonCaseUnit]": $.LinkDesc<$CommonCaseUnit, $.Cardinality.Many, {}, false, false,  false, false>;
  "<data[is learning::OutputCaseUnit]": $.LinkDesc<$OutputCaseUnit, $.Cardinality.Many, {}, false, false,  false, false>;
  "<data[is learning::InputCaseUnit]": $.LinkDesc<$InputCaseUnit, $.Cardinality.Many, {}, false, false,  false, false>;
  "<data": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $CaseUnit = $.ObjectType<"learning::CaseUnit", $CaseUnitλShape, null>;
const $CaseUnit = $.makeType<$CaseUnit>(_.spec, "a839a671-72d3-11ed-a499-2d339e005999", _.syntax.literal);

const CaseUnit: $.$expr_PathNode<$.TypeSet<$CaseUnit, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($CaseUnit, $.Cardinality.Many), null, true);

export type $ClassλShape = $.typeutil.flatten<_std.$Object_99e11e7f678f11ed8ccbaf6fbc0493e7λShape & {
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "students": $.LinkDesc<_users.$Student, $.Cardinality.Many, {}, false, false,  false, false>;
  "teachers": $.LinkDesc<_users.$Teacher, $.Cardinality.Many, {}, false, false,  false, false>;
  "<classes[is users::Student]": $.LinkDesc<_users.$Student, $.Cardinality.Many, {}, false, false,  false, false>;
  "<classes[is users::Teacher]": $.LinkDesc<_users.$Teacher, $.Cardinality.Many, {}, false, false,  false, false>;
  "<classes[is learning::Question]": $.LinkDesc<$Question, $.Cardinality.Many, {}, false, false,  false, false>;
  "<classes": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Class = $.ObjectType<"learning::Class", $ClassλShape, null>;
const $Class = $.makeType<$Class>(_.spec, "a84f286e-72d3-11ed-92c8-5f6a1aacc86c", _.syntax.literal);

const Class: $.$expr_PathNode<$.TypeSet<$Class, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Class, $.Cardinality.Many), null, true);

export type $CommonCaseUnitλShape = $.typeutil.flatten<_std.$Object_99e11e7f678f11ed8ccbaf6fbc0493e7λShape & {
  "seq": $.PropertyDesc<_std.$int32, $.Cardinality.One, false, false, false, false>;
  "data": $.LinkDesc<$CaseUnit, $.Cardinality.One, {}, false, false,  false, false>;
}>;
type $CommonCaseUnit = $.ObjectType<"learning::CommonCaseUnit", $CommonCaseUnitλShape, null>;
const $CommonCaseUnit = $.makeType<$CommonCaseUnit>(_.spec, "a8416683-72d3-11ed-8137-8b81e38c92cc", _.syntax.literal);

const CommonCaseUnit: $.$expr_PathNode<$.TypeSet<$CommonCaseUnit, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($CommonCaseUnit, $.Cardinality.Many), null, true);

export type $InputCaseUnitλShape = $.typeutil.flatten<$CommonCaseUnitλShape & {
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "<inputs[is learning::TestCase]": $.LinkDesc<$TestCase, $.Cardinality.Many, {}, false, false,  false, false>;
  "<inputs": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $InputCaseUnit = $.ObjectType<"learning::InputCaseUnit", $InputCaseUnitλShape, null>;
const $InputCaseUnit = $.makeType<$InputCaseUnit>(_.spec, "a84d6898-72d3-11ed-9d84-f3031400e8c7", _.syntax.literal);

const InputCaseUnit: $.$expr_PathNode<$.TypeSet<$InputCaseUnit, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($InputCaseUnit, $.Cardinality.Many), null, true);

export type $NumberCollectionUnitλShape = $.typeutil.flatten<$CaseUnitλShape & {
  "number_collection_value": $.PropertyDesc<$.ArrayType<_std.$float64>, $.Cardinality.One, false, false, false, false>;
}>;
type $NumberCollectionUnit = $.ObjectType<"learning::NumberCollectionUnit", $NumberCollectionUnitλShape, null>;
const $NumberCollectionUnit = $.makeType<$NumberCollectionUnit>(_.spec, "a83af6c1-72d3-11ed-9057-c73a1745e19b", _.syntax.literal);

const NumberCollectionUnit: $.$expr_PathNode<$.TypeSet<$NumberCollectionUnit, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($NumberCollectionUnit, $.Cardinality.Many), null, true);

export type $NumberUnitλShape = $.typeutil.flatten<$CaseUnitλShape & {
  "number_value": $.PropertyDesc<_std.$float64, $.Cardinality.One, false, false, false, false>;
}>;
type $NumberUnit = $.ObjectType<"learning::NumberUnit", $NumberUnitλShape, null>;
const $NumberUnit = $.makeType<$NumberUnit>(_.spec, "a83d9868-72d3-11ed-8c6e-5989490f3151", _.syntax.literal);

const NumberUnit: $.$expr_PathNode<$.TypeSet<$NumberUnit, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($NumberUnit, $.Cardinality.Many), null, true);

export type $OutputCaseUnitλShape = $.typeutil.flatten<$CommonCaseUnitλShape & {
  "<outputs[is learning::TestCase]": $.LinkDesc<$TestCase, $.Cardinality.Many, {}, false, false,  false, false>;
  "<outputs": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $OutputCaseUnit = $.ObjectType<"learning::OutputCaseUnit", $OutputCaseUnitλShape, null>;
const $OutputCaseUnit = $.makeType<$OutputCaseUnit>(_.spec, "a84b958d-72d3-11ed-bda7-391498ead27b", _.syntax.literal);

const OutputCaseUnit: $.$expr_PathNode<$.TypeSet<$OutputCaseUnit, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($OutputCaseUnit, $.Cardinality.Many), null, true);

export type $QuestionλShape = $.typeutil.flatten<_std.$Object_99e11e7f678f11ed8ccbaf6fbc0493e7λShape & {
  "created_at": $.PropertyDesc<_std.$datetime, $.Cardinality.One, false, false, false, true>;
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "problem": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "slug": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, false, false>;
  "classes": $.LinkDesc<$Class, $.Cardinality.Many, {}, false, false,  false, false>;
  "authored_by": $.LinkDesc<_users.$User, $.Cardinality.Many, {}, false, false,  false, false>;
  "test_cases": $.LinkDesc<$TestCase, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Question = $.ObjectType<"learning::Question", $QuestionλShape, null>;
const $Question = $.makeType<$Question>(_.spec, "a860c0e0-72d3-11ed-a99e-0b9fc7495382", _.syntax.literal);

const Question: $.$expr_PathNode<$.TypeSet<$Question, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Question, $.Cardinality.Many), null, true);

export type $StringCollectionUnitλShape = $.typeutil.flatten<$CaseUnitλShape & {
  "string_collection_value": $.PropertyDesc<$.ArrayType<_std.$str>, $.Cardinality.One, false, false, false, false>;
}>;
type $StringCollectionUnit = $.ObjectType<"learning::StringCollectionUnit", $StringCollectionUnitλShape, null>;
const $StringCollectionUnit = $.makeType<$StringCollectionUnit>(_.spec, "a83edec7-72d3-11ed-a8ef-371e61a56130", _.syntax.literal);

const StringCollectionUnit: $.$expr_PathNode<$.TypeSet<$StringCollectionUnit, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($StringCollectionUnit, $.Cardinality.Many), null, true);

export type $StringUnitλShape = $.typeutil.flatten<$CaseUnitλShape & {
  "string_value": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
}>;
type $StringUnit = $.ObjectType<"learning::StringUnit", $StringUnitλShape, null>;
const $StringUnit = $.makeType<$StringUnit>(_.spec, "a8402524-72d3-11ed-afcc-215d4c71a555", _.syntax.literal);

const StringUnit: $.$expr_PathNode<$.TypeSet<$StringUnit, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($StringUnit, $.Cardinality.Many), null, true);

export type $TestCaseλShape = $.typeutil.flatten<_std.$Object_99e11e7f678f11ed8ccbaf6fbc0493e7λShape & {
  "inputs": $.LinkDesc<$InputCaseUnit, $.Cardinality.Many, {}, false, false,  false, false>;
  "outputs": $.LinkDesc<$OutputCaseUnit, $.Cardinality.Many, {}, false, false,  false, false>;
  "<test_cases[is learning::Question]": $.LinkDesc<$Question, $.Cardinality.Many, {}, false, false,  false, false>;
  "<test_cases": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $TestCase = $.ObjectType<"learning::TestCase", $TestCaseλShape, null>;
const $TestCase = $.makeType<$TestCase>(_.spec, "a85ee865-72d3-11ed-8139-6371d5784d67", _.syntax.literal);

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
