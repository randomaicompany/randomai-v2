export default (storeId, shopifyOrderPayload) => {
  const payload = shopifyOrderPayload;
  const address = payload?.customer?.default_address || {};

  const lineItems = payload?.line_items?.map((item) => {
    const skus = item.sku.split("_");
    const customAttributes = item?.properties || [];
    const quantity = item?.quantity || 1;

    let templateId = skus[0] || null;
    let variantId = skus[1] || null;

    if (templateId) {
      templateId = Number(templateId);
    }

    if (variantId) {
      variantId = Number(variantId);
    }

    const files =
      customAttributes.map((prop) => ({
        type: prop?.name,
        url: prop?.value,
      })) || [];

    return {
      templateId,
      variantId,
      quantity,
      files,
    };
  });

  const cleanedLineItems = lineItems.filter(
    (item) => item.templateId && item.variantId && item.files.length > 0
  );

  return {
    store_id: storeId,
    external_id: payload?.id,
    recipient: {
      zip: address.zip,
      name: address.name,
      city: address.city,
      country: address.country_code,
      address1: address.address1,
      state_code: address.province_code,
    },

    items: cleanedLineItems.map((item) => ({
      quantity: item.quantity,
      variant_id: item.variantId,
      template_id: item.templateId,
      files: item.files,
    })),
  };
};
