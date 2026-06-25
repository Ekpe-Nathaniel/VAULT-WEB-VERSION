import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Layout } from '@/components/layout/Layout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Home } from '@/pages/Home'
import { Login } from '@/pages/Login'
import { SignUp } from '@/pages/SignUp'

import { Embed } from '@/pages/Embed'
import { Extract } from '@/pages/Extract'
import { History } from '@/pages/History'
import { Settings } from '@/pages/Settings'

const queryClient = new QueryClient()

function Protect({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            <Route path="/embed" element={<Protect><Embed /></Protect>} />
            <Route path="/extract" element={<Protect><Extract /></Protect>} />
            <Route path="/history" element={<Protect><History /></Protect>} />
            <Route path="/settings" element={<Protect><Settings /></Protect>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
