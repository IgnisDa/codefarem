import { gql } from 'urql';

export const COMPILE_RUST = gql`
  mutation CompileRust($input: String!) {
    compileRust(input: $input)
  }
`;
