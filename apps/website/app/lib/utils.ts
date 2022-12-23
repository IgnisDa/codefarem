import { TestCaseUnit } from ':generated/graphql/orchestrator/generated/graphql';
import { forbidden } from 'remix-utils';
import { match } from 'ts-pattern';
import type { TestCaseFragment } from ':generated/graphql/orchestrator/generated/graphql';
import type { MetaFunction } from '@remix-run/server-runtime';

export const guessDataType = (data: string): TestCaseUnit => {
  if (!isNaN(Number(data))) return TestCaseUnit.Number;
  else if (data.match(/^[0-9]+(,[0-9]+)*$/))
    return TestCaseUnit.NumberCollection;
  else if (data.match(/^[0-9a-zA-Z]+(,[0-9a-zA-Z]+)*$/))
    return TestCaseUnit.StringCollection;
  return TestCaseUnit.String;
};

export const forbiddenError = () => {
  throw forbidden({
    message: 'Forbidden',
    description: 'You are not allowed to access this route',
  });
};

export const metaFunction: MetaFunction = ({ data }) => {
  if (!data) return {};
  return data.meta;
};

export const getDataRepresentation = (data: TestCaseFragment) => {
  return match(data.unitType)
    .with(
      TestCaseUnit.Number,
      TestCaseUnit.String,
      () => String(data.numberValue) || data.stringValue
    )
    .with(TestCaseUnit.NumberCollection, TestCaseUnit.StringCollection, () =>
      (data.numberCollectionValue || data.stringCollectionValue || []).join(',')
    )
    .exhaustive();
};
