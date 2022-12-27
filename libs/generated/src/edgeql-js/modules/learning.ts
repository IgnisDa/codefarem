import { $ } from "edgedb";
import * as _ from "../imports";
import type * as _std from "./std";
import type * as _users from "./users";
export type $CaseUnitλShape = $.typeutil.flatten<_std.$Object_008214927ccf11eda8a2756e5970bb5fλShape & {
  "<data[is learning::CommonCaseUnit]": $.LinkDesc<$CommonCaseUnit, $.Cardinality.Many, {}, false, false,  false, false>;
  "<data[is learning::InputCaseUnit]": $.LinkDesc<$InputCaseUnit, $.Cardinality.Many, {}, false, false,  false, false>;
  "<data[is learning::OutputCaseUnit]": $.LinkDesc<$OutputCaseUnit, $.Cardinality.Many, {}, false, false,  false, false>;
  "<data": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $CaseUnit = $.ObjectType<"learning::CaseUnit", $CaseUnitλShape, null>;
const $CaseUnit = $.makeType<$CaseUnit>(_.spec, "71e53a69-85a2-11ed-8680-4d7ef8c55ebd", _.syntax.literal);

const CaseUnit: $.$expr_PathNode<$.TypeSet<$CaseUnit, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($CaseUnit, $.Cardinality.Many), null, true);

export type $ClassλShape = $.typeutil.flatten<_std.$Object_008214927ccf11eda8a2756e5970bb5fλShape & {
  "join_slug": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, false, false>;
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "students": $.LinkDesc<_users.$Student, $.Cardinality.Many, {}, false, false,  false, false>;
  "teachers": $.LinkDesc<_users.$Teacher, $.Cardinality.Many, {}, false, false,  false, false>;
  "<classes[is users::Student]": $.LinkDesc<_users.$Student, $.Cardinality.Many, {}, false, false,  false, false>;
  "<classes[is users::Teacher]": $.LinkDesc<_users.$Teacher, $.Cardinality.Many, {}, false, false,  false, false>;
  "<class[is learning::QuestionFolder]": $.LinkDesc<$QuestionFolder, $.Cardinality.Many, {}, false, false,  false, false>;
  "<class": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<classes": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Class = $.ObjectType<"learning::Class", $ClassλShape, null>;
const $Class = $.makeType<$Class>(_.spec, "720175b0-85a2-11ed-91ec-dd813ff3fab1", _.syntax.literal);

const Class: $.$expr_PathNode<$.TypeSet<$Class, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Class, $.Cardinality.Many), null, true);

export type $CommonCaseUnitλShape = $.typeutil.flatten<_std.$Object_008214927ccf11eda8a2756e5970bb5fλShape & {
  "normalized_data": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, true, false, false>;
  "seq": $.PropertyDesc<_std.$int32, $.Cardinality.One, false, false, false, false>;
  "data": $.LinkDesc<$CaseUnit, $.Cardinality.One, {}, false, false,  false, false>;
}>;
type $CommonCaseUnit = $.ObjectType<"learning::CommonCaseUnit", $CommonCaseUnitλShape, null>;
const $CommonCaseUnit = $.makeType<$CommonCaseUnit>(_.spec, "71f0b5ee-85a2-11ed-86fe-cdc39713bb91", _.syntax.literal);

const CommonCaseUnit: $.$expr_PathNode<$.TypeSet<$CommonCaseUnit, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($CommonCaseUnit, $.Cardinality.Many), null, true);

export type $InputCaseUnitλShape = $.typeutil.flatten<$CommonCaseUnitλShape & {
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "<inputs[is learning::TestCase]": $.LinkDesc<$TestCase, $.Cardinality.Many, {}, false, false,  false, false>;
  "<inputs": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $InputCaseUnit = $.ObjectType<"learning::InputCaseUnit", $InputCaseUnitλShape, null>;
const $InputCaseUnit = $.makeType<$InputCaseUnit>(_.spec, "71f6057e-85a2-11ed-9dbc-45b7d420cb7e", _.syntax.literal);

const InputCaseUnit: $.$expr_PathNode<$.TypeSet<$InputCaseUnit, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($InputCaseUnit, $.Cardinality.Many), null, true);

