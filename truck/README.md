# 🚛 FreteConnect - Marketplace Inteligente de Fretes

**Versão MVP 1.0** - Janeiro 2026

FreteConnect é um marketplace inteligente que conecta motoristas/transportadoras com contratantes de frete, priorizando veículos em rota de retorno para reduzir custos operacionais e aumentar eficiência logística.

## 🎯 Características Principais

### ✅ Sistema Completo Implementado

- ✅ **Autenticação Completa** - NextAuth.js v5 com JWT
- ✅ **Gestão de Veículos** - CRUD completo (Cavalo Mecânico + Implementos)
- ✅ **Publicação de Fretes** - Contratantes publicam necessidades
- ✅ **Anúncios de Retorno** - Motoristas anunciam disponibilidade
- ✅ **Matching Inteligente** - Algoritmo calcula compatibilidade (0-100)
- ✅ **Chat Interno** - Negociação direta entre partes
- ✅ **Dashboard Personalizado** - Por papel (motorista/contratante)
- ✅ **RBAC** - Controle de acesso baseado em papéis
- ✅ **Validação Completa** - Zod em frontend e backend
- ✅ **Design Responsivo** - Mobile-first com Tailwind CSS

## 🏗️ Arquitetura Técnica

### Stack Tecnológica

```
Frontend:  Next.js 16.1.2 (App Router) + React 19 + Tailwind CSS 4
Backend:   Next.js API Routes (Route Handlers)
Database:  PostgreSQL 15+ via Prisma 7.2.0
Auth:      NextAuth.js v5 (JWT Strategy)
Validation: Zod 3+
Security:  bcryptjs para senhas
```

## 🚀 Como Executar

### 1. Pré-requisitos

```bash
- Node.js 20+
- PostgreSQL 15+
- npm ou yarn
```

### 2. Instalação

```bash
# Instale dependências
npm install

# Configure variáveis de ambiente (.env já configurado)
# DATABASE_URL - URL do banco PostgreSQL
# NEXTAUTH_SECRET - Chave secreta para JWT
# NEXTAUTH_URL - URL da aplicação
```

### 3. Configuração do Banco

```bash
# Inicie o banco Prisma
npx prisma dev

# Execute migrations
npx prisma migrate dev --name init

# Gere o cliente Prisma
npx prisma generate
```

### 4. Executar em Desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:3000`

## 🔄 Fluxos Principais

### Fluxo do Motorista

1. ✅ Acesse `/registro` e crie conta como MOTORISTA
2. ✅ Faça login em `/login`
3. ✅ Vá para `/veiculos` e cadastre seu cavalo mecânico
4. ✅ Adicione implementos (carretas) ao veículo
5. ✅ Em `/retorno`, anuncie quando estiver com retorno disponível
6. ✅ Verifique `/fretes` para ver cargas compatíveis
7. ✅ Use `/chat` para negociar com contratantes

### Fluxo do Contratante

1. ✅ Acesse `/registro` e crie conta como CONTRATANTE
2. ✅ Faça login em `/login`
3. ✅ Vá para `/fretes` e publique sua necessidade de frete
4. ✅ Em `/matches`, veja os veículos compatíveis com scores
5. ✅ Analise os detalhes do matching inteligente
6. ✅ Use `/chat` para entrar em contato com motoristas
7. ✅ Negocie valores e feche o frete

## 🧠 Algoritmo de Matching Inteligente

O sistema calcula automaticamente um score de compatibilidade (0-100) entre fretes e veículos disponíveis:

| Critério | Pontos | Descrição |
|----------|--------|-----------|
| **Rota** | 40 | Proximidade origem/destino |
| **Tipo de Veículo** | 25 | Implemento adequado para carga |
| **Capacidade** | 15 | Peso e volume |
| **Timing** | 15 | Janela de tempo disponível |
| **Avaliação** | 5 | Rating do motorista |

Exemplo de resultado:
- **85 pontos** = Match Excelente ✅
- **50-69 pontos** = Match Bom ⚠️
- **Abaixo de 50** = Match Regular ⛔

## 📱 Páginas Implementadas

### Públicas
- `/` - Landing page
- `/login` - Login
- `/registro` - Cadastro

### Motorista
- `/dashboard` - Dashboard com estatísticas
- `/veiculos` - Gestão de veículos
- `/retorno` - Anúncios de retorno
- `/fretes` - Fretes disponíveis
- `/chat` - Mensagens
- `/perfil` - Perfil

### Contratante
- `/dashboard` - Dashboard com estatísticas
- `/fretes` - Meus fretes
- `/matches` - Matches inteligentes
- `/chat` - Mensagens
- `/perfil` - Perfil

## 🗄️ Modelo de Dados

### Principais Entidades

```
Usuario (MOTORISTA | CONTRATANTE | ADMIN)
  ↓
Veiculo (Cavalo Mecânico ou Utilitário)
  ↓
Implemento (6 tipos de estrutura, 11 tipos de aplicação)
  ↓
AnuncioRetorno (Motorista anuncia retorno disponível)

Usuario (CONTRATANTE)
  ↓
Frete (Necessidade de transporte)
  ↓
Match (Frete ↔ AnuncioRetorno com score)
  ↓
Mensagem (Chat entre partes)
```

