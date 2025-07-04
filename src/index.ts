// Select the div element with id "app"
const app = document.getElementById("app");

// Create a new paragraph element
const p = document.createElement("p");

// Set the text content of the paragraph
p.textContent = "Hello, TypeScript!";

// Append the paragraph to the div
app?.appendChild(p);
