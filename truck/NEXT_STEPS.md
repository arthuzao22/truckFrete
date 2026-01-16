# 🚀 FreteConnect 2.0 - Guia de Continuação

## 📋 Como Continuar o Desenvolvimento

Este guia fornece instruções detalhadas para dar continuidade ao projeto FreteConnect 2.0.

---

## ✅ O que já está implementado

### Sistema Base (100%)
- ✅ Design system completo (`lib/design-system.ts`)
- ✅ Componentes UI base (Button, Card, Modal, Toast, Badge)
- ✅ Landing page premium com animações
- ✅ Utilitários (formatação, validação, cálculos)
- ✅ Estado global Zustand
- ✅ Banco de dados expandido (7 novos models)
- ✅ 3 APIs REST (notificações, documentos, wallet)
- ✅ Dashboard renovado
- ✅ TypeScript strict mode

---

## 🎯 Próximas Implementações Prioritárias

### 1. Chat em Tempo Real (ALTA PRIORIDADE)

#### Socket.io Server Setup

```typescript
// lib/socket.ts
import { Server } from "socket.io"

export function initSocketServer(httpServer: any) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXTAUTH_URL,
      methods: ["GET", "POST"]
    }
  })

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id)

    // Join user room
    socket.on("join", (userId: string) => {
      socket.join(`user:${userId}`)
    })

    // Chat message
    socket.on("message", async (data) => {
      const { freteId, remetenteId, destinatarioId, conteudo } = data
      
      // Salvar no banco
      const mensagem = await prisma.mensagem.create({
        data: {
          conteudo,
          remetenteId,
          destinatarioId,
          freteId
        },
        include: {
          remetente: {
            select: { nome: true }
          }
        }
      })

      // Enviar para destinatário
      io.to(`user:${destinatarioId}`).emit("message", mensagem)
    })

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id)
    })
  })

  return io
}
```

#### React Hook

```typescript
// hooks/useChat.ts
"use client"

import { useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"

export function useChat(userId: string) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [messages, setMessages] = useState<any[]>([])

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL!)
    newSocket.emit("join", userId)

    newSocket.on("message", (message) => {
      setMessages(prev => [...prev, message])
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [userId])

  const sendMessage = (data: any) => {
    socket?.emit("message", data)
  }

  return { socket, messages, sendMessage }
}
```

#### Componente de Chat

```typescript
// components/chat/ChatBox.tsx
"use client"

import { useState } from "react"
import { useChat } from "@/hooks/useChat"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Send } from "lucide-react"

export function ChatBox({ freteId, userId, destinatarioId }: any) {
  const [input, setInput] = useState("")
  const { messages, sendMessage } = useChat(userId)

  const handleSend = () => {
    if (!input.trim()) return
    sendMessage({
      freteId,
      remetenteId: userId,
      destinatarioId,
      conteudo: input
    })
    setInput("")
  }

  return (
    <Card variant="glass">
      <div className="space-y-4">
        {/* Messages */}
        <div className="h-96 overflow-y-auto space-y-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded-lg ${
                msg.remetenteId === userId
                  ? "bg-blue-500/20 ml-auto"
                  : "bg-gray-700/50"
              } max-w-[80%]`}
            >
              <p className="text-sm text-white">{msg.conteudo}</p>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Digite sua mensagem..."
            fullWidth
          />
          <Button onClick={handleSend} icon={<Send className="h-4 w-4" />}>
            Enviar
          </Button>
        </div>
      </div>
    </Card>
  )
}
```

---

### 2. Upload de Imagens (ALTA PRIORIDADE)

#### Cloudinary Setup

```typescript
// lib/cloudinary.ts
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function uploadImage(file: File) {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "freteconnect",
          resource_type: "image"
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      .end(buffer)
  })
}
```

#### Componente de Upload

```typescript
// components/ui/ImageUpload.tsx
"use client"

import { useState } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "./Button"

export function ImageUpload({ onUpload }: { onUpload: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    // Preview local
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)

    // Upload
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      })
      const { url } = await res.json()
      onUpload(url)
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            onClick={() => setPreview(null)}
            className="absolute top-2 right-2 p-1 bg-red-500 rounded-full"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
          <Upload className="h-12 w-12 text-gray-500 mb-2" />
          <span className="text-sm text-gray-400">
            Clique para fazer upload
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      )}
      {uploading && <p className="text-sm text-gray-400">Fazendo upload...</p>}
    </div>
  )
}
```

---

### 3. Gráficos com Recharts (MÉDIA PRIORIDADE)

```typescript
// components/dashboard/RevenueChart.tsx
"use client"

import { Card } from "@/components/ui/Card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"

