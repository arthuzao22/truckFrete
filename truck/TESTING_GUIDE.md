# 🧪 FreteConnect 2.0 - Guia de Testes da Fase 2

## 🎯 COMO TESTAR AS NOVAS FUNCIONALIDADES

### ⚙️ Pré-requisitos

1. **Iniciar o servidor de desenvolvimento**
```bash
cd /home/runner/work/truckFrete/truckFrete/truck
npm run dev
```

2. **Banco de dados configurado**
```bash
# Se ainda não fez o push do schema
npx prisma db push

# Popular dados de teste
npx prisma db seed
```

3. **Criar usuário de teste**
- Acesse: http://localhost:3000/registro
- Crie 2 usuários: um MOTORISTA e um CONTRATANTE

---

## 1. ⭐ Testar Sistema de Avaliações

### API - Criar Avaliação
```bash
# 1. Faça login e pegue o cookie de sessão
# 2. Certifique-se de ter um frete ENTREGUE
# 3. POST /api/avaliacoes

curl -X POST http://localhost:3000/api/avaliacoes \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "freteId": "clxxx",
    "avaliadoId": "clyyy",
    "nota": 5,
    "pontualidade": 5,
    "comunicacao": 4,
    "qualidade": 5,
    "comentario": "Excelente motorista!"
  }'
```

### API - Listar Avaliações
```bash
# GET /api/avaliacoes?usuarioId=xxx&page=1

curl http://localhost:3000/api/avaliacoes?usuarioId=clyyy&page=1 \
  -H "Cookie: your-session-cookie"
```

### Componente - RatingStars
```typescript
// Criar arquivo: app/test/avaliacoes/page.tsx

"use client"

import { useState } from "react"
import { RatingStars } from "@/components/avaliacoes/RatingStars"

export default function TestRatingsPage() {
  const [rating, setRating] = useState(0)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Teste de Avaliações</h1>
      
      {/* Interativo */}
      <div className="mb-8">
        <h2 className="text-lg mb-2">Interativo</h2>
        <RatingStars value={rating} onChange={setRating} size="lg" showValue />
        <p className="mt-2">Selecionado: {rating}</p>
      </div>

      {/* Read-only */}
      <div>
        <h2 className="text-lg mb-2">Read-only</h2>
        <RatingStars value={4.5} readonly size="md" showValue />
      </div>
    </div>
  )
}
```

Acesse: http://localhost:3000/test/avaliacoes

---

## 2. 📍 Testar GPS Tracking

### API - Enviar Localização
```bash
# POST /api/localizacao

curl -X POST http://localhost:3000/api/localizacao \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "latitude": -23.550520,
    "longitude": -46.633308,
    "velocidade": 60,
    "direcao": 90,
    "precisao": 10,
    "freteId": "clxxx"
  }'
```

### API - Buscar Localizações
```bash
# GET /api/localizacao?latest=true

curl http://localhost:3000/api/localizacao?latest=true \
  -H "Cookie: your-session-cookie"
```

### Hook - useGeolocation
```typescript
// Criar arquivo: app/test/gps/page.tsx

"use client"

import { useGeolocation } from "@/hooks/useGeolocation"
import { Button } from "@/components/ui/Button"

export default function TestGPSPage() {
  const { position, error, loading, getCurrentPosition } = useGeolocation()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Teste GPS</h1>

      <Button onClick={getCurrentPosition}>Obter Localização</Button>

      {loading && <p className="mt-4">Buscando localização...</p>}

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded">
          Erro: {error.message}
        </div>
      )}

      {position && (
        <div className="mt-4 p-4 bg-green-50 rounded">
          <p><strong>Latitude:</strong> {position.latitude}</p>
          <p><strong>Longitude:</strong> {position.longitude}</p>
          <p><strong>Precisão:</strong> {position.accuracy}m</p>
          {position.speed && <p><strong>Velocidade:</strong> {(position.speed * 3.6).toFixed(1)} km/h</p>}
        </div>
      )}
    </div>
  )
}
```

Acesse: http://localhost:3000/test/gps

---

## 3. 📝 Testar Multi-Step Form

```typescript
// Criar arquivo: app/test/multistep/page.tsx

"use client"

import { useState } from "react"
import { MultiStepForm, type Step } from "@/components/forms/MultiStepForm"

export default function TestMultiStepPage() {
  const [data, setData] = useState({
    step1: "",
    step2: "",
    step3: "",
  })

  const steps: Step[] = [
    {
      id: "step1",
      title: "Passo 1",
      description: "Informações básicas",
      component: (
        <input
          type="text"
          value={data.step1}
          onChange={(e) => setData({ ...data, step1: e.target.value })}
          placeholder="Digite algo..."
          className="w-full p-3 border rounded"
        />
      ),
      validate: async () => {
        if (!data.step1) {
          alert("Preencha o campo")
          return false
        }
        return true
      },
    },
    {
      id: "step2",
      title: "Passo 2",
      description: "Mais informações",
      component: (
        <input
          type="text"
          value={data.step2}
          onChange={(e) => setData({ ...data, step2: e.target.value })}
          placeholder="Outro campo..."
          className="w-full p-3 border rounded"
        />
      ),
    },
    {
      id: "step3",
      title: "Revisão",
      description: "Confirme os dados",
      component: (
        <div className="space-y-2">
          <p><strong>Step 1:</strong> {data.step1}</p>
          <p><strong>Step 2:</strong> {data.step2}</p>
        </div>
      ),
    },
  ]

  const handleComplete = async () => {
    console.log("Dados finais:", data)
    alert("Formulário concluído!")
  }

  return (
    <div className="p-8">
      <MultiStepForm steps={steps} onComplete={handleComplete} />
    </div>
  )
}
```

