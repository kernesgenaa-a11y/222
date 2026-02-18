import { initNavigation } from "./modules/navigation.js";
import { initPreloader, initScrollEffects } from "./modules/ui-effects.js";
import { initTabs } from "./modules/tabs.js";
import { initCallBanner } from "./modules/call-banner.js";
import { loadNews } from "./modules/news.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initPreloader();
  initScrollEffects();
  initTabs();
  initCallBanner();
  loadNews();
});
