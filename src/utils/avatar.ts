/**
 * Standard Universal Profile Image (Default Avatar)
 * A clean, neutral silhouette profile image used across the platform
 * for any user or candidate who has not uploaded a custom photo.
 */
export const DEFAULT_PROFILE_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNjAgMTYwIj48cmVjdCB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgZmlsbD0iI2YxZjVmOSIvPjxjaXJjbGUgY3g9IjgwIiBjeT0iNTgiIHI9IjI4IiBmaWxsPSIjOTRhM2I4Ii8+PHBhdGggZD0iTTI2IDE2MGMwLTI5LjgyIDI0LjE4LTU0IDU0LTU0czU0IDI0LjE4IDU0IDU0eiIgZmlsbD0iIzk0YTNiOCIvPjwvc3ZnPg==";

export const DEFAULT_AVATAR = DEFAULT_PROFILE_IMAGE;

/**
 * Returns candidate or user avatar URL, falling back to the standard profile image
 * if not uploaded or if it contains the legacy placeholder photo.
 */
export function getProfileAvatar(avatar?: string | null): string {
  if (!avatar || typeof avatar !== "string" || avatar.trim() === "") {
    return DEFAULT_PROFILE_IMAGE;
  }
  // Replace the legacy placeholder photo of the person
  if (avatar.includes("photo-1534528741775-53994a69daeb")) {
    return DEFAULT_PROFILE_IMAGE;
  }
  return avatar;
}

/**
 * Checks if the avatar is the default avatar or empty (i.e., user has not uploaded a custom photo).
 */
export function isDefaultAvatar(avatar?: string | null): boolean {
  if (!avatar || typeof avatar !== "string" || avatar.trim() === "") {
    return true;
  }
  return avatar === DEFAULT_PROFILE_IMAGE || avatar.includes("photo-1534528741775-53994a69daeb");
}
