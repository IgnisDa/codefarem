/* eslint-disable */

import { AllTypesProps, ReturnTypes, Ops } from './const';
export const HOST = "http://localhost:8000/graphql"


export const HEADERS = {}
export const apiSubscription = (options: chainOptions) => (query: string) => {
  try {
    const queryString = options[0] + '?query=' + encodeURIComponent(query);
    const wsString = queryString.replace('http', 'ws');
    const host = (options.length > 1 && options[1]?.websocket?.[0]) || wsString;
    const webSocketOptions = options[1]?.websocket || [host];
    const ws = new WebSocket(...webSocketOptions);
    return {
      ws,
      on: (e: (args: any) => void) => {
        ws.onmessage = (event: any) => {
          if (event.data) {
            const parsed = JSON.parse(event.data);
            const data = parsed.data;
            return e(data);
          }
        };
      },
      off: (e: (args: any) => void) => {
        ws.onclose = e;
      },
      error: (e: (args: any) => void) => {
        ws.onerror = e;
      },
      open: (e: () => void) => {
        ws.onopen = e;
      },
    };
  } catch {
    throw new Error('No websockets implemented');
  }
};
const handleFetchResponse = (response: Response): Promise<GraphQLResponse> => {
  if (!response.ok) {
    return new Promise((_, reject) => {
      response
        .text()
        .then((text) => {
          try {
            reject(JSON.parse(text));
          } catch (err) {
            reject(text);
          }
        })
        .catch(reject);
    });
  }
  return response.json();
};

export const apiFetch =
  (options: fetchOptions) =>
  (query: string, variables: Record<string, unknown> = {}) => {
    const fetchOptions = options[1] || {};
    if (fetchOptions.method && fetchOptions.method === 'GET') {
      return fetch(`${options[0]}?query=${encodeURIComponent(query)}`, fetchOptions)
        .then(handleFetchResponse)
        .then((response: GraphQLResponse) => {
          if (response.errors) {
            throw new GraphQLError(response);
          }
          return response.data;
        });
    }
    return fetch(`${options[0]}`, {
      body: JSON.stringify({ query, variables }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      ...fetchOptions,
    })
      .then(handleFetchResponse)
      .then((response: GraphQLResponse) => {
        if (response.errors) {
          throw new GraphQLError(response);
        }
        return response.data;
      });
  };

export const InternalsBuildQuery = ({
  ops,
  props,
  returns,
  options,
  scalars,
}: {
  props: AllTypesPropsType;
  returns: ReturnTypesType;
  ops: Operations;
  options?: OperationOptions;
  scalars?: ScalarDefinition;
}) => {
  const ibb = (
    k: string,
    o: InputValueType | VType,
    p = '',
    root = true,
    vars: Array<{ name: string; graphQLType: string }> = [],
  ): string => {
    const keyForPath = purifyGraphQLKey(k);
    const newPath = [p, keyForPath].join(SEPARATOR);
    if (!o) {
      return '';
    }
    if (typeof o === 'boolean' || typeof o === 'number') {
      return k;
    }
    if (typeof o === 'string') {
      return `${k} ${o}`;
    }
    if (Array.isArray(o)) {
      const args = InternalArgsBuilt({
        props,
        returns,
        ops,
        scalars,
        vars,
      })(o[0], newPath);
      return `${ibb(args ? `${k}(${args})` : k, o[1], p, false, vars)}`;
    }
    if (k === '__alias') {
      return Object.entries(o)
        .map(([alias, objectUnderAlias]) => {
          if (typeof objectUnderAlias !== 'object' || Array.isArray(objectUnderAlias)) {
            throw new Error(
              'Invalid alias it should be __alias:{ YOUR_ALIAS_NAME: { OPERATION_NAME: { ...selectors }}}',
            );
          }
          const operationName = Object.keys(objectUnderAlias)[0];
          const operation = objectUnderAlias[operationName];
          return ibb(`${alias}:${operationName}`, operation, p, false, vars);
        })
        .join('\n');
    }
    const hasOperationName = root && options?.operationName ? ' ' + options.operationName : '';
    const keyForDirectives = o.__directives ?? '';
    const query = `{${Object.entries(o)
      .filter(([k]) => k !== '__directives')
      .map((e) => ibb(...e, [p, `field<>${keyForPath}`].join(SEPARATOR), false, vars))
      .join('\n')}}`;
    if (!root) {
      return `${k} ${keyForDirectives}${hasOperationName} ${query}`;
    }
    const varsString = vars.map((v) => `${v.name}: ${v.graphQLType}`).join(', ');
    return `${k} ${keyForDirectives}${hasOperationName}${varsString ? `(${varsString})` : ''} ${query}`;
  };
  return ibb;
};

export const Thunder =
  (fn: FetchFunction) =>
  <O extends keyof typeof Ops, SCLR extends ScalarDefinition, R extends keyof ValueTypes = GenericOperation<O>>(
    operation: O,
    graphqlOptions?: ThunderGraphQLOptions<SCLR>,
  ) =>
  <Z extends ValueTypes[R]>(o: Z | ValueTypes[R], ops?: OperationOptions & { variables?: Record<string, unknown> }) =>
    fn(
      Zeus(operation, o, {
        operationOptions: ops,
        scalars: graphqlOptions?.scalars,
      }),
      ops?.variables,
    ).then((data) => {
      if (graphqlOptions?.scalars) {
        return decodeScalarsInResponse({
          response: data,
          initialOp: operation,
          initialZeusQuery: o as VType,
          returns: ReturnTypes,
          scalars: graphqlOptions.scalars,
          ops: Ops,
        });
      }
      return data;
    }) as Promise<InputType<GraphQLTypes[R], Z, SCLR>>;

export const Chain = (...options: chainOptions) => Thunder(apiFetch(options));

export const SubscriptionThunder =
  (fn: SubscriptionFunction) =>
  <O extends keyof typeof Ops, SCLR extends ScalarDefinition, R extends keyof ValueTypes = GenericOperation<O>>(
    operation: O,
    graphqlOptions?: ThunderGraphQLOptions<SCLR>,
  ) =>
  <Z extends ValueTypes[R]>(o: Z | ValueTypes[R], ops?: OperationOptions & { variables?: ExtractVariables<Z> }) => {
    const returnedFunction = fn(
      Zeus(operation, o, {
        operationOptions: ops,
        scalars: graphqlOptions?.scalars,
      }),
    ) as SubscriptionToGraphQL<Z, GraphQLTypes[R], SCLR>;
    if (returnedFunction?.on && graphqlOptions?.scalars) {
      const wrapped = returnedFunction.on;
      returnedFunction.on = (fnToCall: (args: InputType<GraphQLTypes[R], Z, SCLR>) => void) =>
        wrapped((data: InputType<GraphQLTypes[R], Z, SCLR>) => {
          if (graphqlOptions?.scalars) {
            return fnToCall(
              decodeScalarsInResponse({
                response: data,
                initialOp: operation,
                initialZeusQuery: o as VType,
                returns: ReturnTypes,
                scalars: graphqlOptions.scalars,
                ops: Ops,
              }),
            );
          }
          return fnToCall(data);
        });
    }
    return returnedFunction;
  };

export const Subscription = (...options: chainOptions) => SubscriptionThunder(apiSubscription(options));
export const Zeus = <
  Z extends ValueTypes[R],
  O extends keyof typeof Ops,
  R extends keyof ValueTypes = GenericOperation<O>,
>(
  operation: O,
  o: Z | ValueTypes[R],
  ops?: {
    operationOptions?: OperationOptions;
    scalars?: ScalarDefinition;
  },
) =>
  InternalsBuildQuery({
    props: AllTypesProps,
    returns: ReturnTypes,
    ops: Ops,
    options: ops?.operationOptions,
    scalars: ops?.scalars,
  })(operation, o as VType);

export const ZeusSelect = <T>() => ((t: unknown) => t) as SelectionFunction<T>;

export const Selector = <T extends keyof ValueTypes>(key: T) => key && ZeusSelect<ValueTypes[T]>();

export const TypeFromSelector = <T extends keyof ValueTypes>(key: T) => key && ZeusSelect<ValueTypes[T]>();
export const Gql = Chain(HOST, {
  headers: {
    'Content-Type': 'application/json',
    ...HEADERS,
  },
});

export const ZeusScalars = ZeusSelect<ScalarCoders>();

export const decodeScalarsInResponse = <O extends Operations>({
  response,
  scalars,
  returns,
  ops,
  initialZeusQuery,
  initialOp,
}: {
  ops: O;
  response: any;
  returns: ReturnTypesType;
  scalars?: Record<string, ScalarResolver | undefined>;
  initialOp: keyof O;
  initialZeusQuery: InputValueType | VType;
}) => {
  if (!scalars) {
    return response;
  }
  const builder = PrepareScalarPaths({
    ops,
    returns,
  });

  const scalarPaths = builder(initialOp as string, ops[initialOp], initialZeusQuery);
  if (scalarPaths) {
    const r = traverseResponse({ scalarPaths, resolvers: scalars })(initialOp as string, response, [ops[initialOp]]);
    return r;
  }
  return response;
};

export const traverseResponse = ({
  resolvers,
  scalarPaths,
}: {
  scalarPaths: { [x: string]: `scalar.${string}` };
  resolvers: {
    [x: string]: ScalarResolver | undefined;
  };
}) => {
  const ibb = (k: string, o: InputValueType | VType, p: string[] = []): unknown => {
    if (Array.isArray(o)) {
      return o.map((eachO) => ibb(k, eachO, p));
    }
    if (o == null) {
      return o;
    }
    const scalarPathString = p.join(SEPARATOR);
    const currentScalarString = scalarPaths[scalarPathString];
    if (currentScalarString) {
      const currentDecoder = resolvers[currentScalarString.split('.')[1]]?.decode;
      if (currentDecoder) {
        return currentDecoder(o);
      }
    }
    if (typeof o === 'boolean' || typeof o === 'number' || typeof o === 'string' || !o) {
      return o;
    }
    return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, ibb(k, v, [...p, purifyGraphQLKey(k)])]));
  };
  return ibb;
};

