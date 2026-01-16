import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { VeiculosList } from "@/components/veiculos/VeiculosList"

export default async function VeiculosPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Meus Veículos
        </h1>
        <p className="text-gray-600">
          Gerencie seus cavalos mecânicos e implementos rodoviários
        </p>
      </div>
      
      <VeiculosList />
    </div>
  )
}
