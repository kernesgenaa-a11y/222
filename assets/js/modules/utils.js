export function addEventOnElements(elements, eventType, callback) {
  elements.forEach(el => el.addEventListener(eventType, callback));
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}