export type AllTypesPropsType = {
  [x: string]:
    | undefined
    | `scalar.${string}`
    | 'enum'
    | {
        [x: string]:
          | undefined
          | string
          | {
              [x: string]: string | undefined;
            };
      };
};

export type ReturnTypesType = {
  [x: string]:
    | {
        [x: string]: string | undefined;
      }
    | `scalar.${string}`
    | undefined;
};
export type InputValueType = {
  [x: string]: undefined | boolean | string | number | [any, undefined | boolean | InputValueType] | InputValueType;
};
export type VType =
  | undefined
  | boolean
  | string
  | number
  | [any, undefined | boolean | InputValueType]
  | InputValueType;

export type PlainType = boolean | number | string | null | undefined;
export type ZeusArgsType =
  | PlainType
  | {
      [x: string]: ZeusArgsType;
    }
  | Array<ZeusArgsType>;

export type Operations = Record<string, string>;

export type VariableDefinition = {
  [x: string]: unknown;
};

export const SEPARATOR = '|';

export type fetchOptions = Parameters<typeof fetch>;
type websocketOptions = typeof WebSocket extends new (...args: infer R) => WebSocket ? R : never;
export type chainOptions = [fetchOptions[0], fetchOptions[1] & { websocket?: websocketOptions }] | [fetchOptions[0]];
export type FetchFunction = (query: string, variables?: Record<string, unknown>) => Promise<any>;
export type SubscriptionFunction = (query: string) => any;
type NotUndefined<T> = T extends undefined ? never : T;
export type ResolverType<F> = NotUndefined<F extends [infer ARGS, any] ? ARGS : undefined>;

export type OperationOptions = {
  operationName?: string;
};

export type ScalarCoder = Record<string, (s: unknown) => string>;

export interface GraphQLResponse {
  data?: Record<string, any>;
  errors?: Array<{
    message: string;
  }>;
}
export class GraphQLError extends Error {
  constructor(public response: GraphQLResponse) {
    super('');
    console.error(response);
  }
  toString() {
    return 'GraphQL Response Error';
  }
}
export type GenericOperation<O> = O extends keyof typeof Ops ? typeof Ops[O] : never;
export type ThunderGraphQLOptions<SCLR extends ScalarDefinition> = {
  scalars?: SCLR | ScalarCoders;
};

const ExtractScalar = (mappedParts: string[], returns: ReturnTypesType): `scalar.${string}` | undefined => {
  if (mappedParts.length === 0) {
    return;
  }
  const oKey = mappedParts[0];
  const returnP1 = returns[oKey];
  if (typeof returnP1 === 'object') {
    const returnP2 = returnP1[mappedParts[1]];
    if (returnP2) {
      return ExtractScalar([returnP2, ...mappedParts.slice(2)], returns);
    }
    return undefined;
  }
  return returnP1 as `scalar.${string}` | undefined;
};

export const PrepareScalarPaths = ({ ops, returns }: { returns: ReturnTypesType; ops: Operations }) => {
  const ibb = (
    k: string,
    originalKey: string,
    o: InputValueType | VType,
    p: string[] = [],
    pOriginals: string[] = [],
    root = true,
  ): { [x: string]: `scalar.${string}` } | undefined => {
    if (!o) {
      return;
    }
    if (typeof o === 'boolean' || typeof o === 'number' || typeof o === 'string') {
      const extractionArray = [...pOriginals, originalKey];
      const isScalar = ExtractScalar(extractionArray, returns);
      if (isScalar?.startsWith('scalar')) {
        const partOfTree = {
          [[...p, k].join(SEPARATOR)]: isScalar,
        };
        return partOfTree;
      }
      return {};
    }
    if (Array.isArray(o)) {
      return ibb(k, k, o[1], p, pOriginals, false);
    }
    if (k === '__alias') {
      return Object.entries(o)
        .map(([alias, objectUnderAlias]) => {
          if (typeof objectUnderAlias !== 'object' || Array.isArray(objectUnderAlias)) {
            throw new Error(
              'Invalid alias it should be __alias:{ YOUR_ALIAS_NAME: { OPERATION_NAME: { ...selectors }}}',
            );
          }
          const operationName = Object.keys(objectUnderAlias)[0];
          const operation = objectUnderAlias[operationName];
          return ibb(alias, operationName, operation, p, pOriginals, false);
        })
        .reduce((a, b) => ({
          ...a,
          ...b,
        }));
    }
    const keyName = root ? ops[k] : k;
    return Object.entries(o)
      .filter(([k]) => k !== '__directives')
      .map(([k, v]) => {
        // Inline fragments shouldn't be added to the path as they aren't a field
        const isInlineFragment = originalKey.match(/^...\s*on/) != null;
        return ibb(
          k,
          k,
          v,
          isInlineFragment ? p : [...p, purifyGraphQLKey(keyName || k)],
          isInlineFragment ? pOriginals : [...pOriginals, purifyGraphQLKey(originalKey)],
          false,
        );
      })
      .reduce((a, b) => ({
        ...a,
        ...b,
      }));
  };
  return ibb;
};

export const purifyGraphQLKey = (k: string) => k.replace(/\([^)]*\)/g, '').replace(/^[^:]*\:/g, '');

const mapPart = (p: string) => {
  const [isArg, isField] = p.split('<>');
  if (isField) {
    return {
      v: isField,
      __type: 'field',
    } as const;
  }
  return {
    v: isArg,
    __type: 'arg',
  } as const;
};

type Part = ReturnType<typeof mapPart>;

export const ResolveFromPath = (props: AllTypesPropsType, returns: ReturnTypesType, ops: Operations) => {
  const ResolvePropsType = (mappedParts: Part[]) => {
    const oKey = ops[mappedParts[0].v];
    const propsP1 = oKey ? props[oKey] : props[mappedParts[0].v];
    if (propsP1 === 'enum' && mappedParts.length === 1) {
      return 'enum';
    }
    if (typeof propsP1 === 'string' && propsP1.startsWith('scalar.') && mappedParts.length === 1) {
      return propsP1;
    }
    if (typeof propsP1 === 'object') {
      if (mappedParts.length < 2) {
        return 'not';
      }
      const propsP2 = propsP1[mappedParts[1].v];
      if (typeof propsP2 === 'string') {
        return rpp(
          `${propsP2}${SEPARATOR}${mappedParts
            .slice(2)
            .map((mp) => mp.v)
            .join(SEPARATOR)}`,
        );
      }
      if (typeof propsP2 === 'object') {
        if (mappedParts.length < 3) {
          return 'not';
        }
        const propsP3 = propsP2[mappedParts[2].v];
        if (propsP3 && mappedParts[2].__type === 'arg') {
          return rpp(
            `${propsP3}${SEPARATOR}${mappedParts
              .slice(3)
              .map((mp) => mp.v)
              .join(SEPARATOR)}`,
          );
        }
      }
    }
  };
  const ResolveReturnType = (mappedParts: Part[]) => {
    if (mappedParts.length === 0) {
      return 'not';
    }
    const oKey = ops[mappedParts[0].v];
    const returnP1 = oKey ? returns[oKey] : returns[mappedParts[0].v];
    if (typeof returnP1 === 'object') {
      if (mappedParts.length < 2) return 'not';
      const returnP2 = returnP1[mappedParts[1].v];
      if (returnP2) {
        return rpp(
          `${returnP2}${SEPARATOR}${mappedParts
            .slice(2)
            .map((mp) => mp.v)
            .join(SEPARATOR)}`,
        );
      }
    }
  };
  const rpp = (path: string): 'enum' | 'not' | `scalar.${string}` => {
    const parts = path.split(SEPARATOR).filter((l) => l.length > 0);
    const mappedParts = parts.map(mapPart);
    const propsP1 = ResolvePropsType(mappedParts);
    if (propsP1) {
      return propsP1;
    }
    const returnP1 = ResolveReturnType(mappedParts);
    if (returnP1) {
      return returnP1;
    }
    return 'not';
  };
  return rpp;
};

