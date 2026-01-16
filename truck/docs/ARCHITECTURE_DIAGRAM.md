# Vehicle Management - Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                                     │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         NEXT.JS 15 SERVER                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                    MIDDLEWARE.TS                                  │   │
│  │  • Auth check on protected routes                                │   │
│  │  • Redirect if not authenticated                                 │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                │                                          │
│                                ▼                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │         APP/(DASHBOARD)/VEICULOS/PAGE.TSX                        │   │
│  │                   (Server Component)                              │   │
│  │  • await auth() - verify session                                 │   │
│  │  • Render layout with user context                               │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                │                                          │
│                                ▼                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │       COMPONENTS/VEICULOS/VEICULOSLIST.TSX                       │   │
│  │                   (Client Component)                              │   │
│  │  • useState for loading, error, modal states                     │   │
│  │  • useEffect to fetch vehicles on mount                          │   │
│  │  • Render grid or empty state                                    │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│         │                      │                      │                   │
│         │                      │                      │                   │
│         ▼                      ▼                      ▼                   │
│  ┌─────────────┐    ┌──────────────────┐    ┌──────────────────┐       │
│  │ VeiculoCard │    │VeiculoFormModal  │    │ImplementoForm   │       │
│  │             │    │                  │    │ Modal            │       │
│  │ • Display   │    │ • Create vehicle │    │ • Create impl.   │       │
│  │ • Expand    │    │ • Validate form  │    │ • Link to veh.   │       │
│  │ • Delete    │    │ • POST API       │    │ • POST API       │       │
│  └─────────────┘    └──────────────────┘    └──────────────────┘       │
│         │                      │                      │                   │
│         └──────────────────────┴──────────────────────┘                  │
│                                │                                          │
│                                │ fetch() calls                            │
│                                ▼                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                      API ROUTES                                   │   │
│  ├──────────────────────────────────────────────────────────────────┤   │
│  │                                                                    │   │
│  │  GET  /api/veiculos           → List vehicles                    │   │
│  │  POST /api/veiculos           → Create vehicle                   │   │
│  │  GET  /api/veiculos/[id]      → Get specific vehicle             │   │
│  │  DEL  /api/veiculos/[id]      → Delete vehicle (soft)            │   │
│  │                                                                    │   │
│  │  GET  /api/implementos        → List implementos                 │   │
│  │  POST /api/implementos        → Create implemento                │   │
│  │  GET  /api/implementos/[id]   → Get specific implemento          │   │
│  │  DEL  /api/implementos/[id]   → Delete implemento (soft)         │   │
│  │                                                                    │   │
│  │  Each route:                                                      │   │
│  │  1. await auth() - verify session                                │   │
│  │  2. Validate data with Zod                                       │   │
│  │  3. Check ownership                                              │   │
│  │  4. Execute Prisma query                                         │   │
│  │  5. Return JSON response                                         │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                │                                          │
│                                │ Prisma ORM                               │
│                                ▼                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                 │
                                 │ SQL over TLS
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       POSTGRESQL DATABASE                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌────────────────────┐              ┌────────────────────┐             │
│  │   USUARIO TABLE    │              │   VEICULO TABLE    │             │
│  ├────────────────────┤              ├────────────────────┤             │
│  │ id (cuid)          │──────────────│ id (cuid)          │             │
│  │ email              │        1:N   │ usuarioId (FK)     │             │
│  │ senha (hashed)     │              │ tipo               │             │
│  │ nome               │              │ marca              │             │
│  │ cpfCnpj            │              │ modelo             │             │
│  │ telefone           │              │ anoFabricacao      │             │
│  │ role               │              │ placa (UNIQUE)     │             │
│  │ ativo              │              │ renavam (UNIQUE)   │             │
│  │ createdAt          │              │ configuracaoTracao │             │
│  │ updatedAt          │              │ ativo              │             │
│  └────────────────────┘              │ createdAt          │             │
│                                       │ updatedAt          │             │
│                                       └────────────────────┘             │
│                                                │                          │
│                                                │ 1:N                      │
│                                                ▼                          │
│                                       ┌────────────────────┐             │
│                                       │ IMPLEMENTO TABLE   │             │
│                                       ├────────────────────┤             │
│                                       │ id (cuid)          │             │
│                                       │ veiculoId (FK)     │             │
│                                       │ tipoEstrutura      │             │
│                                       │ tipoAplicacao      │             │
│                                       │ qtdeEixos          │             │
│                                       │ placa (UNIQUE)     │             │
│                                       │ renavam (UNIQUE)   │             │
│                                       │ capacidadePeso     │             │
│                                       │ capacidadeVolume   │             │
│                                       │ comprimento        │             │
│                                       │ largura            │             │
│                                       │ altura             │             │
│                                       │ ativo              │             │
│                                       │ createdAt          │             │
│                                       │ updatedAt          │             │
│                                       └────────────────────┘             │
│                                                                           │
│  INDEXES:                                                                │
│  • usuario.email (UNIQUE)                                                │
│  • usuario.cpfCnpj (UNIQUE)                                              │
│  • veiculo.placa (UNIQUE)                                                │
│  • veiculo.renavam (UNIQUE)                                              │
│  • veiculo.usuarioId                                                     │
│  • implemento.placa (UNIQUE)                                             │
│  • implemento.renavam (UNIQUE)                                           │
│  • implemento.veiculoId                                                  │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Examples

