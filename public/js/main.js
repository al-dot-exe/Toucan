// custom client side js goes here
import { startDashboardServices } from "./torrentTable.js";

if (window.location.pathname === "/torrents/dashboard" ||
   window.location.pathname === "/torrents/seeding" ||
   window.location.pathname === "/torrents/leeching") {
   startDashboardServices();
}
