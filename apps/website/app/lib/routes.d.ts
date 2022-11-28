declare module "routes-gen" {
  export type RouteParams = {
    "/questions/solve/:slug/:lang": { "slug": string, "lang": string };
    "/playground/:lang": { "lang": string };
    "/questions/create": Record<string, never>;
    "/classes/create": Record<string, never>;
    "/classes/:id": { "id": string };
    "/": Record<string, never>;
    "/auth": Record<string, never>;
    "/auth/register": Record<string, never>;
    "/auth/logout": Record<string, never>;
    "/auth/login": Record<string, never>;
  };

  export function route<
    T extends
      | ["/questions/solve/:slug/:lang", RouteParams["/questions/solve/:slug/:lang"]]
      | ["/playground/:lang", RouteParams["/playground/:lang"]]
      | ["/questions/create"]
      | ["/classes/create"]
      | ["/classes/:id", RouteParams["/classes/:id"]]
      | ["/"]
      | ["/auth"]
      | ["/auth/register"]
      | ["/auth/logout"]
      | ["/auth/login"]
  >(...args: T): typeof args[0];
}