### 1. Loading Vehicles Page

```
User → /veiculos
  ↓
Middleware checks auth
  ↓
page.tsx (Server Component)
  - await auth()
  - Check session
  ↓
Render VeiculosList (Client Component)
  ↓
useEffect fires
  ↓
fetch('/api/veiculos')
  ↓
API Route Handler
  - await auth()
  - Verify session
  - prisma.veiculo.findMany()
  ↓
PostgreSQL query
  ↓
Return JSON { data: [...], pagination: {...} }
  ↓
Component setState
  ↓
Render vehicle cards
```

### 2. Creating a Vehicle

```
User fills form
  ↓
Click "Cadastrar Veículo"
  ↓
handleSubmit()
  ↓
fetch('/api/veiculos', {
  method: 'POST',
  body: JSON.stringify(formData)
})
  ↓
API Route Handler
  - await auth()
  - Verify session
  - Zod validation (veiculoSchema)
  - Check for duplicate placa
  - prisma.veiculo.create()
  ↓
PostgreSQL INSERT
  ↓
Return 201 Created { ...vehicle }
  ↓
onSuccess callback
  - Close modal
  - fetchVeiculos() (refresh list)
  ↓
New vehicle appears in grid
```

### 3. Adding an Implemento

```
User clicks "Adicionar Implemento"
  ↓
setSelectedVeiculoId(vehicleId)
setShowImplementoModal(true)
  ↓
ImplementoFormModal opens with veiculoId
  ↓
User fills form
  ↓
handleSubmit()
  ↓
fetch('/api/implementos', {
  method: 'POST',
  body: JSON.stringify({
    ...formData,
    veiculoId
  })
})
  ↓
API Route Handler
  - await auth()
  - Verify veiculo ownership
  - Zod validation (implementoSchema)
  - Check for duplicate placa
  - prisma.implemento.create()
  ↓
PostgreSQL INSERT with FK to veiculo
  ↓
Return 201 Created { ...implemento }
  ↓
onSuccess callback
  - Close modal
  - fetchVeiculos() (refresh with implementos)
  ↓
Implemento appears under vehicle
```

### 4. Deleting an Implemento

```
User clicks trash icon
  ↓
confirm("Tem certeza?")
  ↓
fetch('/api/implementos/[id]', {
  method: 'DELETE'
})
  ↓
API Route Handler
  - await auth()
  - Find implemento
  - Verify veiculo ownership
  - prisma.implemento.update({
      where: { id },
      data: { ativo: false }
    })
  ↓
PostgreSQL UPDATE (soft delete)
  ↓
Return 200 { success: true }
  ↓
onRefresh callback
  - fetchVeiculos()
  ↓
Implemento removed from UI
```

## Security Layers

