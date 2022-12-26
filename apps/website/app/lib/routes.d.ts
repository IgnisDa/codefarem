declare module "routes-gen" {
  export type RouteParams = {
    "/": Record<string, never>;
    "/questions/:choice-action": { "choice": string };
    "/information/toolchain": Record<string, never>;
    "/questions/solve/:slug": { "slug": string };
    "/playground": Record<string, never>;
    "/classes/create": Record<string, never>;
    "/questions/list": Record<string, never>;
    "/auth/logout": Record<string, never>;
    "/classes/:id": { "id": string };
    "/auth": Record<string, never>;
  };

  export function route<
    T extends
      | ["/"]
      | ["/questions/:choice-action", RouteParams["/questions/:choice-action"]]
      | ["/information/toolchain"]
      | ["/questions/solve/:slug", RouteParams["/questions/solve/:slug"]]
      | ["/playground"]
      | ["/classes/create"]
      | ["/questions/list"]
      | ["/auth/logout"]
      | ["/classes/:id", RouteParams["/classes/:id"]]
      | ["/auth"]
  >(...args: T): typeof args[0];
}
