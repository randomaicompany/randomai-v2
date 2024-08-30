import { addToCart } from "root/src/lib/stores/cart"; // makes me sick but I need to do this -refactor later

export const addToCartWithProps = (data, quantity) => {
  const attributes = [
    {
      key: "front",
      value: data.frontImageUrl,
    },

    {
      key: "back",
      value: data.backImageUrl,
    },
  ];

  const compactAttributes = attributes.filter(({ value }) => !!value);

  return addToCart(data.admin_graphql_api_id, quantity, compactAttributes);
};