```
┌─────────────────────────────────────────┐
│  1. MIDDLEWARE                          │
│     • Check if user is authenticated    │
│     • Redirect to /login if not         │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  2. API ROUTE                           │
│     • await auth() - verify session     │
│     • Return 401 if no session          │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  3. ZOD VALIDATION                      │
│     • Validate all input data           │
│     • Return 400 if invalid             │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  4. OWNERSHIP CHECK                     │
│     • Verify user owns the resource     │
│     • Return 404 if not owner           │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  5. PRISMA ORM                          │
│     • Parameterized queries only        │
│     • No SQL injection possible         │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  6. POSTGRESQL                          │
│     • Row-level security                │
│     • UNIQUE constraints                │
│     • Foreign key constraints           │
└─────────────────────────────────────────┘
```

## Component Hierarchy (Visual)

```
App (Root Layout)
└── Middleware
    └── (dashboard) Layout
        └── /veiculos/page.tsx (Server)
            └── <VeiculosList /> (Client)
                ├── Loading State
                │   └── Spinner + Text
                ├── Error State
                │   └── Card + Retry Button
                ├── Empty State
                │   └── Card + Icon + CTA
                └── Vehicle Grid
                    ├── <VeiculoCard />
                    │   ├── Vehicle Header
                    │   │   ├── Type Badge
                    │   │   ├── Brand + Model
                    │   │   └── Year
                    │   ├── Vehicle Details
                    │   │   ├── Placa
                    │   │   ├── Cor
                    │   │   └── Tração
                    │   ├── Implementos Section
                    │   │   ├── Count Badge
                    │   │   ├── Toggle Button
                    │   │   └── Expandable List
                    │   │       └── Implemento Cards
                    │   │           ├── Type Info
                    │   │           ├── Placa
                    │   │           ├── Specs
                    │   │           └── Delete Button
                    │   └── Add Implemento Button
                    ├── <VeiculoFormModal />
                    │   ├── Overlay
                    │   ├── Modal Content
                    │   │   ├── Header + Close
                    │   │   ├── Form
                    │   │   │   ├── <Select tipo />
                    │   │   │   ├── <Select tracao />
                    │   │   │   ├── <Input marca />
                    │   │   │   ├── <Input modelo />
                    │   │   │   ├── <Input ano />
                    │   │   │   ├── <Input cor />
                    │   │   │   ├── <Input placa />
                    │   │   │   └── <Input renavam />
                    │   │   ├── Error Display
                    │   │   └── Footer Buttons
                    │   └── Loading State
                    └── <ImplementoFormModal />
                        ├── Overlay
                        └── Modal Content
                            ├── Header + Close
                            ├── Form (4 sections)
                            │   ├── Types
                            │   ├── Documentation
                            │   ├── Capacities
                            │   └── Dimensions
                            ├── Error Display
                            └── Footer Buttons
```

## Technology Stack Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                      │
├─────────────────────────────────────────────────────────────┤
│  React 19 Components                                         │
│  • Server Components (page.tsx)                             │
│  • Client Components (VeiculosList, forms, modals)          │
│  • Tailwind CSS for styling                                 │
│  • Heroicons (inline SVG)                                   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                       FRAMEWORK LAYER                        │
├─────────────────────────────────────────────────────────────┤
│  Next.js 15 (App Router)                                    │
│  • Server-side rendering                                    │
│  • API Routes (Route Handlers)                              │
│  • Middleware                                               │
│  • TypeScript strict mode                                   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     AUTHENTICATION LAYER                     │
├─────────────────────────────────────────────────────────────┤
│  NextAuth v5                                                │
│  • Session management                                       │
│  • Credentials provider                                     │
│  • JWT tokens                                               │
│  • CSRF protection                                          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      VALIDATION LAYER                        │
├─────────────────────────────────────────────────────────────┤
│  Zod                                                         │
│  • Schema definitions                                       │
│  • Type inference                                           │
│  • Runtime validation                                       │
│  • Error formatting                                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                         DATA LAYER                           │
├─────────────────────────────────────────────────────────────┤
│  Prisma ORM                                                  │
│  • Type-safe queries                                        │
│  • Migration management                                     │
│  • Relation handling                                        │
│  • Connection pooling                                       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                         │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL 15+                                             │
│  • ACID compliance                                          │
│  • Indexes for performance                                  │
│  • Constraints for integrity                                │
│  • Soft deletes (ativo flag)                                │
└─────────────────────────────────────────────────────────────┘
```

---

**FreteConnect** - Vehicle Management System Architecture
January 2025 - Technical Documentation v1.0
