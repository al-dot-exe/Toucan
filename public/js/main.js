// custom client side js goes here
import { exampleServiceStart } from "./example.js";
import { renderDashboardServices } from "./torrentTable.js";

if (window.location.pathname === "/traversy") {
   exampleServiceStart();
}

if (window.location.pathname === "/torrents/dashboard" ||
   window.location.pathname === "/torrents/seeding" ||
   window.location.pathname === "/torrents/leeching") {
   renderDashboardServices();
}