const data = [
  { mes: "Jan", valor: 4000 },
  { mes: "Fev", valor: 3000 },
  { mes: "Mar", valor: 5000 },
  { mes: "Abr", valor: 4500 },
  { mes: "Mai", valor: 6000 },
  { mes: "Jun", valor: 5500 }
]

export function RevenueChart() {
  return (
    <Card variant="glass">
      <h3 className="text-xl font-bold text-white mb-4">
        Faturamento (6 meses)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="mes" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "8px"
            }}
          />
          <Line
            type="monotone"
            dataKey="valor"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ fill: "#3B82F6", r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
```

---

### 4. Rastreamento GPS (MÉDIA PRIORIDADE)

```typescript
// components/maps/TrackingMap.tsx
"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/Card"

export function TrackingMap({ freteId }: { freteId: string }) {
  const [position, setPosition] = useState<any>(null)

  useEffect(() => {
    // Buscar posição inicial
    fetch(`/api/localizacao/${freteId}`)
      .then(res => res.json())
      .then(data => setPosition(data))

    // WebSocket para updates
    // TODO: Implementar Socket.io listener
  }, [freteId])

  if (!position) return <div>Carregando mapa...</div>

  return (
    <Card variant="glass">
      <h3 className="text-xl font-bold text-white mb-4">
        Rastreamento em Tempo Real
      </h3>
      {/* TODO: Integrar Google Maps ou Mapbox */}
      <div className="h-96 bg-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">Mapa será exibido aqui</p>
      </div>
      <div className="mt-4 space-y-2">
        <p className="text-sm text-gray-400">
          Última atualização: {new Date().toLocaleString("pt-BR")}
        </p>
        <p className="text-sm text-gray-400">
          Velocidade: {position.velocidade || 0} km/h
        </p>
      </div>
    </Card>
  )
}
```

---

## 🔧 Configurações Necessárias

### .env.local

```env
# Core
DATABASE_URL="postgresql://user:pass@localhost:5432/freteconnect"
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# Upload
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="..."

# Socket.io
NEXT_PUBLIC_SOCKET_URL="http://localhost:3001"

# Payment (opcional)
STRIPE_SECRET_KEY="..."
STRIPE_PUBLISHABLE_KEY="..."
```

---

## 📝 Checklist de Implementação

### Chat Real-time
- [ ] Configurar Socket.io server
- [ ] Criar hook useChat
- [ ] Componente ChatBox
- [ ] Lista de conversas
- [ ] Notificações de mensagem

### Upload
- [ ] Configurar Cloudinary/S3
- [ ] API /api/upload
- [ ] Componente ImageUpload
- [ ] Preview de imagens
- [ ] Compressão automática

### Gráficos
- [ ] RevenueChart
- [ ] FreightChart
- [ ] ActivityTimeline
- [ ] Integrar no dashboard

### GPS
- [ ] API de localização
- [ ] Integrar Google Maps
- [ ] WebSocket updates
- [ ] Cálculo de ETA

---

## 🚀 Scripts Úteis

```bash
# Dev
npm run dev

# Build
npm run build

# Prisma
npx prisma studio
npx prisma generate
npx prisma migrate dev

# Lint
npm run lint
```

---

## 📚 Referências

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Socket.io Docs](https://socket.io/docs/)
- [Recharts Docs](https://recharts.org/)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Framer Motion Docs](https://www.framer.com/motion/)

---

## 💡 Dicas

1. **Commits Frequentes**: Faça commits pequenos e descritivos
2. **Testes**: Teste cada feature antes de seguir para a próxima
3. **Documentação**: Atualize o README quando adicionar features
4. **Performance**: Use React.memo e useMemo quando necessário
5. **Segurança**: Sempre valide dados no backend

---

## ❓ Dúvidas Comuns

### Como adicionar um novo componente UI?

```typescript
// 1. Criar arquivo em components/ui/
// 2. Seguir padrão de Button/Card
// 3. Usar design tokens de lib/design-system.ts
// 4. Adicionar animações Framer Motion se necessário
```

### Como criar uma nova API?

```typescript
// 1. Criar diretório em app/api/
// 2. Criar route.ts com handlers (GET, POST, etc)
// 3. Adicionar validação Zod
// 4. Verificar auth com await auth()
// 5. Usar prisma para banco de dados
```

### Como expandir o Prisma schema?

```bash
# 1. Editar prisma/schema.prisma
# 2. Rodar: npx prisma migrate dev --name nome_da_migration
# 3. Rodar: npx prisma generate
```

---

## 🎯 Meta Final

Transformar FreteConnect 2.0 de **80% → 100%** completando:
- Chat em tempo real
- Upload de imagens
- Gráficos interativos
- Rastreamento GPS
- Integração de pagamentos
- PWA completo

**Boa sorte! 🚀**

---

**Última Atualização**: Janeiro 2025
**Versão**: 2.0-alpha
