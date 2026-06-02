import { Preferences } from '@capacitor/preferences'

/** Typed wrapper around @capacitor/preferences. Falls back to localStorage on web. */
export const storage = {
  async get<T>(key: string): Promise<T | null> {
    const { value } = await Preferences.get({ key })
    if (value == null) return null
    try { return JSON.parse(value) as T } catch { return null }
  },

  async set<T>(key: string, value: T): Promise<void> {
    await Preferences.set({ key, value: JSON.stringify(value) })
  },

  async remove(key: string): Promise<void> {
    await Preferences.remove({ key })
  },

  async keys(): Promise<string[]> {
    const { keys } = await Preferences.keys()
    return keys
  },
}
