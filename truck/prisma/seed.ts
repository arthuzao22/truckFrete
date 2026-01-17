import { PrismaClient, Role, TipoVeiculo, TipoImplemento, AplicacaoImplemento, StatusFrete, StatusMatch } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

// Configurar conexão com o banco
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL
if (!connectionString) {
    throw new Error('DATABASE_URL ou DIRECT_URL não configurado')
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('🌱 Iniciando seed do banco de dados...')

    // Limpar dados existentes
    await prisma.mensagem.deleteMany()
    await prisma.match.deleteMany()
    await prisma.frete.deleteMany()
    await prisma.anuncioRetorno.deleteMany()
    await prisma.implemento.deleteMany()
    await prisma.veiculo.deleteMany()
    await prisma.usuario.deleteMany()

    console.log('🗑️  Dados antigos removidos')

    // Hash de senha padrão (senha: 123456)
    const senhaHash = await bcrypt.hash('123456', 10)

    // =============================
    // CRIAR USUÁRIOS
    // =============================
    console.log('👤 Criando usuários...')

    const motorista1 = await prisma.usuario.create({
        data: {
            email: 'joao.silva@email.com',
            senha: senhaHash,
            nome: 'João da Silva',
            cpfCnpj: '123.456.789-00',
            telefone: '(11) 99999-1111',
            role: Role.MOTORISTA,
        },
    })

    const motorista2 = await prisma.usuario.create({
        data: {
            email: 'pedro.santos@email.com',
            senha: senhaHash,
            nome: 'Pedro Santos',
            cpfCnpj: '234.567.890-11',
            telefone: '(21) 99999-2222',
            role: Role.MOTORISTA,
        },
    })

    const motorista3 = await prisma.usuario.create({
        data: {
            email: 'carlos.oliveira@email.com',
            senha: senhaHash,
            nome: 'Carlos Oliveira',
            cpfCnpj: '345.678.901-22',
            telefone: '(31) 99999-3333',
            role: Role.MOTORISTA,
        },
    })

    const contratante1 = await prisma.usuario.create({
        data: {
            email: 'transportes.rapido@empresa.com',
            senha: senhaHash,
            nome: 'Transportes Rápido LTDA',
            cpfCnpj: '12.345.678/0001-90',
            telefone: '(11) 3333-4444',
            role: Role.CONTRATANTE,
        },
    })

    const contratante2 = await prisma.usuario.create({
        data: {
            email: 'logistica.brasil@empresa.com',
            senha: senhaHash,
            nome: 'Logística Brasil SA',
            cpfCnpj: '23.456.789/0001-01',
            telefone: '(21) 3333-5555',
            role: Role.CONTRATANTE,
        },
    })

    const admin = await prisma.usuario.create({
        data: {
            email: 'admin@freteconnect.com',
            senha: senhaHash,
            nome: 'Administrador',
            cpfCnpj: '000.000.000-00',
            telefone: '(11) 0000-0000',
            role: Role.ADMIN,
        },
    })

    console.log(`✅ ${6} usuários criados`)

    // =============================
    // CRIAR VEÍCULOS
    // =============================
    console.log('🚛 Criando veículos...')

    const veiculo1 = await prisma.veiculo.create({
        data: {
            tipo: TipoVeiculo.CAVALO_MECANICO,
            marca: 'Scania',
            modelo: 'R450',
            anoFabricacao: 2022,
            cor: 'Branco',
            placa: 'ABC-1234',
            renavam: '12345678901',
            configuracaoTracao: '6x4',
            usuarioId: motorista1.id,
        },
    })

    const veiculo2 = await prisma.veiculo.create({
        data: {
            tipo: TipoVeiculo.CAVALO_MECANICO,
            marca: 'Volvo',
            modelo: 'FH 540',
            anoFabricacao: 2021,
            cor: 'Vermelho',
            placa: 'DEF-5678',
            renavam: '23456789012',
            configuracaoTracao: '6x2',
            usuarioId: motorista2.id,
        },
    })

    const veiculo3 = await prisma.veiculo.create({
        data: {
            tipo: TipoVeiculo.UTILITARIO,
            marca: 'Mercedes-Benz',
            modelo: 'Sprinter 516',
            anoFabricacao: 2023,
            cor: 'Prata',
            placa: 'GHI-9012',
            renavam: '34567890123',
            usuarioId: motorista3.id,
        },
    })

    const veiculo4 = await prisma.veiculo.create({
        data: {
            tipo: TipoVeiculo.CAVALO_MECANICO,
            marca: 'DAF',
            modelo: 'XF 530',
            anoFabricacao: 2023,
            cor: 'Azul',
            placa: 'JKL-3456',
            renavam: '45678901234',
            configuracaoTracao: '6x4',
            usuarioId: motorista1.id,
        },
    })

    console.log(`✅ ${4} veículos criados`)

    // =============================
    // CRIAR IMPLEMENTOS
    // =============================
    console.log('📦 Criando implementos...')

    await prisma.implemento.create({
        data: {
            tipoEstrutura: TipoImplemento.SEMIRREBOQUE_SIMPLES,
            tipoAplicacao: AplicacaoImplemento.BAU,
            qtdeEixos: 3,
            placa: 'IMP-0001',
            renavam: '11111111111',
            capacidadePeso: 28000,
            capacidadeVolume: 90,
            comprimento: 14.8,
            largura: 2.6,
            altura: 2.8,
            veiculoId: veiculo1.id,
        },
    })

    await prisma.implemento.create({
        data: {
            tipoEstrutura: TipoImplemento.BITREM,
            tipoAplicacao: AplicacaoImplemento.GRANELEIRA,
            qtdeEixos: 5,
            placa: 'IMP-0002',
            renavam: '22222222222',
            capacidadePeso: 57000,
            capacidadeVolume: 120,
            comprimento: 19.8,
            largura: 2.6,
            altura: 2.5,
            veiculoId: veiculo2.id,
        },
    })

    await prisma.implemento.create({
        data: {
            tipoEstrutura: TipoImplemento.SEMIRREBOQUE_SIMPLES,
            tipoAplicacao: AplicacaoImplemento.SIDER,
            qtdeEixos: 3,
            placa: 'IMP-0003',
            renavam: '33333333333',
            capacidadePeso: 26000,
            capacidadeVolume: 85,
            comprimento: 14.0,
            largura: 2.6,
            altura: 2.7,
            veiculoId: veiculo4.id,
        },
    })

    await prisma.implemento.create({
        data: {
            tipoEstrutura: TipoImplemento.PRANCHA,
            tipoAplicacao: AplicacaoImplemento.PRANCHA,
            qtdeEixos: 4,
            placa: 'IMP-0004',
            renavam: '44444444444',
            capacidadePeso: 45000,
            comprimento: 18.0,
            largura: 3.0,
            veiculoId: veiculo1.id,
        },
    })

    console.log(`✅ ${4} implementos criados`)

    // Buscar implementos criados com verificação
    const implementos = await prisma.implemento.findMany()
    const implemento1 = implementos.find(i => i.placa === 'IMP-0001')
    const implemento2 = implementos.find(i => i.placa === 'IMP-0002')
    const implemento3 = implementos.find(i => i.placa === 'IMP-0003')
    const implemento4 = implementos.find(i => i.placa === 'IMP-0004')

    if (!implemento1 || !implemento2 || !implemento3 || !implemento4) {
        throw new Error('Implementos não encontrados após criação')
    }

    // =============================
    // CRIAR ANÚNCIOS DE RETORNO
    // =============================
    console.log('🔄 Criando anúncios de retorno...')

    const anuncio1 = await prisma.anuncioRetorno.create({
        data: {
            origemCidade: 'São Paulo',
            origemUf: 'SP',
            origemLat: -23.5505,
            origemLng: -46.6333,
            destinoCidade: 'Rio de Janeiro',
            destinoUf: 'RJ',
            destinoLat: -22.9068,
            destinoLng: -43.1729,
            dataSaida: new Date('2026-01-20'),
            raioOperacao: 100,
            observacoes: 'Disponível para carga geral ou refrigerada',
            motoristaId: motorista1.id,
            veiculoId: veiculo1.id,
            implementoId: implemento1.id
        },
    })

    const anuncio2 = await prisma.anuncioRetorno.create({
        data: {
            origemCidade: 'Belo Horizonte',
            origemUf: 'MG',
            origemLat: -19.9167,
            origemLng: -43.9345,
            destinoCidade: 'São Paulo',
            destinoUf: 'SP',
            destinoLat: -23.5505,
            destinoLng: -46.6333,
            dataSaida: new Date('2026-01-22'),
            raioOperacao: 150,
            observacoes: 'Preferência para grãos',
            motoristaId: motorista1.id,
            veiculoId: veiculo2.id,
            implementoId: implemento2.id
        },
    })

    const anuncio3 = await prisma.anuncioRetorno.create({
        data: {
            origemCidade: 'Curitiba',
            origemUf: 'PR',
            origemLat: -25.4284,
            origemLng: -49.2733,
            destinoCidade: 'Florianópolis',
            destinoUf: 'SC',
            destinoLat: -27.5954,
            destinoLng: -48.548,
            dataSaida: new Date('2026-01-18'),
            raioOperacao: 80,
            motoristaId: motorista1.id,
            veiculoId: veiculo4.id,
            implementoId: implemento3.id
        },
    })

    // Anúncios adicionais para ter mais dados variados
    await prisma.anuncioRetorno.create({
        data: {
            origemCidade: 'Porto Alegre',
            origemUf: 'RS',
            origemLat: -30.0346,
            origemLng: -51.2177,
            destinoCidade: 'São Paulo',
            destinoUf: 'SP',
            destinoLat: -23.5505,
            destinoLng: -46.6333,
            dataSaida: new Date('2026-01-25'),
            raioOperacao: 200,
            capacidadeDisponivel: 'TOTAL',
            pesoDisponivel: 28000,
            volumeDisponivel: 90,
            tiposCargaAceita: ['Eletrônicos', 'Alimentos', 'Móveis'],
            precoSugerido: 5500,
            precoNegociavel: true,
            observacoes: 'Caminhão com rastreamento, experiência com cargas frágeis',
            motoristaId: motorista1.id,
            veiculoId: veiculo1.id,
            implementoId: implemento1.id
        },
    })

    await prisma.anuncioRetorno.create({
        data: {
            origemCidade: 'Salvador',
            origemUf: 'BA',
            origemLat: -12.9714,
            origemLng: -38.5014,
            destinoCidade: 'Recife',
            destinoUf: 'PE',
            destinoLat: -8.0476,
            destinoLng: -34.877,
            dataSaida: new Date('2026-01-23'),
            raioOperacao: 150,
            capacidadeDisponivel: 'PARCIAL',
            pesoDisponivel: 20000,
            tiposCargaAceita: ['Grãos', 'Insumos Agrícolas'],
            precoSugerido: 3800,
            precoNegociavel: false,
            motoristaId: motorista2.id,
            veiculoId: veiculo2.id,
            implementoId: implemento2.id
        },
    })

    await prisma.anuncioRetorno.create({
        data: {
            origemCidade: 'Manaus',
            origemUf: 'AM',
            origemLat: -3.119,
            origemLng: -60.0217,
            destinoCidade: 'Belém',
            destinoUf: 'PA',
            destinoLat: -1.4558,
            destinoLng: -48.4902,
            dataSaida: new Date('2026-01-28'),
            dataChegadaEstimada: new Date('2026-01-30'),
            flexibilidadeDias: 3,
            capacidadeDisponivel: 'TOTAL',
            pesoDisponivel: 45000,
            tiposCargaAceita: ['Container', 'Carga Geral'],
            precoSugerido: 12000,
            precoNegociavel: true,
            observacoes: 'Rota pela BR-319, preço inclui balsa',
            motoristaId: motorista1.id,
            veiculoId: veiculo1.id,
            implementoId: implemento4.id
        },
    })

    await prisma.anuncioRetorno.create({
        data: {
            origemCidade: 'Goiânia',
            origemUf: 'GO',
            origemLat: -16.6869,
            origemLng: -49.2648,
            destinoCidade: 'Uberlândia',
            destinoUf: 'MG',
            destinoLat: -18.9186,
            destinoLng: -48.2772,
            dataSaida: new Date('2026-01-19'),
            raioOperacao: 100,
            capacidadeDisponivel: 'TOTAL',
            tiposCargaAceita: ['Máquinas', 'Equipamentos Pesados'],
            precoNegociavel: true,
            motoristaId: motorista1.id,
            veiculoId: veiculo4.id,
            implementoId: implemento3.id
        },
    })

    await prisma.anuncioRetorno.create({
        data: {
            origemCidade: 'Vitória',
            origemUf: 'ES',
            origemLat: -20.3155,
            origemLng: -40.3128,
            destinoCidade: 'Rio de Janeiro',
            destinoUf: 'RJ',
            destinoLat: -22.9068,
            destinoLng: -43.1729,
            dataSaida: new Date('2026-01-21'),
            flexibilidadeDias: 2,
            capacidadeDisponivel: 'PARCIAL',
            pesoDisponivel: 15000,
            volumeDisponivel: 50,
            tiposCargaAceita: ['Bebidas', 'Alimentos', 'Carga Geral'],
            precoSugerido: 2200,
            precoNegociavel: true,
            observacoes: 'Disponível para coleta no porto de Vitória',
            motoristaId: motorista2.id,
            veiculoId: veiculo2.id,
            implementoId: implemento2.id
        },
    })

    console.log(`✅ ${8} anúncios de retorno criados`)

    // =============================
    // CRIAR FRETES
    // =============================
    console.log('📋 Criando fretes...')

    const frete1 = await prisma.frete.create({
        data: {
            origemCidade: 'São Paulo',
            origemUf: 'SP',
            origemLat: -23.5505,
            origemLng: -46.6333,
            destinoCidade: 'Rio de Janeiro',
            destinoUf: 'RJ',
            destinoLat: -22.9068,
            destinoLng: -43.1729,
            tipoCarga: 'Eletrônicos',
            descricaoCarga: 'Carga de equipamentos eletrônicos para varejo',
            peso: 15000,
            volume: 60,
            prazoColeta: new Date('2026-01-19'),
            prazoEntrega: new Date('2026-01-21'),
            valorProposto: 4500,
            status: StatusFrete.ABERTO,
            contratanteId: contratante1.id,
        },
    })

    const frete2 = await prisma.frete.create({
        data: {
            origemCidade: 'Campinas',
            origemUf: 'SP',
            origemLat: -22.9099,
            origemLng: -47.0626,
            destinoCidade: 'Belo Horizonte',
            destinoUf: 'MG',
            destinoLat: -19.9167,
            destinoLng: -43.9345,
            tipoCarga: 'Alimentos',
            descricaoCarga: 'Produtos alimentícios não perecíveis',
            peso: 25000,
            volume: 80,
            prazoColeta: new Date('2026-01-20'),
            prazoEntrega: new Date('2026-01-22'),
            valorProposto: 5200,
            status: StatusFrete.ABERTO,
            contratanteId: contratante2.id,
        },
    })

    const frete3 = await prisma.frete.create({
        data: {
            origemCidade: 'Santos',
            origemUf: 'SP',
            origemLat: -23.9608,
            origemLng: -46.3336,
            destinoCidade: 'Curitiba',
            destinoUf: 'PR',
            destinoLat: -25.4284,
            destinoLng: -49.2733,
            tipoCarga: 'Container',
            descricaoCarga: 'Container 40 pés com mercadoria importada',
            peso: 20000,
            prazoColeta: new Date('2026-01-21'),
            prazoEntrega: new Date('2026-01-24'),
            valorProposto: 6800,
            status: StatusFrete.NEGOCIANDO,
            contratanteId: contratante1.id,
            motoristaId: motorista1.id,
        },
    })

    const frete4 = await prisma.frete.create({
        data: {
            origemCidade: 'Goiânia',
            origemUf: 'GO',
            origemLat: -16.6869,
            origemLng: -49.2648,
            destinoCidade: 'Brasília',
            destinoUf: 'DF',
            destinoLat: -15.7942,
            destinoLng: -47.8822,
            tipoCarga: 'Grãos',
            descricaoCarga: 'Soja em grãos para exportação',
            peso: 55000,
            volume: 100,
            prazoColeta: new Date('2026-01-18'),
            prazoEntrega: new Date('2026-01-19'),
            valorProposto: 3200,
            status: StatusFrete.EM_TRANSPORTE,
            contratanteId: contratante2.id,
            motoristaId: motorista2.id,
        },
    })

    const frete5 = await prisma.frete.create({
        data: {
            origemCidade: 'Porto Alegre',
            origemUf: 'RS',
            origemLat: -30.0346,
            origemLng: -51.2177,
            destinoCidade: 'Florianópolis',
            destinoUf: 'SC',
            destinoLat: -27.5954,
            destinoLng: -48.548,
            tipoCarga: 'Móveis',
            descricaoCarga: 'Mudança residencial completa',
            peso: 8000,
            volume: 50,
            prazoColeta: new Date('2026-01-25'),
            prazoEntrega: new Date('2026-01-26'),
            valorProposto: 2800,
            status: StatusFrete.ABERTO,
            contratanteId: contratante1.id,
        },
    })

    console.log(`✅ ${5} fretes criados`)

    // =============================
    // CRIAR MATCHES
    // =============================
    console.log('🔗 Criando matches...')

    await prisma.match.create({
        data: {
            score: 95.5,
            status: StatusMatch.ACEITO,
            detalhes: JSON.stringify({
                distanciaOrigem: 0,
                distanciaDestino: 0,
                compatibilidadeCarga: 100,
                compatibilidadeData: 95,
            }),
            freteId: frete1.id,
            anuncioId: anuncio1.id,
        },
    })

    await prisma.match.create({
        data: {
            score: 78.3,
            status: StatusMatch.PENDENTE,
            detalhes: JSON.stringify({
                distanciaOrigem: 50,
                distanciaDestino: 80,
                compatibilidadeCarga: 85,
                compatibilidadeData: 75,
            }),
            freteId: frete2.id,
            anuncioId: anuncio2.id,
        },
    })

    await prisma.match.create({
        data: {
            score: 62.0,
            status: StatusMatch.RECUSADO,
            detalhes: JSON.stringify({
                distanciaOrigem: 200,
                distanciaDestino: 100,
                compatibilidadeCarga: 60,
                compatibilidadeData: 50,
            }),
            freteId: frete5.id,
            anuncioId: anuncio3.id,
        },
    })

    console.log(`✅ ${3} matches criados`)

    // =============================
    // CRIAR MENSAGENS
    // =============================
    console.log('💬 Criando mensagens...')

    await prisma.mensagem.create({
        data: {
            conteudo: 'Olá! Vi seu frete para o Rio de Janeiro. Tenho disponibilidade para fazer o transporte.',
            remetenteId: motorista1.id,
            destinatarioId: contratante1.id,
            freteId: frete1.id,
        },
    })

    await prisma.mensagem.create({
        data: {
            conteudo: 'Ótimo! Qual seria o valor que você propõe?',
            remetenteId: contratante1.id,
            destinatarioId: motorista1.id,
            freteId: frete1.id,
        },
    })

    await prisma.mensagem.create({
        data: {
            conteudo: 'Posso fazer por R$ 4.200,00. Meu caminhão está disponível e tenho experiência com eletrônicos.',
            remetenteId: motorista1.id,
            destinatarioId: contratante1.id,
            freteId: frete1.id,
        },
    })

    await prisma.mensagem.create({
        data: {
            conteudo: 'Interesse no frete de grãos. Meu bitrem está disponível.',
            remetenteId: motorista2.id,
            destinatarioId: contratante2.id,
            freteId: frete4.id,
        },
    })

    await prisma.mensagem.create({
        data: {
            conteudo: 'Perfeito! Vamos fechar. A coleta será amanhã às 6h.',
            lida: true,
            remetenteId: contratante2.id,
            destinatarioId: motorista2.id,
            freteId: frete4.id,
        },
    })

    console.log(`✅ ${5} mensagens criadas`)

    console.log('')
    console.log('🎉 Seed concluído com sucesso!')
    console.log('')
    console.log('📊 Resumo:')
    console.log('   - 6 usuários (3 motoristas, 2 contratantes, 1 admin)')
    console.log('   - 4 veículos')
    console.log('   - 4 implementos')
    console.log('   - 8 anúncios de retorno')
    console.log('   - 5 fretes')
    console.log('   - 3 matches')
    console.log('   - 5 mensagens')
    console.log('')
    console.log('🔑 Credenciais de teste:')
    console.log('   Email: joao.silva@email.com | Senha: 123456 (Motorista)')
    console.log('   Email: transportes.rapido@empresa.com | Senha: 123456 (Contratante)')
    console.log('   Email: admin@freteconnect.com | Senha: 123456 (Admin)')
}

main()
    .catch((e) => {
        console.error('❌ Erro durante o seed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
