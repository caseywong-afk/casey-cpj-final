// Toggle the grid overlay with the G key.
// This is useful while you are editing the layout in VS Code.

const grid = document.querySelector(".grid-overlay");

window.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "g") {
    grid.classList.toggle("is-hidden");
  }
});
