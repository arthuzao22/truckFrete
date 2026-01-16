import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { FretesList } from "@/components/fretes/FretesList"

export default async function FretesPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        {(session.user as any).role === "CONTRATANTE" ? "Meus Fretes" : "Fretes Disponíveis"}
      </h1>
      <FretesList />
    </div>
  )
}