export const InternalArgsBuilt = ({
  props,
  ops,
  returns,
  scalars,
  vars,
}: {
  props: AllTypesPropsType;
  returns: ReturnTypesType;
  ops: Operations;
  scalars?: ScalarDefinition;
  vars: Array<{ name: string; graphQLType: string }>;
}) => {
  const arb = (a: ZeusArgsType, p = '', root = true): string => {
    if (typeof a === 'string') {
      if (a.startsWith(START_VAR_NAME)) {
        const [varName, graphQLType] = a.replace(START_VAR_NAME, '$').split(GRAPHQL_TYPE_SEPARATOR);
        const v = vars.find((v) => v.name === varName);
        if (!v) {
          vars.push({
            name: varName,
            graphQLType,
          });
        } else {
          if (v.graphQLType !== graphQLType) {
            throw new Error(
              `Invalid variable exists with two different GraphQL Types, "${v.graphQLType}" and ${graphQLType}`,
            );
          }
        }
        return varName;
      }
    }
    const checkType = ResolveFromPath(props, returns, ops)(p);
    if (checkType.startsWith('scalar.')) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, ...splittedScalar] = checkType.split('.');
      const scalarKey = splittedScalar.join('.');
      return (scalars?.[scalarKey]?.encode?.(a) as string) || JSON.stringify(a);
    }
    if (Array.isArray(a)) {
      return `[${a.map((arr) => arb(arr, p, false)).join(', ')}]`;
    }
    if (typeof a === 'string') {
      if (checkType === 'enum') {
        return a;
      }
      return `${JSON.stringify(a)}`;
    }
    if (typeof a === 'object') {
      if (a === null) {
        return `null`;
      }
      const returnedObjectString = Object.entries(a)
        .filter(([, v]) => typeof v !== 'undefined')
        .map(([k, v]) => `${k}: ${arb(v, [p, k].join(SEPARATOR), false)}`)
        .join(',\n');
      if (!root) {
        return `{${returnedObjectString}}`;
      }
      return returnedObjectString;
    }
    return `${a}`;
  };
  return arb;
};

export const resolverFor = <X, T extends keyof ResolverInputTypes, Z extends keyof ResolverInputTypes[T]>(
  type: T,
  field: Z,
  fn: (
    args: Required<ResolverInputTypes[T]>[Z] extends [infer Input, any] ? Input : any,
    source: any,
  ) => Z extends keyof ModelTypes[T] ? ModelTypes[T][Z] | Promise<ModelTypes[T][Z]> | X : any,
) => fn as (args?: any, source?: any) => any;

export type UnwrapPromise<T> = T extends Promise<infer R> ? R : T;
export type ZeusState<T extends (...args: any[]) => Promise<any>> = NonNullable<UnwrapPromise<ReturnType<T>>>;
export type ZeusHook<
  T extends (...args: any[]) => Record<string, (...args: any[]) => Promise<any>>,
  N extends keyof ReturnType<T>,
> = ZeusState<ReturnType<T>[N]>;

export type WithTypeNameValue<T> = T & {
  __typename?: boolean;
  __directives?: string;
};
export type AliasType<T> = WithTypeNameValue<T> & {
  __alias?: Record<string, WithTypeNameValue<T>>;
};
type DeepAnify<T> = {
  [P in keyof T]?: any;
};
type IsPayLoad<T> = T extends [any, infer PayLoad] ? PayLoad : T;
export type ScalarDefinition = Record<string, ScalarResolver>;

type IsScalar<S, SCLR extends ScalarDefinition> = S extends 'scalar' & { name: infer T }
  ? T extends keyof SCLR
    ? SCLR[T]['decode'] extends (s: unknown) => unknown
      ? ReturnType<SCLR[T]['decode']>
      : unknown
    : unknown
  : S;
type IsArray<T, U, SCLR extends ScalarDefinition> = T extends Array<infer R>
  ? InputType<R, U, SCLR>[]
  : InputType<T, U, SCLR>;
type FlattenArray<T> = T extends Array<infer R> ? R : T;
type BaseZeusResolver = boolean | 1 | string | Variable<any, string>;

type IsInterfaced<SRC extends DeepAnify<DST>, DST, SCLR extends ScalarDefinition> = FlattenArray<SRC> extends
  | ZEUS_INTERFACES
  | ZEUS_UNIONS
  ? {
      [P in keyof SRC]: SRC[P] extends '__union' & infer R
        ? P extends keyof DST
          ? IsArray<R, '__typename' extends keyof DST ? DST[P] & { __typename: true } : DST[P], SCLR>
          : Record<string, unknown>
        : never;
    }[keyof DST] & {
      [P in keyof Omit<
        Pick<
          SRC,
          {
            [P in keyof DST]: SRC[P] extends '__union' & infer R ? never : P;
          }[keyof DST]
        >,
        '__typename'
      >]: IsPayLoad<DST[P]> extends BaseZeusResolver ? IsScalar<SRC[P], SCLR> : IsArray<SRC[P], DST[P], SCLR>;
    }
  : {
      [P in keyof Pick<SRC, keyof DST>]: IsPayLoad<DST[P]> extends BaseZeusResolver
        ? IsScalar<SRC[P], SCLR>
        : IsArray<SRC[P], DST[P], SCLR>;
    };

export type MapType<SRC, DST, SCLR extends ScalarDefinition> = SRC extends DeepAnify<DST>
  ? IsInterfaced<SRC, DST, SCLR>
  : never;
// eslint-disable-next-line @typescript-eslint/ban-types
export type InputType<SRC, DST, SCLR extends ScalarDefinition = {}> = IsPayLoad<DST> extends { __alias: infer R }
  ? {
      [P in keyof R]: MapType<SRC, R[P], SCLR>[keyof MapType<SRC, R[P], SCLR>];
    } & MapType<SRC, Omit<IsPayLoad<DST>, '__alias'>, SCLR>
  : MapType<SRC, IsPayLoad<DST>, SCLR>;
