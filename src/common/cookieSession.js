// sessionService.js
import Cookies from "js-cookie"

const SESSION_KEY = "ad1forflow_session"

export const SessionService = {
  set(value, expiresMinutes = 15) {
    Cookies.set(SESSION_KEY, JSON.stringify(value), {
      expires: expiresMinutes / (60 * 24), // konversi menit → hari
      secure: true,
      sameSite: "Strict"
    })

  },

  get() {
    const raw = Cookies.get(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  },

  destroy() {
    Cookies.remove(SESSION_KEY)
  }
}
