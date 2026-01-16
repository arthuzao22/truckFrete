# Vehicle Management - Component Tree

```
app/(dashboard)/veiculos/page.tsx (SERVER)
│
│   Auth Check ✓
│   Redirect if not authenticated
│
└─── <VeiculosList /> (CLIENT)
     │
     ├─── State Management
     │    ├── veiculos: Veiculo[]
     │    ├── loading: boolean
     │    ├── error: string | null
     │    ├── showVeiculoModal: boolean
     │    ├── showImplementoModal: boolean
     │    └── selectedVeiculoId: string | null
     │
     ├─── API Calls
     │    └── fetchVeiculos() → GET /api/veiculos
     │
     ├─── Loading State
     │    └── <Spinner /> + "Carregando veículos..."
     │
     ├─── Error State
     │    └── <Card> + Error Message + Retry Button
     │
     ├─── Empty State
     │    └── <Card> + Icon + "Nenhum veículo" + CTA Button
     │
     ├─── Action Buttons
     │    └── <Button onClick={() => setShowVeiculoModal(true)}>
     │         Cadastrar Novo Veículo
     │
     ├─── Vehicle Grid (if veiculos.length > 0)
     │    └── grid-cols-1 md:grid-cols-2 lg:grid-cols-3
     │         │
     │         └─── <VeiculoCard /> (for each veiculo)
     │              │
     │              ├─── Vehicle Header
     │              │    ├── Tipo Badge (Cavalo Mecânico)
     │              │    ├── Marca + Modelo
     │              │    └── Ano Fabricação
     │              │
     │              ├─── Vehicle Details
     │              │    ├── Placa (MONO font)
     │              │    ├── Cor
     │              │    └── Configuração Tração
     │              │
     │              ├─── Implementos Section
     │              │    ├── Implemento Count Badge
     │              │    ├── Show/Hide Toggle
     │              │    │
     │              │    └─── Expandable List (if showImplementos)
     │              │         │
     │              │         ├─── Empty State
     │              │         │    "Nenhum implemento cadastrado"
     │              │         │
     │              │         └─── Implemento Cards
     │              │              ├── Tipo Aplicação (Baú, Sider, etc.)
     │              │              ├── Tipo Estrutura
     │              │              ├── Placa (MONO)
     │              │              ├── Qtde Eixos
     │              │              ├── Capacidade Peso (tons)
     │              │              ├── Capacidade Volume (m³)
     │              │              └── Delete Button 🗑️
     │              │
     │              └─── <Button onClick={() => handleAddImplemento(id)}>
     │                   Adicionar Implemento
     │
     ├─── <VeiculoFormModal /> (if showVeiculoModal)
     │    │
     │    ├─── Modal Overlay (fixed, bg-black/50)
     │    │
     │    └─── Modal Content (max-w-2xl, white, rounded)
     │         │
     │         ├─── Header
     │         │    ├── Title: "Cadastrar Novo Veículo"
     │         │    └── Close Button ✕
     │         │
     │         ├─── Form
     │         │    ├── <Select name="tipo">
     │         │    │    ├── CAVALO_MECANICO
     │         │    │    └── UTILITARIO
     │         │    │
     │         │    ├── <Select name="configuracaoTracao">
     │         │    │    ├── 4x2
     │         │    │    ├── 6x2
     │         │    │    └── 6x4
     │         │    │
     │         │    ├── <Input name="marca" required />
     │         │    ├── <Input name="modelo" required />
     │         │    ├── <Input name="anoFabricacao" type="number" />
     │         │    ├── <Input name="cor" required />
     │         │    ├── <Input name="placa" pattern="[A-Z]{3}[0-9][A-Z0-9][0-9]{2}" />
     │         │    └── <Input name="renavam" pattern="[0-9]{11}" />
     │         │
     │         ├─── Error Display (if error)
     │         │    └── Red alert box
     │         │
     │         └─── Footer Buttons
     │              ├── <Button variant="secondary">Cancelar</Button>
     │              └── <Button type="submit">
     │                   {loading ? "Cadastrando..." : "Cadastrar"}
     │
     └─── <ImplementoFormModal /> (if showImplementoModal)
          │
          ├─── Props
          │    ├── veiculoId: string (from selectedVeiculoId)
          │    ├── onClose: () => void
          │    └── onSuccess: () => void
          │
          ├─── Modal Overlay (fixed, bg-black/50)
          │
          └─── Modal Content (max-w-3xl, white, rounded)
               │
               ├─── Header
               │    ├── Title: "Cadastrar Implemento Rodoviário"
               │    └── Close Button ✕
               │
               ├─── Form (3 sections)
               │    │
               │    ├─── 1. Tipo Section (grid-cols-2)
               │    │    ├── <Select name="tipoEstrutura">
               │    │    │    ├── SEMIRREBOQUE_SIMPLES
               │    │    │    ├── BITREM
               │    │    │    ├── RODOTREM
               │    │    │    ├── REBOQUE_SEMIRREBOQUE
               │    │    │    ├── PRANCHA
               │    │    │    └── EXTENSIVA
               │    │    │
               │    │    └── <Select name="tipoAplicacao">
               │    │         ├── BAU
               │    │         ├── SIDER
               │    │         ├── GRANELEIRA
               │    │         ├── BASCULANTE
               │    │         ├── TANQUE
               │    │         ├── PRANCHA
               │    │         ├── PORTA_CONTAINER
               │    │         ├── FLORESTAL
               │    │         ├── CANAVIEIRA
               │    │         ├── BOBINEIRA
               │    │         └── LINHA_EIXOS
               │    │
               │    ├─── 2. Documentação (grid-cols-3)
               │    │    ├── <Input name="placa" pattern="[A-Z]{3}..." />
               │    │    ├── <Input name="renavam" pattern="[0-9]{11}" />
               │    │    └── <Input name="qtdeEixos" type="number" min="2" max="9" />
               │    │
               │    ├─── 3. Capacidades (grid-cols-2)
               │    │    ├── <Input name="capacidadePeso" type="number" required />
               │    │    └── <Input name="capacidadeVolume" type="number" optional />
               │    │
               │    └─── 4. Dimensões (grid-cols-3)
               │         ├── <Input name="comprimento" type="number" optional />
               │         ├── <Input name="largura" type="number" optional />
               │         └── <Input name="altura" type="number" optional />
               │
               ├─── Error Display (if error)
               │    └── Red alert box
               │
               └─── Footer Buttons
                    ├── <Button variant="secondary">Cancelar</Button>
                    └── <Button type="submit">
                         {loading ? "Cadastrando..." : "Cadastrar"}
```

