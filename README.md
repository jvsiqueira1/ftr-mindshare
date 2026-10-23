# Mindshare

Monorepo do projeto Mindshare, gerenciado com npm workspaces.

| Pasta     | Descrição                                         |
| --------- | ------------------------------------------------- |
| `backend` | API GraphQL (Apollo Server, TypeGraphQL e Prisma) |

## Requisitos

- Node.js 24+

## Primeiros passos

```bash
npm install

# backend
cp backend/.env.example backend/.env
npm run db:generate -w @mindshare/backend
npm run db:migrate -w @mindshare/backend
npm run dev:backend
```

A API fica disponível em http://localhost:4000/graphql.

## Scripts da raiz

| Script                | Descrição                               |
| --------------------- | --------------------------------------- |
| `npm run dev:backend` | Sobe a API em modo watch                |
| `npm run lint`        | Verifica lint e formatação com o Biome  |
| `npm run lint:fix`    | Corrige o que o Biome consegue corrigir |
