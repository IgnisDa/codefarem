import { TestCaseUnit } from ':generated/graphql/orchestrator/generated/graphql';
import type { MetaFunction } from '@remix-run/server-runtime';
import { forbidden } from 'remix-utils';

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
