import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { RetornoList } from "@/components/retorno/RetornoList"

export default async function RetornoPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const role = session.user.role
  
  if (role !== "MOTORISTA") {
    redirect("/dashboard")
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Anúncios de Retorno</h1>
      <RetornoList />
    </div>
  )
}
