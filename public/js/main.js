// custom client side js goes here
import { exampleServiceStart } from "./example.js";
import { renderClientServices } from "./torrentTable.js";

if (window.location.pathname === "/traversy") {
   exampleServiceStart();
}

if (window.location.pathname === "/torrents/dashboard") {
   renderClientServices();
}
