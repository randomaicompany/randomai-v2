import { config } from "dotenv";
config();

import * as R from "ramda";

import Parser from "rss-parser";
import prismic from "./libs/prismic.js";

import { load } from "cheerio";
import { firestore } from "./libs/firebase.js";
import { onRequest } from "firebase-functions/v2/https";
import { asImageSrc, asLink, asText } from "@prismicio/client";
import { logger } from "firebase-functions";
import { onSchedule } from "firebase-functions/v2/scheduler";

const parser = new Parser();

export const status = onRequest((_, res) => {
  res.send("ok");
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const formatRssSliceData = R.map(
  R.pipe(
    R.prop("primary"),
    R.evolve({
      heading: asText,
      subtext: asText,
      source_rss: asLink,
      source_logo: asImageSrc,
    })
  )
);

const pluckItemHTML = (item) => {
  const content = R.propOr("content", "content:encoded", item);
  const $ = load(content);
  const _image = $("img:first").get(0)?.attribs.src;
  const image = R.defaultTo(null, _image);

  //

  return {
    image,
    link: item.link,
    guid: item.guid,
    title: item.title,
    content: item.content,
    creator: item.creator,
    pubDate: item.pubDate,
    categories: item.categories,
  };
};

const fetchRSSFeed = async (data, idx) => {
  const { source_rss } = data;
  try {
    const feed = await parser.parseURL(source_rss);
    const feedItems = R.prop("items", feed);
    return R.map(pluckItemHTML, feedItems);
  } catch (error) {
    return [];
  }
};

const deleteCollection = async (name) => {
  const collectionRef = firestore.collection(name);
  const snapshot = await collectionRef.get();

  const batch = firestore.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
};

const fetchAndSaveRSS = async () => {
  try {
    logger.log("[Deleting] Empyting collection");
    await deleteCollection("rss");

    logger.log("[Fetching] PRISMIC DOCUMENT for slices & feed source");
    const page = await prismic.getSingle("blog_hub");
    const slices = R.path(["data", "slices"], page);
    const rssSlices = R.filter(R.propEq("rss_block", "slice_type"), slices);
    const rssData = formatRssSliceData(rssSlices);

    if (R.isEmpty(rssData)) return;

    const rssFetchList = R.addIndex(R.map)(async (data, idx) => {
      logger.log(`[${idx}] [Fetching] RSS Feed data from, ${data.source_name}`);
      const items = await fetchRSSFeed(data, idx);

      const body = { name: data.source_name, logo: data.source_logo, items };
      await sleep(100 * idx);
      await firestore
        .collection("rss")
        .doc(data.source_name)
        .set(body, { merge: true });

      logger.log("Ends of iteration");
      await sleep(2000 * idx);
      return body;
    }, rssData);

    return await Promise.all(rssFetchList);
  } catch (error) {
    logger.error(error, { structuredData: true });
  }
};

export const refreshRSSFeed = onSchedule(
  {
    schedule: "0 * * * *", // Runs every hour
    timeoutSeconds: 60, // Function timeout configuration
  },
  async (event) => {
    try {
      await fetchAndSaveRSS();
    } catch (error) {
      console.error("Error fetching and saving RSS feed:", error);
    }
  }
);
