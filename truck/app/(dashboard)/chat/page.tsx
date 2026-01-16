import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ChatList } from "@/components/chat/ChatList"

export default async function ChatPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Mensagens</h1>
      <ChatList />
    </div>
  )
}
