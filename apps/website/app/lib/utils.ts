import { TestCaseUnit } from ':generated/graphql/orchestrator/generated/graphql';
import { isNumber } from 'lodash';
import { forbidden, unprocessableEntity } from 'remix-utils';
import type { MetaFunction } from '@remix-run/server-runtime';

export enum PageAction {
  Create = 'Create',
  Update = 'Update',
  Duplicate = 'Duplicate',
}

/* Guess the data type for an input based on the properties of its contents. */
export const guessDataType = (data: string): TestCaseUnit => {
  if (data === '') return TestCaseUnit.String;
  if (!isNaN(Number(data))) return TestCaseUnit.Number;
  else if (
    data
      .split(',')
      .map((f) => (f ? Number(f) : null))
      // replace every NaN with null
      .map((f) => (String(f) === 'NaN' ? null : f))
      .every((n) => isNumber(n))
  )
    return TestCaseUnit.NumberCollection;
  else if (data.includes(',') && data.split(',').every(Boolean))
    return TestCaseUnit.StringCollection;
  return TestCaseUnit.String;
};

export const forbiddenError = () => {
  throw forbidden({
    message: 'Forbidden',
    description: 'You are not allowed to access this route',
  });
};

export const unprocessableEntityError = (description: string) => {
  throw unprocessableEntity({
    message: 'Unimplemented',
    description,
  });
};

export const metaFunction: MetaFunction = ({ data }) => {
  if (!data) return {};
  return data.meta;
};
