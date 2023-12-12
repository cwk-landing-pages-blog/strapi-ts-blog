/**
 * `auth-cwk-user` middleware
 */

import { Strapi } from "@strapi/strapi";
import jwt_decode, { JwtPayload } from "jwt-decode";

interface IJwtPayload extends JwtPayload {
  email?: string;
  name?: string;
  picture?: string;
}

export const checkToken = (token: string, date) => {
  const decoded: IJwtPayload = jwt_decode(token);

  // ! we will not check if the token has expired because the next auth google is not checking now TODO in future
  // if (decoded.exp < date / 1000) {
  //   return {
  //     isExpired: true,
  //     email: decoded.email,
  //   };
  // } else {
  //   return {
  //     isExpired: false,
  //     email: decoded.email,
  //   };
  // }
  return decoded;
};

export default (config, { strapi }: { strapi: Strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    if (ctx.request && ctx.request.header && ctx.request.header.authorization) {
      try {
        const token = ctx.request.header.authorization;
        if (token) {
          const timeNow = new Date().getTime();
          const tokenDetails = checkToken(token, timeNow);
          await next(ctx);
        } else {
          return (ctx.response.status = 401);
        }
      } catch (err) {
        ctx.response.status = 401;
        return (ctx.body = err);
      }
    } else {
      return (ctx.response.status = 401);
    }
  };
};
