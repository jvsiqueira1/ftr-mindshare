import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { ApolloProvider } from "@apollo/client/react"
import { BrowserRouter } from "react-router"
import App from "./App.tsx"
import { apolloClient } from "./lib/graphql/apollo.ts"

const rootElement = document.getElementById("root")

if (!rootElement) throw new Error("Elemento #root não encontrado")

createRoot(rootElement).render(
    <StrictMode>
        <ApolloProvider client={apolloClient}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ApolloProvider>
    </StrictMode>,
)
