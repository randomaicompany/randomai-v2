export default ({ line_items }) =>
  line_items.filter((item) => item.properties.length > 0).length > 0;
