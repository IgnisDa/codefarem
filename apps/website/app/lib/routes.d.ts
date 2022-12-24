declare module "routes-gen" {
  export type RouteParams = {
    "/questions/create-or-update": Record<string, never>;
    "/information/toolchain": Record<string, never>;
    "/questions/solve/:slug": { "slug": string };
    "/playground": Record<string, never>;
    "/classes/create": Record<string, never>;
    "/questions/list": Record<string, never>;
    "/classes/:id": { "id": string };
    "/": Record<string, never>;
    "/auth": Record<string, never>;
    "/auth/logout": Record<string, never>;
  };

  export function route<
    T extends
      | ["/questions/create-or-update"]
      | ["/information/toolchain"]
      | ["/questions/solve/:slug", RouteParams["/questions/solve/:slug"]]
      | ["/playground"]
      | ["/classes/create"]
      | ["/questions/list"]
      | ["/classes/:id", RouteParams["/classes/:id"]]
      | ["/"]
      | ["/auth"]
      | ["/auth/logout"]
  >(...args: T): typeof args[0];
}
