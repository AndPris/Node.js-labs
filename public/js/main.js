// Selectors
const standardTheme = document.querySelector(".standard-theme");
const lightTheme = document.querySelector(".light-theme");
const darkerTheme = document.querySelector(".darker-theme");

standardTheme.addEventListener("click", () => changeTheme("standard"));
lightTheme.addEventListener("click", () => changeTheme("light"));
darkerTheme.addEventListener("click", () => changeTheme("darker"));

// Check if one theme has been set previously and apply it (or std theme if not found):
let savedTheme = localStorage.getItem("savedTheme");
savedTheme === null
  ? changeTheme("standard")
  : changeTheme(localStorage.getItem("savedTheme"));

// Update the changeTheme function
function changeTheme(color) {
  localStorage.setItem("savedTheme", color);
  savedTheme = localStorage.getItem("savedTheme");

  document.body.className = color;

  // Change blinking cursor for darker theme
  color === "darker"
    ? document.getElementById("title").classList.add("darker-title")
    : document.getElementById("title").classList.remove("darker-title");

  input = document.querySelector("input")
  if (input) input.className = `${color}-input`;

  // Change buttons color according to their type (todo, check or delete)
  document.querySelectorAll("button").forEach((button) => {
    Array.from(button.classList).some((item) => {
      if (item === "todo-btn") {
        button.className = `todo-btn ${color}-button`;
      }
    });
  });

  // Change author links color
  document.querySelectorAll(".author-link").forEach((link) => {
    link.classList.remove(
      "standard-authors-link",
      "light-authors-link",
      "darker-authors-link"
    );
    link.classList.add(`${color}-authors-link`);
  });

  document.querySelectorAll(".description").forEach((link) => {
    link.classList.remove(
      "standard-description",
      "light-description",
      "darker-description"
    );
    link.classList.add(`${color}-description`);
  });
}
