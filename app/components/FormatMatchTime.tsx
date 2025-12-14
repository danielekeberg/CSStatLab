export function formatMatchTime(iso: string): string {
    const now = new Date();
    const date = new Date(iso);

    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24)
    if(diffSec < 60) {
        return "Just now";
    }
    if(diffMin < 60) {
        return `${diffMin} minute${diffMin !== 1 ? "s" : ""} ago`;
    }
    if(diffHr < 24) {
        return `${diffHr} hour${diffHr !== 1 ? "s" : ""} ago`;
    }
    if(diffDays < 10) {
        return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    }

    return date.toLocaleDateString("no-NO")
}