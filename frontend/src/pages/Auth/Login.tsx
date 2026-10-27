import { type SubmitEvent, useState } from "react"
import { Link } from "react-router"
import { toast } from "sonner"
import logo from "@/assets/logo.svg"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getErrorMessage } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth"

export function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const login = useAuthStore((state) => state.login)

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        try {
            const loginMutate = await login({
                email,
                password,
            })

            if (loginMutate) {
                toast.success("Login realizado com sucesso")
            }
        } catch (error) {
            toast.error(getErrorMessage(error, "Falha ao realizar o login"))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center gap-8">
            <img src={logo} alt="MindShare" className="h-12" />
            <div className="flex w-full max-w-md flex-col gap-4">
                <Card className="gap-8 p-8">
                    <CardHeader className="px-0">
                        <CardTitle className="text-2xl font-bold">
                            Acesse a plataforma
                        </CardTitle>
                        <CardDescription>
                            Entre usando seu e-mail e senha cadastrados
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-4"
                        >
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="email">E-mail</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="exemplo@mail.com"
                                    className="h-11"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="password">Senha</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Digite sua senha"
                                    autoComplete="current-password"
                                    className="h-11"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className="mt-4 h-11"
                                disabled={loading}
                            >
                                Entrar
                            </Button>
                        </form>
                    </CardContent>
                </Card>
                <Card className="gap-6 p-8">
                    <CardHeader className="px-0">
                        <CardTitle className="text-lg">
                            Ainda não tem uma conta?
                        </CardTitle>
                        <CardDescription>Cadastre agora mesmo</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        <Button
                            variant="outline"
                            className="h-11 w-full bg-muted"
                            nativeButton={false}
                            render={<Link to="/signup" />}
                        >
                            Criar conta
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
