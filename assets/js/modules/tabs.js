export function initTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-text");

  if (!tabButtons.length) return;

  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      const target = button.dataset.tab;

      tabButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      tabContents.forEach(content => {
        content.classList.toggle(
          "active",
          content.dataset.tabContent === target
        );
      });
    });
  });
}
