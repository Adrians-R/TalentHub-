/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Manages unique browser / device identification for trusted-device authentication.
 * A device ID is generated once and persisted in localStorage.
 */
const DEVICE_STORAGE_KEY = "talenthub_device_id";

export function getOrCreateDeviceId(): string {
  try {
    let deviceId = localStorage.getItem(DEVICE_STORAGE_KEY);
    if (!deviceId) {
      deviceId = `dev_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      localStorage.setItem(DEVICE_STORAGE_KEY, deviceId);
    }
    return deviceId;
  } catch {
    return "dev_fallback_browser_session";
  }
}

export function getDeviceId(): string | null {
  try {
    return localStorage.getItem(DEVICE_STORAGE_KEY);
  } catch {
    return null;
  }
}
