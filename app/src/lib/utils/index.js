export const extractScriptsFromHTML = (htmlString) => {
  const container = document.createElement("div");
  container.innerHTML = htmlString;

  return Array.from(container.querySelectorAll("script")).map((scriptNode) => {
    const newScriptNode = document.createElement("script");
    Object.values(scriptNode.attributes).forEach(
      ({ name }) => (newScriptNode[name] = scriptNode[name])
    );
    newScriptNode.innerHTML = scriptNode.innerHTML;
    return newScriptNode;
  });
};