export type SubscriptionToGraphQL<Z, T, SCLR extends ScalarDefinition> = {
  ws: WebSocket;
  on: (fn: (args: InputType<T, Z, SCLR>) => void) => void;
  off: (fn: (e: { data?: InputType<T, Z, SCLR>; code?: number; reason?: string; message?: string }) => void) => void;
  error: (fn: (e: { data?: InputType<T, Z, SCLR>; errors?: string[] }) => void) => void;
  open: () => void;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type FromSelector<SELECTOR, NAME extends keyof GraphQLTypes, SCLR extends ScalarDefinition = {}> = InputType<
  GraphQLTypes[NAME],
  SELECTOR,
  SCLR
>;

export type ScalarResolver = {
  encode?: (s: unknown) => string;
  decode?: (s: unknown) => unknown;
};

export type SelectionFunction<V> = <T>(t: T | V) => T;

type BuiltInVariableTypes = {
  ['String']: string;
  ['Int']: number;
  ['Float']: number;
  ['ID']: unknown;
  ['Boolean']: boolean;
};
type AllVariableTypes = keyof BuiltInVariableTypes | keyof ZEUS_VARIABLES;
type VariableRequired<T extends string> = `${T}!` | T | `[${T}]` | `[${T}]!` | `[${T}!]` | `[${T}!]!`;
type VR<T extends string> = VariableRequired<VariableRequired<T>>;

export type GraphQLVariableType = VR<AllVariableTypes>;

type ExtractVariableTypeString<T extends string> = T extends VR<infer R1>
  ? R1 extends VR<infer R2>
    ? R2 extends VR<infer R3>
      ? R3 extends VR<infer R4>
        ? R4 extends VR<infer R5>
          ? R5
          : R4
        : R3
      : R2
    : R1
  : T;

type DecomposeType<T, Type> = T extends `[${infer R}]`
  ? Array<DecomposeType<R, Type>> | undefined
  : T extends `${infer R}!`
  ? NonNullable<DecomposeType<R, Type>>
  : Type | undefined;

type ExtractTypeFromGraphQLType<T extends string> = T extends keyof ZEUS_VARIABLES
  ? ZEUS_VARIABLES[T]
  : T extends keyof BuiltInVariableTypes
  ? BuiltInVariableTypes[T]
  : any;

export type GetVariableType<T extends string> = DecomposeType<
  T,
  ExtractTypeFromGraphQLType<ExtractVariableTypeString<T>>
>;

type UndefinedKeys<T> = {
  [K in keyof T]-?: T[K] extends NonNullable<T[K]> ? never : K;
}[keyof T];

type WithNullableKeys<T> = Pick<T, UndefinedKeys<T>>;
type WithNonNullableKeys<T> = Omit<T, UndefinedKeys<T>>;

type OptionalKeys<T> = {
  [P in keyof T]?: T[P];
};

export type WithOptionalNullables<T> = OptionalKeys<WithNullableKeys<T>> & WithNonNullableKeys<T>;

export type Variable<T extends GraphQLVariableType, Name extends string> = {
  ' __zeus_name': Name;
  ' __zeus_type': T;
};

export type ExtractVariables<Query> = Query extends Variable<infer VType, infer VName>
  ? { [key in VName]: GetVariableType<VType> }
  : Query extends [infer Inputs, infer Outputs]
  ? ExtractVariables<Inputs> & ExtractVariables<Outputs>
  : Query extends string | number | boolean
  ? // eslint-disable-next-line @typescript-eslint/ban-types
    {}
  : UnionToIntersection<{ [K in keyof Query]: WithOptionalNullables<ExtractVariables<Query[K]>> }[keyof Query]>;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export const START_VAR_NAME = `$ZEUS_VAR`;
export const GRAPHQL_TYPE_SEPARATOR = `__$GRAPHQL__`;

export const $ = <Type extends GraphQLVariableType, Name extends string>(name: Name, graphqlType: Type) => {
  return (START_VAR_NAME + name + GRAPHQL_TYPE_SEPARATOR + graphqlType) as unknown as Variable<Type, Name>;
};
type ZEUS_INTERFACES = never
export type ScalarCoders = {
	UUID?: ScalarResolver;
}
type ZEUS_UNIONS = GraphQLTypes["ClassDetailsResultUnion"] | GraphQLTypes["CreateClassResultUnion"] | GraphQLTypes["CreateQuestionResultUnion"] | GraphQLTypes["ExecuteCodeResultUnion"] | GraphQLTypes["LoginUserResultUnion"] | GraphQLTypes["RegisterUserResultUnion"] | GraphQLTypes["UserDetailsResultUnion"] | GraphQLTypes["UserWithEmailResultUnion"]

export type ValueTypes = {
    /** The types of accounts a user can create */
["AccountType"]:AccountType;
	/** An error type with an attached field to tell what went wrong */
["ApiError"]: AliasType<{
	/** The error describing what went wrong */
	error?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	/** The result type if details about the class were found successfully */
["ClassDetailsOutput"]: AliasType<{
	/** The name of the class */
	name?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	/** The output object when getting details about a class */
["ClassDetailsResultUnion"]: AliasType<{		["...on ClassDetailsOutput"] : ValueTypes["ClassDetailsOutput"],
		["...on ApiError"] : ValueTypes["ApiError"]
		__typename?: boolean | `@${string}`
}>;
	/** The input object used to create a new class */
["CreateClassInput"]: {
	/** The name of the class */
	name: string | Variable<any, string>,
	/** The teachers who are teaching the class */
	teacherIds: Array<ValueTypes["UUID"]> | Variable<any, string>
};
	/** The result type if the class was created successfully */
["CreateClassOutput"]: AliasType<{
	/** The ID of the class */
	id?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	/** The output object when creating a new class */
["CreateClassResultUnion"]: AliasType<{		["...on CreateClassOutput"] : ValueTypes["CreateClassOutput"],
		["...on ApiError"] : ValueTypes["ApiError"]
		__typename?: boolean | `@${string}`
}>;
	/** The input object used to create a new question */
["CreateQuestionInput"]: {
	/** The name/title of the question */
	name: string | Variable<any, string>,
	/** The detailed text explaining the question */
	problem: string | Variable<any, string>,
	/** The classes in which the question must be asked */
	classIds: Array<ValueTypes["UUID"]> | Variable<any, string>,
	/** All the test cases that are related to this question */
	testCases: Array<ValueTypes["TestCase"]> | Variable<any, string>
};
	/** The result type if the question was created successfully */
["CreateQuestionOutput"]: AliasType<{
	/** The ID of the question */
	id?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	/** The output object when creating a new question */
["CreateQuestionResultUnion"]: AliasType<{		["...on CreateQuestionOutput"] : ValueTypes["CreateQuestionOutput"],
		["...on ApiError"] : ValueTypes["ApiError"]
		__typename?: boolean | `@${string}`
}>;
	/** The result type if an error was encountered when executing code */
["ExecuteCodeError"]: AliasType<{
	/** The error that occurred while compiling/executing the submitted code */
	error?:boolean | `@${string}`,
	/** The step in which the error the above error occurred */
	step?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	/** The execution step in which an error was encountered */
["ExecuteCodeErrorStep"]:ExecuteCodeErrorStep;
	/** The input object used to execute some code */
["ExecuteCodeInput"]: {
	/** The code input that needs to be compiled */
	code: string | Variable<any, string>,
	/** The language that needs to be compiled */
	language: ValueTypes["SupportedLanguage"] | Variable<any, string>
};
	/** The result type if the code was compiled and executed successfully */
["ExecuteCodeOutput"]: AliasType<{
	/** The output of the code that was executed */
	output?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	/** The output object when executing code */
["ExecuteCodeResultUnion"]: AliasType<{		["...on ExecuteCodeOutput"] : ValueTypes["ExecuteCodeOutput"],
		["...on ExecuteCodeError"] : ValueTypes["ExecuteCodeError"]
		__typename?: boolean | `@${string}`
}>;
	["InputCaseUnit"]: {
	dataType: ValueTypes["TestCaseUnit"] | Variable<any, string>,
	data: string | Variable<any, string>,
	/** The name of the variable to store it as */
	name: string | Variable<any, string>
};
	/** The different errors that can occur when logging in to the service */
["LoginError"]:LoginError;
	/** The result type if an error was encountered when creating a new user */
["LoginUserError"]: AliasType<{
	/** The error encountered while logging in */
	error?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	/** The input object used to create a new user */
["LoginUserInput"]: {
	/** The email of the user */
	email: string | Variable<any, string>,
	/** The password that the user wants to set */
	password: string | Variable<any, string>
};
	/** The result type if the user was created successfully */
["LoginUserOutput"]: AliasType<{
	/** The unique JWT token to be issued */
	token?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	/** The output object when creating a new user */
["LoginUserResultUnion"]: AliasType<{		["...on LoginUserOutput"] : ValueTypes["LoginUserOutput"],
		["...on LoginUserError"] : ValueTypes["LoginUserError"]
		__typename?: boolean | `@${string}`
}>;
	/** The GraphQL top-level mutation type */
["MutationRoot"]: AliasType<{
executeCode?: [{	input: ValueTypes["ExecuteCodeInput"] | Variable<any, string>},ValueTypes["ExecuteCodeResultUnion"]],
registerUser?: [{	input: ValueTypes["RegisterUserInput"] | Variable<any, string>},ValueTypes["RegisterUserResultUnion"]],
createClass?: [{	input: ValueTypes["CreateClassInput"] | Variable<any, string>},ValueTypes["CreateClassResultUnion"]],
createQuestion?: [{	input: ValueTypes["CreateQuestionInput"] | Variable<any, string>},ValueTypes["CreateQuestionResultUnion"]],
		__typename?: boolean | `@${string}`
}>;
	["OutputCaseUnit"]: {
	/** The type of data to store this line as */
	dataType: ValueTypes["TestCaseUnit"] | Variable<any, string>,
	/** The data to store */
	data: string | Variable<any, string>
};
	/** The GraphQL top-level query type */
["QueryRoot"]: AliasType<{
	/** Get a list of all the languages that the service supports. */
	supportedLanguages?:boolean | `@${string}`,
languageExample?: [{	language: ValueTypes["SupportedLanguage"] | Variable<any, string>},boolean | `@${string}`],
	/** Get information about the current user */
	userDetails?:ValueTypes["UserDetailsResultUnion"],
userWithEmail?: [{	input: ValueTypes["UserWithEmailInput"] | Variable<any, string>},ValueTypes["UserWithEmailResultUnion"]],
loginUser?: [{	input: ValueTypes["LoginUserInput"] | Variable<any, string>},ValueTypes["LoginUserResultUnion"]],
	/** Logout a user from the service */
	logoutUser?:boolean | `@${string}`,
	/** Get all the types of test case units possible */
	testCaseUnits?:boolean | `@${string}`,
classDetails?: [{	classId: ValueTypes["UUID"] | Variable<any, string>},ValueTypes["ClassDetailsResultUnion"]],
		__typename?: boolean | `@${string}`
}>;
	/** The result type if an error was encountered when creating a new user */
["RegisterUserError"]: AliasType<{
	/** whether the provided username is unique */
	usernameNotUnique?:boolean | `@${string}`,
	/** whether the provided email is unique */
	emailNotUnique?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	/** The input object used to create a new user */
["RegisterUserInput"]: {
	/** The username of the user */
	username: string | Variable<any, string>,
	/** The email of the user */
	email: string | Variable<any, string>,
	/** The password that the user wants to set */
	password: string | Variable<any, string>,
	/** The type of account the user wants to create */
	accountType: ValueTypes["AccountType"] | Variable<any, string>
};
	/** The result type if the user was created successfully */
["RegisterUserOutput"]: AliasType<{
	/** The ID of the user */
	id?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	/** The output object when creating a new user */
["RegisterUserResultUnion"]: AliasType<{		["...on RegisterUserOutput"] : ValueTypes["RegisterUserOutput"],
		["...on RegisterUserError"] : ValueTypes["RegisterUserError"]
		__typename?: boolean | `@${string}`
}>;
	["SupportedLanguage"]:SupportedLanguage;
	["TestCase"]: {
	/** The inputs related to this test case */
	inputs: Array<ValueTypes["InputCaseUnit"]> | Variable<any, string>,
	/** The outputs related to this test case */
	outputs: Array<ValueTypes["OutputCaseUnit"]> | Variable<any, string>
};
	["TestCaseUnit"]:TestCaseUnit;
	/** A UUID is a unique 128-bit number, stored as 16 octets. UUIDs are parsed as
Strings within GraphQL. UUIDs are used to assign unique identifiers to
entities without requiring a central allocating authority.

# References

* [Wikipedia: Universally Unique Identifier](http://en.wikipedia.org/wiki/Universally_unique_identifier)
* [RFC4122: A Universally Unique IDentifier (UUID) URN Namespace](http://tools.ietf.org/html/rfc4122) */
["UUID"]:unknown;
	/** The result type if details about the user were found successfully */
["UserDetailsOutput"]: AliasType<{
	/** Profile details about the user */
	profile?:ValueTypes["UserProfileInformation"],
	/** The type of account the user has */
	accountType?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	/** The output object when creating a new user */
["UserDetailsResultUnion"]: AliasType<{		["...on UserDetailsOutput"] : ValueTypes["UserDetailsOutput"],
		["...on ApiError"] : ValueTypes["ApiError"]
		__typename?: boolean | `@${string}`
}>;
	["UserProfileInformation"]: AliasType<{
	/** The email of the user */
	email?:boolean | `@${string}`,
	/** The username of the user */
	username?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	/** The result type if a user with the provided email was not found */
["UserWithEmailError"]: AliasType<{
	/** The error encountered while finding the user */
	error?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	/** The input object used to query for a user */
["UserWithEmailInput"]: {
	/** The email of the user */
	email: string | Variable<any, string>
};
	/** The result type if the user was created successfully */
["UserWithEmailOutput"]: AliasType<{
	/** The unique ID of the user */
	id?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	/** The output object when finding a user with the provided email */
["UserWithEmailResultUnion"]: AliasType<{		["...on UserWithEmailOutput"] : ValueTypes["UserWithEmailOutput"],
		["...on UserWithEmailError"] : ValueTypes["UserWithEmailError"]
		__typename?: boolean | `@${string}`
}>
  }

export type ResolverInputTypes = {
    /** The types of accounts a user can create */
["AccountType"]:AccountType;
	/** An error type with an attached field to tell what went wrong */
["ApiError"]: AliasType<{
	/** The error describing what went wrong */
	error?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	/** The result type if details about the class were found successfully */
["ClassDetailsOutput"]: AliasType<{
	/** The name of the class */
	name?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	/** The output object when getting details about a class */
["ClassDetailsResultUnion"]: AliasType<{
	ClassDetailsOutput?:ResolverInputTypes["ClassDetailsOutput"],
	ApiError?:ResolverInputTypes["ApiError"],
		__typename?: boolean | `@${string}`
}>;
	/** The input object used to create a new class */
["CreateClassInput"]: {
	/** The name of the class */
	name: string,
	/** The teachers who are teaching the class */
	teacherIds: Array<ResolverInputTypes["UUID"]>
};
	/** The result type if the class was created successfully */
["CreateClassOutput"]: AliasType<{
	/** The ID of the class */
	id?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	/** The output object when creating a new class */
["CreateClassResultUnion"]: AliasType<{
	CreateClassOutput?:ResolverInputTypes["CreateClassOutput"],
	ApiError?:ResolverInputTypes["ApiError"],
		__typename?: boolean | `@${string}`
}>;
	/** The input object used to create a new question */
["CreateQuestionInput"]: {
	/** The name/title of the question */
	name: string,
	/** The detailed text explaining the question */
	problem: string,
	/** The classes in which the question must be asked */
	classIds: Array<ResolverInputTypes["UUID"]>,
	/** All the test cases that are related to this question */
	testCases: Array<ResolverInputTypes["TestCase"]>
};
	/** The result type if the question was created successfully */
["CreateQuestionOutput"]: AliasType<{
	/** The ID of the question */
	id?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	/** The output object when creating a new question */
["CreateQuestionResultUnion"]: AliasType<{
	CreateQuestionOutput?:ResolverInputTypes["CreateQuestionOutput"],
	ApiError?:ResolverInputTypes["ApiError"],
		__typename?: boolean | `@${string}`
}>;
	/** The result type if an error was encountered when executing code */
["ExecuteCodeError"]: AliasType<{
	/** The error that occurred while compiling/executing the submitted code */
	error?:boolean | `@${string}`,
	/** The step in which the error the above error occurred */
	step?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	/** The execution step in which an error was encountered */
["ExecuteCodeErrorStep"]:ExecuteCodeErrorStep;
	/** The input object used to execute some code */
["ExecuteCodeInput"]: {
	/** The code input that needs to be compiled */
	code: string,
	/** The language that needs to be compiled */
	language: ResolverInputTypes["SupportedLanguage"]
};
	/** The result type if the code was compiled and executed successfully */
["ExecuteCodeOutput"]: AliasType<{
	/** The output of the code that was executed */
	output?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	/** The output object when executing code */
["ExecuteCodeResultUnion"]: AliasType<{
	ExecuteCodeOutput?:ResolverInputTypes["ExecuteCodeOutput"],
	ExecuteCodeError?:ResolverInputTypes["ExecuteCodeError"],
		__typename?: boolean | `@${string}`
}>;
	["InputCaseUnit"]: {
	dataType: ResolverInputTypes["TestCaseUnit"],
	data: string,
	/** The name of the variable to store it as */
	name: string
};
	/** The different errors that can occur when logging in to the service */
["LoginError"]:LoginError;
	/** The result type if an error was encountered when creating a new user */
["LoginUserError"]: AliasType<{
	/** The error encountered while logging in */
	error?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	/** The input object used to create a new user */
["LoginUserInput"]: {
	/** The email of the user */
	email: string,
	/** The password that the user wants to set */
	password: string
};
	/** The result type if the user was created successfully */
["LoginUserOutput"]: AliasType<{
	/** The unique JWT token to be issued */
	token?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	/** The output object when creating a new user */
["LoginUserResultUnion"]: AliasType<{
	LoginUserOutput?:ResolverInputTypes["LoginUserOutput"],
	LoginUserError?:ResolverInputTypes["LoginUserError"],
		__typename?: boolean | `@${string}`
}>;
	/** The GraphQL top-level mutation type */
["MutationRoot"]: AliasType<{
executeCode?: [{	input: ResolverInputTypes["ExecuteCodeInput"]},ResolverInputTypes["ExecuteCodeResultUnion"]],
registerUser?: [{	input: ResolverInputTypes["RegisterUserInput"]},ResolverInputTypes["RegisterUserResultUnion"]],
createClass?: [{	input: ResolverInputTypes["CreateClassInput"]},ResolverInputTypes["CreateClassResultUnion"]],
createQuestion?: [{	input: ResolverInputTypes["CreateQuestionInput"]},ResolverInputTypes["CreateQuestionResultUnion"]],
		__typename?: boolean | `@${string}`
}>;
	["OutputCaseUnit"]: {
	/** The type of data to store this line as */
	dataType: ResolverInputTypes["TestCaseUnit"],
	/** The data to store */
	data: string
};
	/** The GraphQL top-level query type */
["QueryRoot"]: AliasType<{
	/** Get a list of all the languages that the service supports. */
	supportedLanguages?:boolean | `@${string}`,
languageExample?: [{	language: ResolverInputTypes["SupportedLanguage"]},boolean | `@${string}`],
	/** Get information about the current user */
	userDetails?:ResolverInputTypes["UserDetailsResultUnion"],
userWithEmail?: [{	input: ResolverInputTypes["UserWithEmailInput"]},ResolverInputTypes["UserWithEmailResultUnion"]],
loginUser?: [{	input: ResolverInputTypes["LoginUserInput"]},ResolverInputTypes["LoginUserResultUnion"]],
	/** Logout a user from the service */
	logoutUser?:boolean | `@${string}`,
	/** Get all the types of test case units possible */
	testCaseUnits?:boolean | `@${string}`,
classDetails?: [{	classId: ResolverInputTypes["UUID"]},ResolverInputTypes["ClassDetailsResultUnion"]],
		__typename?: boolean | `@${string}`
}>;
	/** The result type if an error was encountered when creating a new user */
["RegisterUserError"]: AliasType<{
	/** whether the provided username is unique */
	usernameNotUnique?:boolean | `@${string}`,
	/** whether the provided email is unique */
	emailNotUnique?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	/** The input object used to create a new user */
["RegisterUserInput"]: {
	/** The username of the user */
	username: string,
	/** The email of the user */
	email: string,
	/** The password that the user wants to set */
	password: string,
	/** The type of account the user wants to create */
	accountType: ResolverInputTypes["AccountType"]
};
	/** The result type if the user was created successfully */
["RegisterUserOutput"]: AliasType<{
	/** The ID of the user */
	id?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	/** The output object when creating a new user */
["RegisterUserResultUnion"]: AliasType<{
	RegisterUserOutput?:ResolverInputTypes["RegisterUserOutput"],
	RegisterUserError?:ResolverInputTypes["RegisterUserError"],
		__typename?: boolean | `@${string}`
}>;
	["SupportedLanguage"]:SupportedLanguage;
	["TestCase"]: {
	/** The inputs related to this test case */
	inputs: Array<ResolverInputTypes["InputCaseUnit"]>,
	/** The outputs related to this test case */
	outputs: Array<ResolverInputTypes["OutputCaseUnit"]>
};
	["TestCaseUnit"]:TestCaseUnit;
	/** A UUID is a unique 128-bit number, stored as 16 octets. UUIDs are parsed as
Strings within GraphQL. UUIDs are used to assign unique identifiers to
entities without requiring a central allocating authority.

# References

* [Wikipedia: Universally Unique Identifier](http://en.wikipedia.org/wiki/Universally_unique_identifier)
* [RFC4122: A Universally Unique IDentifier (UUID) URN Namespace](http://tools.ietf.org/html/rfc4122) */
["UUID"]:unknown;
	/** The result type if details about the user were found successfully */
["UserDetailsOutput"]: AliasType<{
	/** Profile details about the user */
	profile?:ResolverInputTypes["UserProfileInformation"],
	/** The type of account the user has */
	accountType?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	/** The output object when creating a new user */
["UserDetailsResultUnion"]: AliasType<{
	UserDetailsOutput?:ResolverInputTypes["UserDetailsOutput"],
	ApiError?:ResolverInputTypes["ApiError"],
		__typename?: boolean | `@${string}`
}>;
	["UserProfileInformation"]: AliasType<{
	/** The email of the user */
	email?:boolean | `@${string}`,
	/** The username of the user */
	username?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	/** The result type if a user with the provided email was not found */
["UserWithEmailError"]: AliasType<{
	/** The error encountered while finding the user */
	error?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	/** The input object used to query for a user */
["UserWithEmailInput"]: {
	/** The email of the user */
	email: string
};
	/** The result type if the user was created successfully */
["UserWithEmailOutput"]: AliasType<{
	/** The unique ID of the user */
	id?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	/** The output object when finding a user with the provided email */
["UserWithEmailResultUnion"]: AliasType<{
	UserWithEmailOutput?:ResolverInputTypes["UserWithEmailOutput"],
	UserWithEmailError?:ResolverInputTypes["UserWithEmailError"],
		__typename?: boolean | `@${string}`
}>
  }

export type ModelTypes = {
    ["AccountType"]:AccountType;
	/** An error type with an attached field to tell what went wrong */
["ApiError"]: {
		/** The error describing what went wrong */
	error: string
};
	/** The result type if details about the class were found successfully */
["ClassDetailsOutput"]: {
		/** The name of the class */
	name: string
};
	/** The output object when getting details about a class */
["ClassDetailsResultUnion"]:ModelTypes["ClassDetailsOutput"] | ModelTypes["ApiError"];
	/** The input object used to create a new class */
["CreateClassInput"]: {
	/** The name of the class */
	name: string,
	/** The teachers who are teaching the class */
	teacherIds: Array<ModelTypes["UUID"]>
};
	/** The result type if the class was created successfully */
["CreateClassOutput"]: {
		/** The ID of the class */
	id: ModelTypes["UUID"]
};
	/** The output object when creating a new class */
["CreateClassResultUnion"]:ModelTypes["CreateClassOutput"] | ModelTypes["ApiError"];
	/** The input object used to create a new question */
["CreateQuestionInput"]: {
	/** The name/title of the question */
	name: string,
	/** The detailed text explaining the question */
	problem: string,
	/** The classes in which the question must be asked */
	classIds: Array<ModelTypes["UUID"]>,
	/** All the test cases that are related to this question */
	testCases: Array<ModelTypes["TestCase"]>
};
	/** The result type if the question was created successfully */
["CreateQuestionOutput"]: {
		/** The ID of the question */
	id: ModelTypes["UUID"]
};
	/** The output object when creating a new question */
["CreateQuestionResultUnion"]:ModelTypes["CreateQuestionOutput"] | ModelTypes["ApiError"];
	/** The result type if an error was encountered when executing code */
["ExecuteCodeError"]: {
		/** The error that occurred while compiling/executing the submitted code */
	error: string,
	/** The step in which the error the above error occurred */
	step: ModelTypes["ExecuteCodeErrorStep"]
};
	["ExecuteCodeErrorStep"]:ExecuteCodeErrorStep;
	/** The input object used to execute some code */
["ExecuteCodeInput"]: {
	/** The code input that needs to be compiled */
	code: string,
	/** The language that needs to be compiled */
	language: ModelTypes["SupportedLanguage"]
};
	/** The result type if the code was compiled and executed successfully */
["ExecuteCodeOutput"]: {
		/** The output of the code that was executed */
	output: string
};
	/** The output object when executing code */
["ExecuteCodeResultUnion"]:ModelTypes["ExecuteCodeOutput"] | ModelTypes["ExecuteCodeError"];
	["InputCaseUnit"]: {
	dataType: ModelTypes["TestCaseUnit"],
	data: string,
	/** The name of the variable to store it as */
	name: string
};
	["LoginError"]:LoginError;
	/** The result type if an error was encountered when creating a new user */
["LoginUserError"]: {
		/** The error encountered while logging in */
	error: ModelTypes["LoginError"]
};
	/** The input object used to create a new user */
["LoginUserInput"]: {
	/** The email of the user */
	email: string,
	/** The password that the user wants to set */
	password: string
};
	/** The result type if the user was created successfully */
["LoginUserOutput"]: {
		/** The unique JWT token to be issued */
	token: string
};
	/** The output object when creating a new user */
["LoginUserResultUnion"]:ModelTypes["LoginUserOutput"] | ModelTypes["LoginUserError"];
	/** The GraphQL top-level mutation type */
["MutationRoot"]: {
		/** Takes some code as input and compiles it to wasm before executing it */
	executeCode: ModelTypes["ExecuteCodeResultUnion"],
	/** Create a new user for the service */
	registerUser: ModelTypes["RegisterUserResultUnion"],
	/** Create a new class */
	createClass: ModelTypes["CreateClassResultUnion"],
	/** Create a new question */
	createQuestion: ModelTypes["CreateQuestionResultUnion"]
};
	["OutputCaseUnit"]: {
	/** The type of data to store this line as */
	dataType: ModelTypes["TestCaseUnit"],
	/** The data to store */
	data: string
};
	/** The GraphQL top-level query type */
["QueryRoot"]: {
		/** Get a list of all the languages that the service supports. */
	supportedLanguages: Array<ModelTypes["SupportedLanguage"]>,
	/** Get an example code snippet for a particular language */
	languageExample: string,
	/** Get information about the current user */
	userDetails: ModelTypes["UserDetailsResultUnion"],
	/** Check whether a user with the provided email exists in the service */
	userWithEmail: ModelTypes["UserWithEmailResultUnion"],
	/** Login a user to the service */
	loginUser: ModelTypes["LoginUserResultUnion"],
	/** Logout a user from the service */
	logoutUser: boolean,
	/** Get all the types of test case units possible */
	testCaseUnits: Array<ModelTypes["TestCaseUnit"]>,
	/** Get information about a class */
	classDetails: ModelTypes["ClassDetailsResultUnion"]
};
	/** The result type if an error was encountered when creating a new user */
["RegisterUserError"]: {
		/** whether the provided username is unique */
	usernameNotUnique: boolean,
	/** whether the provided email is unique */
	emailNotUnique: boolean
};
	/** The input object used to create a new user */
["RegisterUserInput"]: {
	/** The username of the user */
	username: string,
	/** The email of the user */
	email: string,
	/** The password that the user wants to set */
	password: string,
	/** The type of account the user wants to create */
	accountType: ModelTypes["AccountType"]
};
	/** The result type if the user was created successfully */
["RegisterUserOutput"]: {
		/** The ID of the user */
	id: ModelTypes["UUID"]
};
	/** The output object when creating a new user */
["RegisterUserResultUnion"]:ModelTypes["RegisterUserOutput"] | ModelTypes["RegisterUserError"];
	["SupportedLanguage"]:SupportedLanguage;
	["TestCase"]: {
	/** The inputs related to this test case */
	inputs: Array<ModelTypes["InputCaseUnit"]>,
	/** The outputs related to this test case */
	outputs: Array<ModelTypes["OutputCaseUnit"]>
};
	["TestCaseUnit"]:TestCaseUnit;
	/** A UUID is a unique 128-bit number, stored as 16 octets. UUIDs are parsed as
Strings within GraphQL. UUIDs are used to assign unique identifiers to
entities without requiring a central allocating authority.

# References

* [Wikipedia: Universally Unique Identifier](http://en.wikipedia.org/wiki/Universally_unique_identifier)
* [RFC4122: A Universally Unique IDentifier (UUID) URN Namespace](http://tools.ietf.org/html/rfc4122) */
["UUID"]:any;
	/** The result type if details about the user were found successfully */
["UserDetailsOutput"]: {
		/** Profile details about the user */
	profile: ModelTypes["UserProfileInformation"],
	/** The type of account the user has */
	accountType: ModelTypes["AccountType"]
};
	/** The output object when creating a new user */
["UserDetailsResultUnion"]:ModelTypes["UserDetailsOutput"] | ModelTypes["ApiError"];
	["UserProfileInformation"]: {
		/** The email of the user */
	email: string,
	/** The username of the user */
	username: string
};
	/** The result type if a user with the provided email was not found */
["UserWithEmailError"]: {
		/** The error encountered while finding the user */
	error: string
};
	/** The input object used to query for a user */
["UserWithEmailInput"]: {
	/** The email of the user */
	email: string
};
	/** The result type if the user was created successfully */
["UserWithEmailOutput"]: {
		/** The unique ID of the user */
	id: ModelTypes["UUID"]
};
	/** The output object when finding a user with the provided email */
["UserWithEmailResultUnion"]:ModelTypes["UserWithEmailOutput"] | ModelTypes["UserWithEmailError"]
    }

export type GraphQLTypes = {
    /** The types of accounts a user can create */
["AccountType"]: AccountType;
	/** An error type with an attached field to tell what went wrong */
["ApiError"]: {
	__typename: "ApiError",
	/** The error describing what went wrong */
	error: string
};
	/** The result type if details about the class were found successfully */
["ClassDetailsOutput"]: {
	__typename: "ClassDetailsOutput",
	/** The name of the class */
	name: string
};
	/** The output object when getting details about a class */
["ClassDetailsResultUnion"]:{
        	__typename:"ClassDetailsOutput" | "ApiError"
        	['...on ClassDetailsOutput']: '__union' & GraphQLTypes["ClassDetailsOutput"];
	['...on ApiError']: '__union' & GraphQLTypes["ApiError"];
};
	/** The input object used to create a new class */
["CreateClassInput"]: {
		/** The name of the class */
	name: string,
	/** The teachers who are teaching the class */
	teacherIds: Array<GraphQLTypes["UUID"]>
};
	/** The result type if the class was created successfully */
["CreateClassOutput"]: {
	__typename: "CreateClassOutput",
	/** The ID of the class */
	id: GraphQLTypes["UUID"]
};
	/** The output object when creating a new class */
["CreateClassResultUnion"]:{
        	__typename:"CreateClassOutput" | "ApiError"
        	['...on CreateClassOutput']: '__union' & GraphQLTypes["CreateClassOutput"];
	['...on ApiError']: '__union' & GraphQLTypes["ApiError"];
};
	/** The input object used to create a new question */
["CreateQuestionInput"]: {
		/** The name/title of the question */
	name: string,
	/** The detailed text explaining the question */
	problem: string,
	/** The classes in which the question must be asked */
	classIds: Array<GraphQLTypes["UUID"]>,
	/** All the test cases that are related to this question */
	testCases: Array<GraphQLTypes["TestCase"]>
};
	/** The result type if the question was created successfully */
["CreateQuestionOutput"]: {
	__typename: "CreateQuestionOutput",
	/** The ID of the question */
	id: GraphQLTypes["UUID"]
};
	/** The output object when creating a new question */
["CreateQuestionResultUnion"]:{
        	__typename:"CreateQuestionOutput" | "ApiError"
        	['...on CreateQuestionOutput']: '__union' & GraphQLTypes["CreateQuestionOutput"];
	['...on ApiError']: '__union' & GraphQLTypes["ApiError"];
};
	/** The result type if an error was encountered when executing code */
["ExecuteCodeError"]: {
	__typename: "ExecuteCodeError",
	/** The error that occurred while compiling/executing the submitted code */
	error: string,
	/** The step in which the error the above error occurred */
	step: GraphQLTypes["ExecuteCodeErrorStep"]
};
	/** The execution step in which an error was encountered */
["ExecuteCodeErrorStep"]: ExecuteCodeErrorStep;
	/** The input object used to execute some code */
["ExecuteCodeInput"]: {
		/** The code input that needs to be compiled */
	code: string,
	/** The language that needs to be compiled */
	language: GraphQLTypes["SupportedLanguage"]
};
	/** The result type if the code was compiled and executed successfully */
["ExecuteCodeOutput"]: {
	__typename: "ExecuteCodeOutput",
	/** The output of the code that was executed */
	output: string
};
	/** The output object when executing code */
["ExecuteCodeResultUnion"]:{
        	__typename:"ExecuteCodeOutput" | "ExecuteCodeError"
        	['...on ExecuteCodeOutput']: '__union' & GraphQLTypes["ExecuteCodeOutput"];
	['...on ExecuteCodeError']: '__union' & GraphQLTypes["ExecuteCodeError"];
};
	["InputCaseUnit"]: {
		dataType: GraphQLTypes["TestCaseUnit"],
	data: string,
	/** The name of the variable to store it as */
	name: string
};
	/** The different errors that can occur when logging in to the service */
["LoginError"]: LoginError;
	/** The result type if an error was encountered when creating a new user */
["LoginUserError"]: {
	__typename: "LoginUserError",
	/** The error encountered while logging in */
	error: GraphQLTypes["LoginError"]
};
	/** The input object used to create a new user */
["LoginUserInput"]: {
		/** The email of the user */
	email: string,
	/** The password that the user wants to set */
	password: string
};
	/** The result type if the user was created successfully */
["LoginUserOutput"]: {
	__typename: "LoginUserOutput",
	/** The unique JWT token to be issued */
	token: string
};
	/** The output object when creating a new user */
["LoginUserResultUnion"]:{
        	__typename:"LoginUserOutput" | "LoginUserError"
        	['...on LoginUserOutput']: '__union' & GraphQLTypes["LoginUserOutput"];
	['...on LoginUserError']: '__union' & GraphQLTypes["LoginUserError"];
};
	/** The GraphQL top-level mutation type */
["MutationRoot"]: {
	__typename: "MutationRoot",
	/** Takes some code as input and compiles it to wasm before executing it */
	executeCode: GraphQLTypes["ExecuteCodeResultUnion"],
	/** Create a new user for the service */
	registerUser: GraphQLTypes["RegisterUserResultUnion"],
	/** Create a new class */
	createClass: GraphQLTypes["CreateClassResultUnion"],
	/** Create a new question */
	createQuestion: GraphQLTypes["CreateQuestionResultUnion"]
};
	["OutputCaseUnit"]: {
		/** The type of data to store this line as */
	dataType: GraphQLTypes["TestCaseUnit"],
	/** The data to store */
	data: string
};
	/** The GraphQL top-level query type */
["QueryRoot"]: {
	__typename: "QueryRoot",
	/** Get a list of all the languages that the service supports. */
	supportedLanguages: Array<GraphQLTypes["SupportedLanguage"]>,
	/** Get an example code snippet for a particular language */
	languageExample: string,
	/** Get information about the current user */
	userDetails: GraphQLTypes["UserDetailsResultUnion"],
	/** Check whether a user with the provided email exists in the service */
	userWithEmail: GraphQLTypes["UserWithEmailResultUnion"],
	/** Login a user to the service */
	loginUser: GraphQLTypes["LoginUserResultUnion"],
	/** Logout a user from the service */
	logoutUser: boolean,
	/** Get all the types of test case units possible */
	testCaseUnits: Array<GraphQLTypes["TestCaseUnit"]>,
	/** Get information about a class */
	classDetails: GraphQLTypes["ClassDetailsResultUnion"]
};
	/** The result type if an error was encountered when creating a new user */
["RegisterUserError"]: {
	__typename: "RegisterUserError",
	/** whether the provided username is unique */
	usernameNotUnique: boolean,
	/** whether the provided email is unique */
	emailNotUnique: boolean
};
	/** The input object used to create a new user */
["RegisterUserInput"]: {
		/** The username of the user */
	username: string,
	/** The email of the user */
	email: string,
	/** The password that the user wants to set */
	password: string,
	/** The type of account the user wants to create */
	accountType: GraphQLTypes["AccountType"]
};
	/** The result type if the user was created successfully */
["RegisterUserOutput"]: {
	__typename: "RegisterUserOutput",
	/** The ID of the user */
	id: GraphQLTypes["UUID"]
};
	/** The output object when creating a new user */
["RegisterUserResultUnion"]:{
        	__typename:"RegisterUserOutput" | "RegisterUserError"
        	['...on RegisterUserOutput']: '__union' & GraphQLTypes["RegisterUserOutput"];
	['...on RegisterUserError']: '__union' & GraphQLTypes["RegisterUserError"];
};
	["SupportedLanguage"]: SupportedLanguage;
	["TestCase"]: {
		/** The inputs related to this test case */
	inputs: Array<GraphQLTypes["InputCaseUnit"]>,
	/** The outputs related to this test case */
	outputs: Array<GraphQLTypes["OutputCaseUnit"]>
};
	["TestCaseUnit"]: TestCaseUnit;
	/** A UUID is a unique 128-bit number, stored as 16 octets. UUIDs are parsed as
Strings within GraphQL. UUIDs are used to assign unique identifiers to
entities without requiring a central allocating authority.

# References

* [Wikipedia: Universally Unique Identifier](http://en.wikipedia.org/wiki/Universally_unique_identifier)
* [RFC4122: A Universally Unique IDentifier (UUID) URN Namespace](http://tools.ietf.org/html/rfc4122) */
["UUID"]: "scalar" & { name: "UUID" };
	/** The result type if details about the user were found successfully */
["UserDetailsOutput"]: {
	__typename: "UserDetailsOutput",
	/** Profile details about the user */
	profile: GraphQLTypes["UserProfileInformation"],
	/** The type of account the user has */
	accountType: GraphQLTypes["AccountType"]
};
	/** The output object when creating a new user */
["UserDetailsResultUnion"]:{
        	__typename:"UserDetailsOutput" | "ApiError"
        	['...on UserDetailsOutput']: '__union' & GraphQLTypes["UserDetailsOutput"];
	['...on ApiError']: '__union' & GraphQLTypes["ApiError"];
};
	["UserProfileInformation"]: {
	__typename: "UserProfileInformation",
	/** The email of the user */
	email: string,
	/** The username of the user */
	username: string
};
	/** The result type if a user with the provided email was not found */
["UserWithEmailError"]: {
	__typename: "UserWithEmailError",
	/** The error encountered while finding the user */
	error: string
};
	/** The input object used to query for a user */
["UserWithEmailInput"]: {
		/** The email of the user */
	email: string
};
	/** The result type if the user was created successfully */
["UserWithEmailOutput"]: {
	__typename: "UserWithEmailOutput",
	/** The unique ID of the user */
	id: GraphQLTypes["UUID"]
};
	/** The output object when finding a user with the provided email */
["UserWithEmailResultUnion"]:{
        	__typename:"UserWithEmailOutput" | "UserWithEmailError"
        	['...on UserWithEmailOutput']: '__union' & GraphQLTypes["UserWithEmailOutput"];
	['...on UserWithEmailError']: '__union' & GraphQLTypes["UserWithEmailError"];
}
    }
/** The types of accounts a user can create */
export const enum AccountType {
	STUDENT = "STUDENT",
	TEACHER = "TEACHER"
}
/** The execution step in which an error was encountered */
export const enum ExecuteCodeErrorStep {
	COMPILATION_TO_WASM = "COMPILATION_TO_WASM",
	WASM_EXECUTION = "WASM_EXECUTION"
}
/** The different errors that can occur when logging in to the service */
export const enum LoginError {
	CREDENTIALS_MISMATCH = "CREDENTIALS_MISMATCH"
}
export const enum SupportedLanguage {
	rust = "rust",
	go = "go",
	cpp = "cpp"
}
export const enum TestCaseUnit {
	EMPTY = "EMPTY",
	NUMBER = "NUMBER",
	STRING = "STRING",
	NUMBER_COLLECTION = "NUMBER_COLLECTION",
	STRING_COLLECTION = "STRING_COLLECTION"
}

type ZEUS_VARIABLES = {
	["AccountType"]: ValueTypes["AccountType"];
	["CreateClassInput"]: ValueTypes["CreateClassInput"];
	["CreateQuestionInput"]: ValueTypes["CreateQuestionInput"];
	["ExecuteCodeErrorStep"]: ValueTypes["ExecuteCodeErrorStep"];
	["ExecuteCodeInput"]: ValueTypes["ExecuteCodeInput"];
	["InputCaseUnit"]: ValueTypes["InputCaseUnit"];
	["LoginError"]: ValueTypes["LoginError"];
	["LoginUserInput"]: ValueTypes["LoginUserInput"];
	["OutputCaseUnit"]: ValueTypes["OutputCaseUnit"];
	["RegisterUserInput"]: ValueTypes["RegisterUserInput"];
	["SupportedLanguage"]: ValueTypes["SupportedLanguage"];
	["TestCase"]: ValueTypes["TestCase"];
	["TestCaseUnit"]: ValueTypes["TestCaseUnit"];
	["UUID"]: ValueTypes["UUID"];
	["UserWithEmailInput"]: ValueTypes["UserWithEmailInput"];
}