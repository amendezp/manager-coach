export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function getRelativeTime(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
}

export function getAccentClass(
  templateData: Record<string, unknown> | null
): string {
  const color = templateData?.color as string;
  if (color) return color;
  const iconName = (templateData?.icon as string) || "";
  const map: Record<string, string> = {
    clipboard: "accent-green",
    users: "accent-blue",
    alert: "accent-red",
    dollar: "accent-teal",
    book: "accent-teal",
    ear: "accent-red",
    lightbulb: "accent-amber",
    shield: "accent-amber",
    academic: "accent-violet",
    chat: "accent-blue",
    pencil: "accent-violet",
  };
  return map[iconName] || "accent-green";
}
