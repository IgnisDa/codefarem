declare module "routes-gen" {
  export type RouteParams = {
    "/api/searchQuestion": Record<string, never>;
    "/": Record<string, never>;
    "/questions/:choice-action": { "choice": string };
    "/classes/:choice-action": { "choice": string };
    "/information/toolchain": Record<string, never>;
    "/questions/solve/:slug": { "slug": string };
    "/playground": Record<string, never>;
    "/questions": Record<string, never>;
    "/classes": Record<string, never>;
    "/auth/logout": Record<string, never>;
    "/classes/:id": { "id": string };
    "/auth": Record<string, never>;
  };

  export function route<
    T extends
      | ["/api/searchQuestion"]
      | ["/"]
      | ["/questions/:choice-action", RouteParams["/questions/:choice-action"]]
      | ["/classes/:choice-action", RouteParams["/classes/:choice-action"]]
      | ["/information/toolchain"]
      | ["/questions/solve/:slug", RouteParams["/questions/solve/:slug"]]
      | ["/playground"]
      | ["/questions"]
      | ["/classes"]
      | ["/auth/logout"]
      | ["/classes/:id", RouteParams["/classes/:id"]]
      | ["/auth"]
  >(...args: T): typeof args[0];
}
