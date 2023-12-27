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
        if (entry) {
          ctx.response.status = 200;
          return (ctx.body = {
            message: "User Updated",
          });
        }
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
          const currentProfile = await strapi.entityService.findMany(
            "api::iktisat-profile.iktisat-profile",
            {
              filters: {
                iktisat_user: entry[0].id,
              },
            }
          );
          if (currentProfile) {
            ctx.body = {
              user: entry[0],
              profileId: currentProfile[0].id,
              message: "User already exists",
            };
          } else {
            ctx.body = {
              user: entry[0],
              profileId: null,
              message: "User already exists",
            };
          }
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
          console.log(
            "🚀 ~ file: iktisat-user.ts:108 ~ authWithToken ~ entry:",
            entry
          );

          // user created => create profile
          const profile = await strapi.entityService.create(
            "api::iktisat-profile.iktisat-profile",
            {
              data: {
                iktisat_user: entry.id,
              },
            }
          );
          if (profile) {
            ctx.body = {
              user: entry[0],
              message: "User created",
              profileId: profile.id,
            };
          } else {
            ctx.body = {
              user: entry[0],
              message: "User created",
              profileId: null,
            };
          }
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
