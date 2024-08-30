import fetch from "node-fetch";
import * as prismic from "@prismicio/client";

const repoName = "randomai-10";
const accessToken = process.env.PRISMIC_TOKEN;

const routes = [];

export default prismic.createClient(repoName, {
  fetch,
  accessToken,
  routes,
});
