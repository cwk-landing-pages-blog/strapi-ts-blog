/**
 *cwk-user from token router
 */

export default {
  routes: [
    {
      method: "GET",
      path: "/iktisat-user/me",
      handler: "iktisat-user.find",
      config: {
        middlewares: ["api::iktisat-user.auth-iktisat-user"],
      },
    },
    {
      method: "POST",
      path: "/iktisat-user/auth-with-token",
      handler: "iktisat-user.authWithToken",
      config: {
        middlewares: ["api::iktisat-user.auth-iktisat-user"],
      },
    },
    {
      method: "POST",
      path: "/iktisat-user-update",
      handler: "iktisat-user.updateUser",
      config: {
        middlewares: ["api::iktisat-user.auth-iktisat-user"],
      },
    },
  ],
};
