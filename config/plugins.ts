module.exports = ({ env }) => ({
  seo: {
    enabled: true,
  },
  // graphql: {
  //   config: {
  //     endpoint: '/graphql',
  //     shadowCRUD: true,
  //     playgroundAlways: true,
  //     depthLimit: 10,
  //     amountLimit: 100,
  //     apolloServer: {
  //       tracing: false,
  //       introspection: true,
  //     },
  //   },
  // },

  upload: {
    config: {
      provider: "aws-s3",
      providerOptions: {
        // baseUrl: env('CDN_URL'),
        // rootPath: env('CDN_ROOT_PATH'),
        s3Options: {
          accessKeyId: env("AWS_ACCESS_KEY_ID"),
          secretAccessKey: env("AWS_ACCESS_SECRET"),
          region: env("AWS_REGION", "eu-south-1"),
          params: {
            ACL: env("AWS_ACL", "public-read"),
            signedUrlExpires: env("AWS_SIGNED_URL_EXPIRES", 15 * 60),
            Bucket: env("AWS_BUCKET", "strapi-cwk"),
          },
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
  "strapi-google-auth": {
    enabled: true,
  },
});
