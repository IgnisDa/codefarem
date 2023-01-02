declare module "routes-gen" {
  export type RouteParams = {
    "/api/randomProfileAvatar": Record<string, never>;
    "/": Record<string, never>;
    "/information/toolchain": Record<string, never>;
    "/playground": Record<string, never>;
    "/questions/:choice-action": { "choice": string };
    "/classes/:choice-action": { "choice": string };
    "/questions/solve/:slug": { "slug": string };
    "/questions": Record<string, never>;
    "/classes": Record<string, never>;
    "/profile": Record<string, never>;
    "/classes/:id": { "id": string };
    "/auth/logout": Record<string, never>;
    "/auth": Record<string, never>;
  };

  export function route<
    T extends
      | ["/api/randomProfileAvatar"]
      | ["/"]
      | ["/information/toolchain"]
      | ["/playground"]
      | ["/questions/:choice-action", RouteParams["/questions/:choice-action"]]
      | ["/classes/:choice-action", RouteParams["/classes/:choice-action"]]
      | ["/questions/solve/:slug", RouteParams["/questions/solve/:slug"]]
      | ["/questions"]
      | ["/classes"]
      | ["/profile"]
      | ["/classes/:id", RouteParams["/classes/:id"]]
      | ["/auth/logout"]
      | ["/auth"]
  >(...args: T): typeof args[0];
}
