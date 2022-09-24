import { gql } from 'urql';

export const EXECUTE_CODE = gql`
  mutation ExecuteCode($input: String!, $language: SupportedLanguage!) {
    executeCode(input: $input, language: $language)
  }
`;
