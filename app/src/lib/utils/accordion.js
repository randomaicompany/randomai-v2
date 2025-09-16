export const accordion = (node, isOpen) => {
  const initialHeight = node.offsetHeight;

  node.style.height = isOpen ? "auto" : 0;
  node.style.overflow = "hidden";

  return {
    update(isOpen) {
      let animation = node.animate(
        [
          {
            height: initialHeight + "px",
            overflow: "hidden"
          },
          {
            height: 0,
            overflow: "hidden"
          }
        ],
        { duration: 150, fill: "both", easing: "ease-in-out" }
      );
      animation.pause();
      if (!isOpen) {
        animation.play();
      } else {
        animation.reverse();
      }
    }
  };
};
