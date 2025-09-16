import * as R from "ramda";
import * as RA from "ramda-adjunct";
import { json, error } from "@sveltejs/kit";
import { firestore } from "root/src/lib/firebase-admin.js";

export async function GET() {
  const response = await firestore.collection("rss").get();
  const docs = R.map(
    (doc) => doc.exists && { id: doc.id, ...doc.data() },
    response.docs
  );
  const data = RA.compact(docs);
  return json(data);
}