## State Flow

```
User Actions → Component State → API Calls → Database → Response → UI Update

1. Click "Cadastrar Veículo"
   └→ setShowVeiculoModal(true)
      └→ VeiculoFormModal renders

2. Submit Vehicle Form
   └→ POST /api/veiculos
      └→ Zod validation
         └→ Prisma.veiculo.create()
            └→ onSuccess()
               └→ setShowVeiculoModal(false)
               └→ fetchVeiculos() (refresh list)

3. Click "Adicionar Implemento"
   └→ setSelectedVeiculoId(veiculo.id)
   └→ setShowImplementoModal(true)
      └→ ImplementoFormModal renders

4. Submit Implemento Form
   └→ POST /api/implementos
      └→ Verify veiculo ownership
         └→ Zod validation
            └→ Prisma.implemento.create()
               └→ onSuccess()
                  └→ setShowImplementoModal(false)
                  └→ setSelectedVeiculoId(null)
                  └→ fetchVeiculos() (refresh list)

5. Delete Implemento
   └→ confirm("Tem certeza?")
      └→ DELETE /api/implementos/[id]
         └→ Prisma.implemento.update({ ativo: false })
            └→ onRefresh()
               └→ fetchVeiculos() (refresh list)
```

## Styling Classes

```css
/* Layout */
.container mx-auto py-8 px-4
.grid gap-6 md:grid-cols-2 lg:grid-cols-3

/* Cards */
.card hover:shadow-lg transition-shadow

/* Buttons */
.btn-primary (blue action buttons)
.btn-secondary (gray cancel buttons)
.btn-danger (red delete buttons)

/* Forms */
.input-field (consistent input styling)
.label (form labels)

/* States */
.animate-spin (loading spinner)
.bg-red-50 border-red-200 (error boxes)
.bg-gray-50 rounded-lg (implemento cards)

/* Typography */
.font-mono (placas - ABC1D23)
.text-xs, .text-sm, .text-lg, .text-3xl
.font-medium, .font-semibold, .font-bold

/* Colors */
.text-blue-600 (primary actions)
.text-gray-500 (secondary text)
.text-red-600 (errors, delete)
.text-green-600 (success - future)
```

## Responsive Breakpoints

```
Mobile:  < 768px  → Single column, stacked
Tablet:  ≥ 768px  → 2 columns, side-by-side forms
Desktop: ≥ 1024px → 3 columns, wider forms
```

---

**Component Architecture**: Server Components by default, Client Components only where needed (forms, modals, interactive UI)

**Data Fetching**: Server-side in page.tsx, Client-side in VeiculosList for mutations and refreshes

**Form Handling**: Controlled components with React state, POST to API routes, optimistic UI updates
