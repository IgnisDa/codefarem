declare module "routes-gen" {
  export type RouteParams = {
    "/questions/solve/:slug/:lang": { "slug": string, "lang": string };
    "/questions/solve/:slug": { "slug": string };
    "/playground/:lang": { "lang": string };
    "/questions/create": Record<string, never>;
    "/classes/create": Record<string, never>;
    "/questions/list": Record<string, never>;
    "/classes/:id": { "id": string };
    "/": Record<string, never>;
    "/auth": Record<string, never>;
    "/auth/logout": Record<string, never>;
  };

  export function route<
    T extends
      | ["/questions/solve/:slug/:lang", RouteParams["/questions/solve/:slug/:lang"]]
      | ["/questions/solve/:slug", RouteParams["/questions/solve/:slug"]]
      | ["/playground/:lang", RouteParams["/playground/:lang"]]
      | ["/questions/create"]
      | ["/classes/create"]
      | ["/questions/list"]
      | ["/classes/:id", RouteParams["/classes/:id"]]
      | ["/"]
      | ["/auth"]
      | ["/auth/logout"]
  >(...args: T): typeof args[0];
}