export type $NumberCollectionUnitλShape = $.typeutil.flatten<$CaseUnitλShape & {
  "number_collection_value": $.PropertyDesc<$.ArrayType<_std.$float64>, $.Cardinality.One, false, false, false, false>;
}>;
type $NumberCollectionUnit = $.ObjectType<"learning::NumberCollectionUnit", $NumberCollectionUnitλShape, null>;
const $NumberCollectionUnit = $.makeType<$NumberCollectionUnit>(_.spec, "71e68e48-85a2-11ed-92d0-d96afbf957ab", _.syntax.literal);

const NumberCollectionUnit: $.$expr_PathNode<$.TypeSet<$NumberCollectionUnit, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($NumberCollectionUnit, $.Cardinality.Many), null, true);

export type $NumberUnitλShape = $.typeutil.flatten<$CaseUnitλShape & {
  "number_value": $.PropertyDesc<_std.$float64, $.Cardinality.One, false, false, false, false>;
}>;
type $NumberUnit = $.ObjectType<"learning::NumberUnit", $NumberUnitλShape, null>;
const $NumberUnit = $.makeType<$NumberUnit>(_.spec, "71ec61a3-85a2-11ed-996b-d9c0efd563ef", _.syntax.literal);

const NumberUnit: $.$expr_PathNode<$.TypeSet<$NumberUnit, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($NumberUnit, $.Cardinality.Many), null, true);

export type $OutputCaseUnitλShape = $.typeutil.flatten<$CommonCaseUnitλShape & {
  "<outputs[is learning::TestCase]": $.LinkDesc<$TestCase, $.Cardinality.Many, {}, false, false,  false, false>;
  "<outputs": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $OutputCaseUnit = $.ObjectType<"learning::OutputCaseUnit", $OutputCaseUnitλShape, null>;
const $OutputCaseUnit = $.makeType<$OutputCaseUnit>(_.spec, "71fbb8f6-85a2-11ed-9ad0-b7240ae444ee", _.syntax.literal);

const OutputCaseUnit: $.$expr_PathNode<$.TypeSet<$OutputCaseUnit, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($OutputCaseUnit, $.Cardinality.Many), null, true);

export type $QuestionλShape = $.typeutil.flatten<_std.$Object_008214927ccf11eda8a2756e5970bb5fλShape & {
  "problem": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "slug": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, false, false>;
  "created_at": $.PropertyDesc<_std.$datetime, $.Cardinality.One, false, false, false, true>;
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "test_cases": $.LinkDesc<$TestCase, $.Cardinality.Many, {}, false, false,  false, false>;
  "<question[is learning::TestCase]": $.LinkDesc<$TestCase, $.Cardinality.Many, {}, false, false,  false, false>;
  "<question[is learning::QuestionInstance]": $.LinkDesc<$QuestionInstance, $.Cardinality.Many, {}, false, false,  false, false>;
  "<question": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Question = $.ObjectType<"learning::Question", $QuestionλShape, null>;
const $Question = $.makeType<$Question>(_.spec, "7215b0bb-85a2-11ed-8ae1-33c81beae0f2", _.syntax.literal);

const Question: $.$expr_PathNode<$.TypeSet<$Question, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Question, $.Cardinality.Many), null, true);

export type $QuestionFolderλShape = $.typeutil.flatten<_std.$Object_008214927ccf11eda8a2756e5970bb5fλShape & {
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "class": $.LinkDesc<$Class, $.Cardinality.One, {}, false, false,  false, false>;
  "parent": $.LinkDesc<$QuestionFolder, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<parent[is learning::QuestionFolder]": $.LinkDesc<$QuestionFolder, $.Cardinality.Many, {}, false, false,  false, false>;
  "<folder[is learning::QuestionInstance]": $.LinkDesc<$QuestionInstance, $.Cardinality.Many, {}, false, false,  false, false>;
  "<folder": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<parent": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $QuestionFolder = $.ObjectType<"learning::QuestionFolder", $QuestionFolderλShape, null>;
const $QuestionFolder = $.makeType<$QuestionFolder>(_.spec, "72119486-85a2-11ed-9914-d71a3bd0c55c", _.syntax.literal);

const QuestionFolder: $.$expr_PathNode<$.TypeSet<$QuestionFolder, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($QuestionFolder, $.Cardinality.Many), null, true);

