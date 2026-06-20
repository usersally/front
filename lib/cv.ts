/** Whether stored CV value is viewable (base64 data URL). */
export function isViewableCv(raw?: string | null): boolean {
  if (!raw || raw === "pending" || raw.trim() === "") return false;
  return raw.startsWith("data:");
}

/** Resolve CV for iframe/img src, or null when not viewable. */
export function resolveCvSrc(raw?: string | null): string | null {
  if (!isViewableCv(raw)) return null;
  return raw!.trim();
}

/** Human-readable label when CV cannot be previewed. */
export function cvUnavailableMessage(raw?: string | null): string {
  if (!raw || raw === "pending" || raw.trim() === "") {
    return "No CV uploaded.";
  }
  if (!raw.startsWith("data:")) {
    return "CV was saved as a filename only and cannot be previewed. Ask the teacher to re-upload their CV.";
  }
  return "CV format is not supported for preview.";
}
