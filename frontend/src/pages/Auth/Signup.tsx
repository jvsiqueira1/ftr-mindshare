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

export function Signup() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const signup = useAuthStore((state) => state.signup)

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        try {
            const signupMutate = await signup({
                name,
                email,
                password,
            })
            if (signupMutate) {
                toast.success("Cadastro realizado com sucesso")
            }
        } catch (error) {
            toast.error(getErrorMessage(error, "Erro ao realizar o cadastro"))
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
                            Crie sua conta
                        </CardTitle>
                        <CardDescription>
                            Informe seu nome, e-mail e senha de acesso
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-4"
                        >
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="name">Nome</Label>
                                <Input
                                    id="name"
                                    placeholder="Digite seu nome"
                                    className="h-11"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
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
                                    autoComplete="new-password"
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
                                Cadastrar
                            </Button>
                        </form>
                    </CardContent>
                </Card>
                <Card className="gap-6 p-8">
                    <CardHeader className="px-0">
                        <CardTitle className="text-lg">
                            Já tem uma conta?
                        </CardTitle>
                        <CardDescription>Entre agora mesmo</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        <Button
                            variant="outline"
                            className="h-11 w-full bg-muted"
                            nativeButton={false}
                            render={<Link to="/login" />}
                        >
                            Acessar conta
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
