# 🚀 FreteConnect 2.0

**Marketplace Inteligente de Fretes** - Conectando cargas e caminhões com IA, matching inteligente e foco em fretes de retorno.

![Next.js](https://img.shields.io/badge/Next.js-16.1.2-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-7.2.0-2D3748?logo=prisma)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)

---

## ✨ Funcionalidades Premium

### 🎯 Core
- ✅ **Matching Inteligente** - Algoritmo que conecta fretes com veículos em rota de retorno
- ✅ **Gestão Completa de Veículos** - Cavalo mecânico + implementos rodoviários
- ✅ **Sistema de Anúncios** - Motoristas anunciam retornos disponíveis
- ✅ **Chat em Tempo Real** - Negociação direta via WebSocket
- ✅ **Rastreamento GPS** - Acompanhamento em tempo real dos fretes

### 💎 Avançadas (2.0)
- ✅ **Dashboard Premium** - Interface dark com glassmorphism e animações
- ✅ **Sistema de Pagamentos** - Wallet interno com custódia de valores
- ✅ **Documentos Verificados** - Upload e validação de CNH, CRLV, ANTT
- ✅ **Avaliações e Reputação** - Sistema de feedback entre usuários
- ✅ **Notificações Push** - Via WebSocket e Firebase Cloud Messaging
- ✅ **Analytics Completo** - Métricas de desempenho e faturamento
- ✅ **PWA Ready** - Instalável com modo offline

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Versão |
|--------|------------|--------|
| **Framework** | Next.js (App Router) | 16.1.2 |
| **Linguagem** | TypeScript | 5.0+ |
| **Banco de Dados** | PostgreSQL | 15+ |
| **ORM** | Prisma | 7.2.0 |
| **Autenticação** | NextAuth.js | 5.0 |
| **Validação** | Zod | 4.3+ |
| **Estilização** | Tailwind CSS | 4.0 |
| **Animações** | Framer Motion | Latest |
| **Estado Global** | Zustand | 4.0+ |
| **Real-time** | Socket.io | Latest |
| **Ícones** | Lucide React | Latest |

---

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+
- PostgreSQL 15+
- npm ou pnpm

### 1. Instalação

```bash
# Clone o repositório
git clone <repo-url>
cd truck

# Instale as dependências
npm install
```

### 2. Configuração do Banco

```bash
# Configure o .env
cp .env.example .env.local

# Edite .env.local com suas credenciais PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/freteconnect"
NEXTAUTH_SECRET="sua-chave-secreta-muito-longa"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Migrations e Seed

```bash
# Gerar cliente Prisma
npx prisma generate

# Rodar migrations
npx prisma migrate dev

# (Opcional) Popular banco com dados de teste
npx prisma db seed
```

### 4. Executar

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build
npm start

# Prisma Studio (GUI do banco)
npx prisma studio
```

Acesse: **http://localhost:3000**

---

## 📐 Estrutura do Projeto

```
truck/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Rotas de autenticação
│   │   ├── login/
│   │   └── registro/
│   ├── (dashboard)/              # Área logada
│   │   ├── motorista/            # Dashboard motorista
│   │   ├── contratante/          # Dashboard contratante
│   │   ├── admin/                # Dashboard admin
│   │   ├── veiculos/             # Gestão de veículos
│   │   ├── fretes/               # Gestão de fretes
│   │   ├── matches/              # Matches inteligentes
│   │   ├── chat/                 # Mensagens
│   │   ├── wallet/               # Carteira
│   │   └── perfil/               # Perfil do usuário
│   ├── api/                      # API Routes
│   │   ├── auth/                 # NextAuth endpoints
│   │   ├── veiculos/             # CRUD veículos
│   │   ├── fretes/               # CRUD fretes
│   │   ├── matches/              # Algoritmo de matching
│   │   ├── notificacoes/         # Notificações
│   │   ├── documentos/           # Upload de documentos
│   │   ├── wallet/               # Transações financeiras
│   │   └── avaliacoes/           # Sistema de avaliações
│   ├── layout.tsx                # Layout raiz
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Estilos globais
├── components/
│   ├── ui/                       # Componentes base
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   └── Toast.tsx
│   ├── landing/                  # Landing page
│   │   ├── HeroSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── dashboard/                # Dashboard
│   │   └── StatsCard.tsx
│   ├── veiculos/                 # Veículos
│   ├── fretes/                   # Fretes
│   ├── matches/                  # Matches
│   └── chat/                     # Chat
├── lib/
│   ├── auth.ts                   # NextAuth config
│   ├── prisma.ts                 # Prisma client
│   ├── utils.ts                  # Utilitários
│   ├── design-system.ts          # Design tokens
│   ├── store.ts                  # Zustand store
│   ├── matching.ts               # Algoritmo de matching
│   └── validators/               # Schemas Zod
├── prisma/
│   ├── schema.prisma             # Schema do banco
│   ├── migrations/               # Migrations
│   └── seed.ts                   # Seed data
├── public/                       # Assets estáticos
├── middleware.ts                 # Middleware Next.js
└── package.json
```

---

## 🎨 Design System

### Paleta de Cores (Dark Mode)
- **Primary**: Blue (500-600)
- **Secondary**: Gray (700-900)
- **Accent**: Purple/Pink gradients
- **Success**: Green (500-600)
- **Warning**: Yellow/Orange (500-600)
- **Error**: Red (500-600)

### Componentes UI
- **Button** - 6 variantes (primary, secondary, outline, ghost, danger, success)
- **Card** - 4 variantes (default, glass, premium, flat)
- **Badge** - Status indicators
- **Modal** - Componente de diálogo
- **Toast** - Notificações temporárias
- **Input** - Campos de formulário

### Animações (Framer Motion)
- Fade in/out
- Slide up/down/left/right
- Scale
- Hover/Tap interactions

---

## 🔐 Segurança

### Autenticação
- NextAuth.js com Credentials Provider
- Senhas com bcrypt (10 rounds)
- Session JWT com role-based access

### Validação
- Zod em todas as rotas API
- Validação client e server-side
- Sanitização de inputs

### Proteção de Rotas
- Middleware protege rotas autenticadas
- RBAC (Role-Based Access Control)
- Verificação de propriedade de recursos

---

## 📊 Modelos de Dados

### Core Models
- **Usuario** - Motorista, Contratante ou Admin
- **Veiculo** - Cavalo mecânico
- **Implemento** - Semirreboque, bitrem, etc.
- **AnuncioRetorno** - Veículo disponível para retorno
- **Frete** - Carga a ser transportada
- **Match** - Algoritmo conecta frete ↔ retorno

### Advanced Models (2.0)
- **Documento** - CNH, CRLV, ANTT, etc.
- **Avaliacao** - Sistema de feedback
- **Notificacao** - Push e in-app
- **Wallet** - Saldo do usuário
- **Transacao** - Histórico financeiro
- **Localizacao** - Rastreamento GPS

---

## 🧪 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev             # Iniciar servidor dev (hot reload)

# Build
npm run build           # Build de produção
npm start               # Rodar build

# Lint
npm run lint            # Verificar código

# Prisma
npx prisma studio       # GUI do banco de dados
npx prisma generate     # Gerar cliente Prisma
npx prisma migrate dev  # Criar migration
npx prisma db push      # Sincronizar schema (dev)
npx prisma db seed      # Popular banco
```

---

## 🌐 API Routes

### Autenticação
- `POST /api/auth/signin` - Login
- `POST /api/auth/signout` - Logout
- `POST /api/auth/signup` - Registro

### Veículos
- `GET /api/veiculos` - Listar veículos
- `POST /api/veiculos` - Criar veículo
- `GET /api/veiculos/[id]` - Detalhes
- `PUT /api/veiculos/[id]` - Atualizar
- `DELETE /api/veiculos/[id]` - Remover

### Fretes
- `GET /api/fretes` - Listar fretes
- `POST /api/fretes` - Criar frete
- `GET /api/fretes/[id]` - Detalhes
- `PATCH /api/fretes/[id]` - Atualizar status

### Matches
- `GET /api/matches` - Listar matches
- `POST /api/matches` - Criar match manual
- `PATCH /api/matches/[id]` - Aceitar/recusar

### Notificações (2.0)
- `GET /api/notificacoes` - Listar notificações
- `PATCH /api/notificacoes` - Marcar como lida

### Documentos (2.0)
- `GET /api/documentos` - Listar documentos
- `POST /api/documentos` - Upload documento
- `PATCH /api/documentos` - Aprovar/rejeitar (admin)

### Wallet (2.0)
- `GET /api/wallet` - Ver saldo
- `POST /api/wallet` - Depósito/saque

---

## 🚦 Roadmap

### ✅ Concluído (2.0)
- [x] Landing page premium com animações
- [x] Design system completo
- [x] Componentes UI avançados
- [x] Sistema de notificações
- [x] Upload de documentos
- [x] Wallet básico
- [x] API de avaliações
- [x] Store global (Zustand)

### 🚧 Em Progresso
- [ ] Chat em tempo real (Socket.io)
- [ ] Rastreamento GPS
- [ ] Dashboard completo motorista/contratante
- [ ] Mapa interativo com matches

### 📋 Planejado
- [ ] Integração pagamentos (Stripe/Mercado Pago)
- [ ] Push notifications (Firebase)
- [ ] OAuth Google
- [ ] PWA completo
- [ ] Testes E2E
- [ ] CI/CD

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto é privado. Todos os direitos reservados.

---

## 📧 Contato

**FreteConnect Team**
- Email: contato@freteconnect.com.br
- Website: https://freteconnect.com.br

---

## 🙏 Agradecimentos

Desenvolvido com ❤️ usando as melhores tecnologias do mercado.

- Next.js Team
- Prisma Team
- Vercel
- E toda a comunidade open-source

---

**FreteConnect 2.0** - Marketplace Inteligente de Fretes 🚛📦
