/**
 * iktisat-user controller
 */

import { factories } from "@strapi/strapi";
import { checkToken } from "../middlewares/auth-iktisat-user";

export default factories.createCoreController(
  "api::iktisat-user.iktisat-user",
  ({ strapi }) => ({
    // find logged in user by token
    async find(ctx: any) {
      const timeNow = new Date().getTime();

      if (ctx.response && ctx.response.header) {
        const token = ctx.request.header.authorization;
        const userData = checkToken(token, timeNow);
        try {
          const entry = await strapi.entityService.findMany(
            "api::iktisat-user.iktisat-user",
            {
              filters: { email: { $eq: userData.email } },
            }
          );
          ctx.body = {
            user: entry[0],
            message: "This Is Me @iktisat-users",
          };
          return entry;
        } catch (err) {
          return (ctx.body = err);
        }
      }
    },

    // update iktisat user
    async updateUser(ctx) {
      const timeNow = new Date().getTime();

      if (ctx.response && ctx.response.header) {
        const stripe_customer_id = ctx.request.body as {
          stripe_customer_id: string;
        };

        const token = ctx.request.header.authorization;
        const userData = checkToken(token, timeNow);

        const existingEntry = await strapi.entityService.findMany(
          "api::iktisat-user.iktisat-user",
          {
            filters: { email: { $eq: userData.email } },
          }
        );

        const currentEntry = existingEntry[0];
        const id = Number(currentEntry.id);

        const entry = await strapi.entityService.update(
          "api::iktisat-user.iktisat-user",
          id,
          {
            data: {
              stripe_customer_id: stripe_customer_id.stripe_customer_id,
            },
          }
        );
      }
      ctx.response.status = 401;
      return (ctx.body = {
        message: "You are not authorized 🤷‍♂️ update",
      });
    },

    // login with google from next auth token
    async authWithToken(ctx) {
      const timeNow = new Date().getTime();

      if (ctx.response && ctx.response.header) {
        const stripe_customer_id = ctx.request.body;
        const token = ctx.request.header.authorization;
        const userData = checkToken(token, timeNow);

        const entry = await strapi.entityService.findMany(
          "api::iktisat-user.iktisat-user",
          {
            filters: { email: { $eq: userData.email } },
          }
        );
        // check if user already exists
        if (entry.length) {
          // user already exist in iktisat-users

          ctx.body = {
            user: entry[0],
            message: "User already exists",
          };
          return entry[0];
        } else {
          const entry = await strapi.entityService.create(
            "api::iktisat-user.iktisat-user",
            {
              data: {
                email: userData?.email,
                full_name: userData?.name,
                img_url: userData?.picture,
              },
            }
          );
          ctx.body = {
            user: entry[0],
            message: "User created",
          };
        }
      }
      ctx.response.status = 401;
      return (ctx.body = {
        message: "You are not authorized 🤷‍♂️",
      });
    },

    // delete account(soft delete)
  })
);
