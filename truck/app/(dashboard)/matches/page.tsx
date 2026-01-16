import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { MatchesList } from "@/components/matches/MatchesList"

export default async function MatchesPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const role = (session.user as any).role
  
  if (role !== "CONTRATANTE") {
    redirect("/dashboard")
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Matches Inteligentes</h1>
      <p className="text-gray-600 mb-6">
        Nossa IA encontrou os melhores veículos para seus fretes
      </p>
      <MatchesList />
    </div>
  )
}