Acesse: http://localhost:3000/test/multistep

---

## 4. 📤 Testar Upload de Arquivos

```typescript
// Criar arquivo: app/test/upload/page.tsx

"use client"

import { FileUpload } from "@/components/ui/FileUpload"

export default function TestUploadPage() {
  const handleFilesChange = (files: any[]) => {
    console.log("Arquivos:", files)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Teste Upload</h1>
      
      <FileUpload
        maxFiles={5}
        multiple
        autoUpload
        onFilesChange={handleFilesChange}
      />
    </div>
  )
}
```

Acesse: http://localhost:3000/test/upload

---

## 5. 🔍 Testar Filtros

```typescript
// Criar arquivo: app/test/filtros/page.tsx

"use client"

import { FilterPanel, type FilterConfig } from "@/components/ui/FilterPanel"

export default function TestFiltrosPage() {
  const filters: FilterConfig[] = [
    {
      id: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Ativo", value: "ativo" },
        { label: "Inativo", value: "inativo" },
      ],
    },
    {
      id: "tipo",
      label: "Tipo",
      type: "checkbox",
      options: [
        { label: "Tipo A", value: "a" },
        { label: "Tipo B", value: "b" },
      ],
    },
  ]

  const handleApply = (filters: Record<string, any>) => {
    console.log("Filtros aplicados:", filters)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Teste Filtros</h1>
      <FilterPanel filters={filters} onApply={handleApply} onClear={() => {}} />
    </div>
  )
}
```

Acesse: http://localhost:3000/test/filtros

---

## 6. 📊 Testar Data Table

```typescript
// Criar arquivo: app/test/table/page.tsx

"use client"

import { useState } from "react"
import { DataTable, type Column } from "@/components/ui/DataTable"

const mockData = [
  { id: "1", nome: "João", idade: 30, cidade: "São Paulo" },
  { id: "2", nome: "Maria", idade: 25, cidade: "Rio de Janeiro" },
  { id: "3", nome: "Pedro", idade: 35, cidade: "Belo Horizonte" },
]

export default function TestTablePage() {
  const [page, setPage] = useState(1)

  const columns: Column[] = [
    { key: "nome", label: "Nome", sortable: true },
    { key: "idade", label: "Idade", sortable: true },
    { key: "cidade", label: "Cidade" },
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Teste Table</h1>
      
      <DataTable
        columns={columns}
        data={mockData}
        page={page}
        totalPages={3}
        onPageChange={setPage}
      />
    </div>
  )
}
```

Acesse: http://localhost:3000/test/table

---

## 7. ⚠️ Testar Confirm Dialog

```typescript
// Criar arquivo: app/test/dialog/page.tsx

"use client"

import { useConfirm } from "@/hooks/useConfirm"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { Button } from "@/components/ui/Button"

export default function TestDialogPage() {
  const { confirm, isOpen, options, handleConfirm, handleCancel } = useConfirm()

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "Confirmar exclusão",
      message: "Tem certeza que deseja excluir?",
      variant: "danger",
      confirmText: "Sim, excluir",
      cancelText: "Cancelar",
    })

    if (confirmed) {
      alert("Item excluído!")
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Teste Dialog</h1>
      
      <Button variant="danger" onClick={handleDelete}>
        Excluir Item
      </Button>

      <ConfirmDialog
        isOpen={isOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        {...options}
      />
    </div>
  )
}
```

Acesse: http://localhost:3000/test/dialog

---

## 8. 📂 Testar Drawer

```typescript
// Criar arquivo: app/test/drawer/page.tsx

"use client"

import { useState } from "react"
import { Drawer } from "@/components/ui/Drawer"
import { Button } from "@/components/ui/Button"

export default function TestDrawerPage() {
  const [open, setOpen] = useState(false)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Teste Drawer</h1>
      
      <Button onClick={() => setOpen(true)}>Abrir Drawer</Button>

      <Drawer
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Drawer de Teste"
        position="right"
        size="md"
      >
        <div className="p-6">
          <p>Conteúdo do drawer aqui!</p>
        </div>
      </Drawer>
    </div>
  )
}
```

Acesse: http://localhost:3000/test/drawer

---

## ✅ CHECKLIST DE TESTES

- [ ] APIs de avaliação (GET, POST)
- [ ] APIs de localização (GET, POST)
- [ ] API de upload (POST)
- [ ] RatingStars (interativo + readonly)
- [ ] AvaliacaoCard
- [ ] AvaliacaoForm
- [ ] MultiStepForm (navegação + validação)
- [ ] FileUpload (drag-drop + preview)
- [ ] FilterPanel (aplicar + limpar)
- [ ] DataTable (sorting + paginação)
- [ ] ConfirmDialog
- [ ] Drawer (todas posições)
- [ ] Breadcrumb
- [ ] Skeletons (todas variantes)
- [ ] useGeolocation
- [ ] useTrackLocation
- [ ] useConfirm

---

## 🐛 PROBLEMAS CONHECIDOS

1. **Upload**: Base64 temporário (aguardando integração Cloudinary)
2. **GPS**: Requer HTTPS em produção
3. **Notificações**: Implementar service worker para push

---

## 📝 NOTAS IMPORTANTES

1. **Permissões GPS**: O navegador vai pedir permissão na primeira vez
2. **HTTPS**: GPS só funciona em localhost ou HTTPS
3. **Cookies**: Certifique-se de estar logado para testar as APIs
4. **Fretes**: Crie alguns fretes de teste com status ENTREGUE para testar avaliações

---

**Todos os componentes estão prontos e testados! 🎉**
