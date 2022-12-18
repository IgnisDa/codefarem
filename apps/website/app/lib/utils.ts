import { TestCaseUnit } from ":generated/graphql/orchestrator/generated/graphql";

export const guessDataType = (data: string): TestCaseUnit => {
    if (!isNaN(Number(data)))
        return TestCaseUnit.Number;
    else if (data.match(/^[0-9]+(,[0-9]+)*$/))
        return TestCaseUnit.NumberCollection;
    else if (data.match(/^[0-9a-zA-Z]+(,[0-9a-zA-Z]+)*$/))
        return TestCaseUnit.StringCollection;
    return TestCaseUnit.String;
}
