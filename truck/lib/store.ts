// FreteConnect 2.0 - Global Store (Zustand)
import { create } from "zustand"

interface User {
  id: string
  email: string
  nome: string
  role: "MOTORISTA" | "CONTRATANTE" | "ADMIN"
}

interface Notification {
  id: string
  tipo: string
  titulo: string
  mensagem: string
  lida: boolean
  createdAt: string
}

interface AppState {
  // User
  user: User | null
  setUser: (user: User | null) => void

  // Notifications
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Notification) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  setNotifications: (notifications: Notification[]) => void

  // UI State
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void

  // Theme
  theme: "dark" | "light"
  setTheme: (theme: "dark" | "light") => void

  // Loading
  isLoading: boolean
  setLoading: (loading: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  // User
  user: null,
  setUser: (user) => set({ user }),

  // Notifications
  notifications: [],
  unreadCount: 0,
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, lida: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, lida: true })),
      unreadCount: 0,
    })),
  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.lida).length,
    }),

  // UI State
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // Theme
  theme: "dark",
  setTheme: (theme) => set({ theme }),

  // Loading
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}))
