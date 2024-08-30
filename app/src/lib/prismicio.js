import * as prismic from "@prismicio/client";
import { enableAutoPreviews } from "@prismicio/svelte/kit";
import config from "root/slicemachine.config.json";

export const repositoryName = config.repositoryName;

const routes = [
  {
    type: "page",
    path: "/:uid",
  },

  {
    type: "blog_hub",
    path: "/:uid",
  },

  {
    type: "product",
    path: "/products/:uid",
  },

  {
    type: "collection",
    path: "/collection/:uid",
  },
];

export const createClient = ({ cookies, ...config } = {}) => {
  const client = prismic.createClient(repositoryName, {
    routes,
    ...config,
  });

  enableAutoPreviews({ client, cookies });
  return client;
};
