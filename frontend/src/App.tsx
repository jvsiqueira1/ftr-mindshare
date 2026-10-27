import { Navigate, Route, Routes } from "react-router"
import { Layout } from "./components/Layout"
import { Login } from "./pages/Auth/Login"
import { Signup } from "./pages/Auth/Signup"
import { IdeasPage } from "./pages/Ideas"
import { Members } from "./pages/Members"
import { useAuthStore } from "./stores/auth"

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    return isAuthenticated ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }: { children: React.ReactNode }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    return !isAuthenticated ? children : <Navigate to="/" replace />
}

export default function App() {
    return (
        <Layout>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <PublicRoute>
                            <Signup />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <IdeasPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/members"
                    element={
                        <ProtectedRoute>
                            <Members />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Layout>
    )
}
