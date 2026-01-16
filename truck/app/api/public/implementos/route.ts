import { NextResponse } from "next/server"

// GET - Lista tipos de implemento disponíveis
export async function GET() {
  try {
    const tiposImplemento = [
      {
        codigo: "GRANELEIRA",
        nome: "Graneleira",
        icone: "🌾",
        descricao: "Para grãos, farelo, ração a granel",
        cargasAceitas: ["Grãos", "Farelo", "Ração", "Ensacados"]
      },
      {
        codigo: "BAU",
        nome: "Baú Seco",
        icone: "📦",
        descricao: "Carga seca, paletizada, volumes",
        cargasAceitas: ["Carga seca", "Paletizada", "Volumes", "Mercadorias gerais"]
      },
      {
        codigo: "SIDER",
        nome: "Baú Refrigerado / Sider",
        icone: "❄️",
        descricao: "Frigorificados, congelados (-18°C a +5°C)",
        cargasAceitas: ["Frigorificados", "Congelados", "Frios", "Resfriados"]
      },
      {
        codigo: "TANQUE",
        nome: "Tanque",
        icone: "🛢️",
        descricao: "Líquidos, combustíveis, químicos",
        cargasAceitas: ["Líquidos", "Combustíveis", "Químicos", "Alimentos líquidos"]
      },
      {
        codigo: "PRANCHA",
        nome: "Prancha / Carga Baixa",
        icone: "🪵",
        descricao: "Máquinas pesadas, equipamentos",
        cargasAceitas: ["Máquinas", "Equipamentos", "Cargas pesadas", "Implementos agrícolas"]
      },
      {
        codigo: "CEGONHA",
        nome: "Cegonha",
        icone: "🚗",
        descricao: "Transporte de veículos",
        cargasAceitas: ["Veículos leves", "Motos", "SUVs", "Carros"]
      },
      {
        codigo: "BOIADEIRO",
        nome: "Boiadeiro",
        icone: "🐄",
        descricao: "Animais vivos",
        cargasAceitas: ["Bovinos", "Equinos", "Animais vivos"]
      },
      {
        codigo: "BASCULANTE",
        nome: "Basculante",
        icone: "🪨",
        descricao: "Minérios, areia, brita, terra",
        cargasAceitas: ["Minérios", "Areia", "Brita", "Terra", "Cascalho"]
      },
      {
        codigo: "PORTA_CONTAINER",
        nome: "Porta-Container",
        icone: "🔩",
        descricao: "Containers marítimos 20' e 40'",
        cargasAceitas: ["Container 20'", "Container 40'", "Container HC"]
      },
      {
        codigo: "FLORESTAL",
        nome: "Florestal / Carrega-Tudo",
        icone: "🪵",
        descricao: "Madeira, toras, celulose",
        cargasAceitas: ["Madeira", "Toras", "Celulose", "Lenha"]
      },
      {
        codigo: "BOBINEIRA",
        nome: "Bobineira",
        icone: "📐",
        descricao: "Carga lateral, bobinas, chapas",
        cargasAceitas: ["Bobinas", "Chapas", "Perfis metálicos", "Carga lateral"]
      }
    ]

    return NextResponse.json({ data: tiposImplemento })
  } catch (error) {
    console.error("Erro ao listar tipos de implemento:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
