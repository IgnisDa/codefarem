import { TestCaseUnit } from ':generated/graphql/orchestrator/generated/graphql';
import { isNumber } from 'lodash';
import { forbidden, unprocessableEntity } from 'remix-utils';
import type { MetaFunction } from '@remix-run/server-runtime';
import { z } from 'zod';
import { zx } from 'zodix';

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

export const argSchema = z.object({
  after: z.string().optional(),
  first: z.string().optional(),
  before: z.string().optional(),
  last: z.string().optional(),
});

export const getArgs = (request: Request, defaultElementsPerPage: number) => {
  const { after, before, first, last } = zx.parseQuery(request, argSchema);
  const args = {
    first: !(first || last)
      ? defaultElementsPerPage
      : first
      ? parseInt(first)
      : undefined,
    after: after,
    before: before,
    last: last ? parseInt(last) : undefined,
  };
  return args;
};