## 🔐 Segurança

✅ **Autenticação JWT** via NextAuth.js  
✅ **Senhas** hasheadas com bcryptjs  
✅ **Validação** Zod em todas as entradas  
✅ **RBAC** - Controle de acesso por papel  
✅ **Middleware** protege todas as rotas privadas  
✅ **SQL Injection** prevenido via Prisma ORM  
✅ **Soft Deletes** - Dados nunca apagados permanentemente  

## 📊 API Endpoints

### Autenticação
- `POST /api/registro` - Criar conta
- `POST /api/auth/[...nextauth]` - Login (NextAuth)

### Veículos
- `GET /api/veiculos` - Listar veículos do usuário
- `POST /api/veiculos` - Criar veículo
- `GET /api/veiculos/[id]` - Buscar veículo
- `DELETE /api/veiculos/[id]` - Desativar veículo

### Implementos
- `GET /api/implementos?veiculoId=X` - Listar implementos
- `POST /api/implementos` - Criar implemento
- `GET /api/implementos/[id]` - Buscar implemento
- `DELETE /api/implementos/[id]` - Desativar implemento

### Fretes
- `GET /api/fretes` - Listar fretes (filtrado por role)
- `POST /api/fretes` - Publicar frete (apenas contratante)

### Retorno
- `GET /api/retorno` - Listar anúncios
- `POST /api/retorno` - Criar anúncio (apenas motorista)
- `DELETE /api/retorno/[id]` - Desativar anúncio

### Matches
- `GET /api/matches?freteId=X` - Buscar matches para um frete
- `POST /api/matches` - Salvar match

### Mensagens
- `GET /api/mensagens?freteId=X` - Listar mensagens
- `POST /api/mensagens` - Enviar mensagem

## 📦 Estrutura de Componentes

```
components/
├── ui/
│   ├── Button.tsx          # Botão reutilizável
│   ├── Input.tsx           # Input com label e erro
│   ├── Card.tsx            # Container com estilo
│   └── Select.tsx          # Select dropdown
├── veiculos/
│   ├── VeiculosList.tsx    # Lista de veículos
│   ├── VeiculoCard.tsx     # Card de veículo
│   ├── VeiculoFormModal.tsx # Modal form veículo
│   └── ImplementoFormModal.tsx # Modal form implemento
├── fretes/
│   ├── FretesList.tsx      # Lista de fretes
│   └── FreteFormModal.tsx  # Modal form frete
├── retorno/
│   ├── RetornoList.tsx     # Lista de anúncios
│   └── RetornoFormModal.tsx # Modal form anúncio
├── matches/
│   └── MatchesList.tsx     # Lista de matches com scores
├── chat/
│   └── ChatList.tsx        # Interface de chat
└── DashboardNav.tsx        # Navegação principal
```

## 🎨 Estilos e UI

O projeto usa **Tailwind CSS 4** com classes personalizadas:

```css
.btn-primary      # Botão azul primário
.btn-secondary    # Botão cinza secundário
.btn-danger       # Botão vermelho de perigo
.card             # Container com sombra e borda
.input-field      # Input com estilo padronizado
.label            # Label de formulário
```

## 🧪 Testando o Sistema

### 1. Crie um motorista
- Acesse `/registro`
- Escolha "Motorista/Transportadora"
- Preencha os dados
- Faça login

### 2. Cadastre um veículo
- Vá para `/veiculos`
- Clique em "Cadastrar Veículo"
- Preencha: Marca, Modelo, Placa (formato Mercosul), etc.
- Adicione um implemento (carreta)

### 3. Anuncie um retorno
- Vá para `/retorno`
- Clique em "Anunciar Retorno Disponível"
- Escolha o veículo
- Defina origem, destino e data

### 4. Crie um contratante
- Abra nova aba anônima
- Acesse `/registro`
- Escolha "Contratante de Frete"
- Faça login

### 5. Publique um frete
- Vá para `/fretes`
- Clique em "Publicar Novo Frete"
- Preencha origem, destino, tipo de carga, peso, etc.

### 6. Veja os matches
- Vá para `/matches`
- Selecione o frete criado
- Veja os veículos compatíveis com scores
- Analise os detalhes do matching

## 🚧 Próximas Funcionalidades

- [ ] Sistema de avaliações/ratings
- [ ] Notificações em tempo real (WebSockets)
- [ ] Integração com Google Maps
- [ ] Upload de documentos
- [ ] Sistema de pagamento
- [ ] Histórico completo
- [ ] Relatórios e analytics
- [ ] App mobile (React Native)

## 📝 Licença

Projeto proprietário. Todos os direitos reservados.

---

**FreteConnect** - Conectando o Brasil, um frete de cada vez 🚛💙

**Status**: ✅ MVP Completo e Funcional  
**Versão**: 1.0  
**Data**: Janeiro 2026