export type $QuestionInstanceλShape = $.typeutil.flatten<_std.$Object_008214927ccf11eda8a2756e5970bb5fλShape & {
  "question": $.LinkDesc<$Question, $.Cardinality.One, {}, false, false,  false, false>;
  "folder": $.LinkDesc<$QuestionFolder, $.Cardinality.One, {}, false, false,  false, false>;
}>;
type $QuestionInstance = $.ObjectType<"learning::QuestionInstance", $QuestionInstanceλShape, null>;
const $QuestionInstance = $.makeType<$QuestionInstance>(_.spec, "721cf339-85a2-11ed-a509-49cbcb350cf2", _.syntax.literal);

const QuestionInstance: $.$expr_PathNode<$.TypeSet<$QuestionInstance, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($QuestionInstance, $.Cardinality.Many), null, true);

export type $StringCollectionUnitλShape = $.typeutil.flatten<$CaseUnitλShape & {
  "string_collection_value": $.PropertyDesc<$.ArrayType<_std.$str>, $.Cardinality.One, false, false, false, false>;
}>;
type $StringCollectionUnit = $.ObjectType<"learning::StringCollectionUnit", $StringCollectionUnitλShape, null>;
const $StringCollectionUnit = $.makeType<$StringCollectionUnit>(_.spec, "71edf50c-85a2-11ed-a363-4bab52766b8c", _.syntax.literal);

const StringCollectionUnit: $.$expr_PathNode<$.TypeSet<$StringCollectionUnit, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($StringCollectionUnit, $.Cardinality.Many), null, true);

export type $StringUnitλShape = $.typeutil.flatten<$CaseUnitλShape & {
  "string_value": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
}>;
type $StringUnit = $.ObjectType<"learning::StringUnit", $StringUnitλShape, null>;
const $StringUnit = $.makeType<$StringUnit>(_.spec, "71ef550d-85a2-11ed-8886-af20c53e83c7", _.syntax.literal);

const StringUnit: $.$expr_PathNode<$.TypeSet<$StringUnit, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($StringUnit, $.Cardinality.Many), null, true);

export type $TestCaseλShape = $.typeutil.flatten<_std.$Object_008214927ccf11eda8a2756e5970bb5fλShape & {
  "inputs": $.LinkDesc<$InputCaseUnit, $.Cardinality.Many, {}, false, false,  false, false>;
  "outputs": $.LinkDesc<$OutputCaseUnit, $.Cardinality.Many, {}, false, false,  false, false>;
  "question": $.LinkDesc<$Question, $.Cardinality.Many, {}, false, true,  false, false>;
  "<test_cases[is learning::Question]": $.LinkDesc<$Question, $.Cardinality.Many, {}, false, false,  false, false>;
  "<test_cases": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $TestCase = $.ObjectType<"learning::TestCase", $TestCaseλShape, null>;
const $TestCase = $.makeType<$TestCase>(_.spec, "7213d059-85a2-11ed-90df-6dfbc6d653e9", _.syntax.literal);

const TestCase: $.$expr_PathNode<$.TypeSet<$TestCase, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($TestCase, $.Cardinality.Many), null, true);



export { $CaseUnit, CaseUnit, $Class, Class, $CommonCaseUnit, CommonCaseUnit, $InputCaseUnit, InputCaseUnit, $NumberCollectionUnit, NumberCollectionUnit, $NumberUnit, NumberUnit, $OutputCaseUnit, OutputCaseUnit, $Question, Question, $QuestionFolder, QuestionFolder, $QuestionInstance, QuestionInstance, $StringCollectionUnit, StringCollectionUnit, $StringUnit, StringUnit, $TestCase, TestCase };

type __defaultExports = {
  "CaseUnit": typeof CaseUnit;
  "Class": typeof Class;
  "CommonCaseUnit": typeof CommonCaseUnit;
  "InputCaseUnit": typeof InputCaseUnit;
  "NumberCollectionUnit": typeof NumberCollectionUnit;
  "NumberUnit": typeof NumberUnit;
  "OutputCaseUnit": typeof OutputCaseUnit;
  "Question": typeof Question;
  "QuestionFolder": typeof QuestionFolder;
  "QuestionInstance": typeof QuestionInstance;
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
  "QuestionFolder": QuestionFolder,
  "QuestionInstance": QuestionInstance,
  "StringCollectionUnit": StringCollectionUnit,
  "StringUnit": StringUnit,
  "TestCase": TestCase
};
export default __defaultExports;
