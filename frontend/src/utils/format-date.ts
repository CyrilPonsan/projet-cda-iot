export function formatDateTime(dateTime: string) {
  const date = new Date(dateTime).toLocaleDateString();
  const time = new Date(dateTime).toLocaleTimeString();
  return { date, time };
}
