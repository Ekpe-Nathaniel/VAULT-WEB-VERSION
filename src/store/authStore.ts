import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'

const API_BASE = 'http://localhost:8000'

interface AuthUser {
  uid: string
  displayName: string | null
  email: string | null
  photoURL: string | null
}

interface AuthStore {
  isAuthenticated: boolean
  user: AuthUser | null
  loading: boolean
  apiToken: string | null
  login: () => void
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  ensureApiToken: () => Promise<string>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      loading: true,
      apiToken: null,

      login: () =>
        set({
          isAuthenticated: true,
          loading: false,
          user: { uid: 'demo', displayName: 'Demo User', email: 'demo@vault.local', photoURL: null },
        }),

      signInWithGoogle: async () => {
        if (!auth || !googleProvider) {
          get().login()
          return
        }
        const result = await signInWithPopup(auth, googleProvider)
        const firebaseUser = result.user
        set({
          isAuthenticated: true,
          loading: false,
          user: {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
          },
        })
      },

      logout: async () => {
        if (auth) await signOut(auth)
        set({ isAuthenticated: false, user: null, loading: false, apiToken: null })
      },

      ensureApiToken: async () => {
        const existing = get().apiToken
        if (existing) return existing

        const apiFetch = async (path: string, body: object) => {
          const res = await fetch(`${API_BASE}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          })
          if (!res.ok) {
            const text = await res.text().catch(() => '')
            throw new Error(text || `HTTP ${res.status}`)
          }
          return res.json()
        }

        const uid = `vault_${Date.now().toString(36)}`
        let token: string | null = null
        let lastError: unknown

        for (const creds of [
          { username: 'vault_user', password: 'demo1234' },
          null,
        ]) {
          if (creds) {
            try {
              const data = await apiFetch('/api/users/login', creds)
              token = data.access_token
              break
            } catch (e) { lastError = e }
          } else {
            try {
              await apiFetch('/api/users/register', {
                username: uid, email: `${uid}@vault.local`, password: 'demo1234',
              })
              const data = await apiFetch('/api/users/login', {
                username: uid, password: 'demo1234',
              })
              token = data.access_token
              break
            } catch (e) { lastError = e }
          }
        }

        if (!token) {
          const msg = lastError instanceof TypeError
            ? `Cannot reach backend at ${API_BASE}. Start the server with: uvicorn main:app --reload --host 0.0.0.0 --port 8000`
            : `Backend auth failed: ${lastError instanceof Error ? lastError.message : 'Unknown error'}`
          throw new Error(msg)
        }

        set({ apiToken: token })
        return token
      },
    }),
    { name: 'vault-auth', partialize: (s) => ({ apiToken: s.apiToken }) },
  ),
)

// Firebase auth listener (singleton — runs once)
let listenerAttached = false
if (auth && !listenerAttached) {
  listenerAttached = true
  onAuthStateChanged(auth, (firebaseUser: User | null) => {
    const s = useAuthStore.getState()
    if (firebaseUser) {
      if (!s.isAuthenticated) {
        useAuthStore.setState({
          isAuthenticated: true,
          loading: false,
          user: {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
          },
        })
      }
    } else if (!s.apiToken) {
      useAuthStore.setState({ isAuthenticated: false, loading: false, user: null })
    }
  })
} else if (!auth) {
  useAuthStore.setState({ loading: false })
}
