import { json } from "@sveltejs/kit";
import { PRINTFUL_STORE_ID } from "$env/static/private";

import upscalePrintFiles from "$lib/api/printful/upscalePrintFiles";
import buildPrintfulPayload from "$lib/api/printful/buildPrintfulPayload";
import checkIfHasCustomProps from "$lib/api/printful/checkIfHasCustomProps";
import createOrderInPrintful from "$lib/api/printful/createOrderInPrintful";
import getAllPrintfulTemplates from "$lib/api/printful/getAllPrintfulTemplates";

export async function GET() {
  const response = await getAllPrintfulTemplates();
  return json(response, { status: 200 });
}

const webhookHandler = async (data) => {
  try {
    const payload = data;

    const storeId = PRINTFUL_STORE_ID;
    console.log("Webhook Trigger triggered.");
    const hasCustomProperties = checkIfHasCustomProps(payload);

    if (!hasCustomProperties) {
      console.log("Ingored - does not have AI product to push to Printful .");
      return;
    }

    const printfulPayload = buildPrintfulPayload(storeId, payload);
    const upscaledPayload = await upscalePrintFiles(printfulPayload);
    await createOrderInPrintful(upscaledPayload);

    console.log("Webhook Completed.");
    return;
  } catch (err) {
    console.error(err);
    console.log("Error with Webhook Completed.");
    return;
  }
};

export async function POST({ request }) {
  const payload = await request.json();
  webhookHandler(payload);
  return json({}, { status: 200 });
}
