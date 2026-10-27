import { Lightbulb, LogOut, Users } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router"
import logoIcon from "@/assets/logo-icon.svg"
import { getInitials } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Button } from "./ui/button"

const NAV_ITEMS = [
    { to: "/", label: "Ideias", icon: Lightbulb },
    { to: "/members", label: "Membros", icon: Users },
]

export function Header() {
    const { user, isAuthenticated, logout } = useAuthStore()
    const location = useLocation()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    if (!isAuthenticated) return null

    return (
        <header className="flex w-full items-center justify-between px-16 pt-6">
            <div className="min-w-48">
                <img src={logoIcon} alt="MindShare" />
            </div>
            <nav className="flex items-center gap-4">
                {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                    <Button
                        key={to}
                        size="sm"
                        className="gap-2"
                        variant={location.pathname === to ? "default" : "ghost"}
                        nativeButton={false}
                        render={<Link to={to} />}
                    >
                        <Icon className="h-4 w-4" />
                        {label}
                    </Button>
                ))}
            </nav>
            <div className="flex min-w-48 items-center justify-end gap-2">
                <Avatar>
                    <AvatarFallback className="bg-zinc-950 text-primary-foreground">
                        {getInitials(user?.name)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-sm font-medium">{user?.name}</span>
                    <span className="text-xs text-muted-foreground">
                        {user?.email}
                    </span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    aria-label="Sair"
                >
                    <LogOut className="h-5 w-5" />
                </Button>
            </div>
        </header>
    )
}
