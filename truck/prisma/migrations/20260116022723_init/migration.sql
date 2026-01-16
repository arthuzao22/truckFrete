-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MOTORISTA', 'CONTRATANTE', 'ADMIN');

-- CreateEnum
CREATE TYPE "TipoVeiculo" AS ENUM ('CAVALO_MECANICO', 'UTILITARIO');

-- CreateEnum
CREATE TYPE "TipoImplemento" AS ENUM ('SEMIRREBOQUE_SIMPLES', 'BITREM', 'RODOTREM', 'REBOQUE_SEMIRREBOQUE', 'PRANCHA', 'EXTENSIVA');

-- CreateEnum
CREATE TYPE "AplicacaoImplemento" AS ENUM ('BAU', 'SIDER', 'GRANELEIRA', 'BASCULANTE', 'TANQUE', 'PRANCHA', 'PORTA_CONTAINER', 'FLORESTAL', 'CANAVIEIRA', 'BOBINEIRA', 'LINHA_EIXOS');

-- CreateEnum
CREATE TYPE "StatusFrete" AS ENUM ('ABERTO', 'NEGOCIANDO', 'ACEITO', 'EM_TRANSPORTE', 'ENTREGUE', 'CANCELADO');

-- CreateEnum
CREATE TYPE "StatusMatch" AS ENUM ('PENDENTE', 'ACEITO', 'RECUSADO');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpfCnpj" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'MOTORISTA',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Veiculo" (
    "id" TEXT NOT NULL,
    "tipo" "TipoVeiculo" NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "anoFabricacao" INTEGER NOT NULL,
    "cor" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "renavam" TEXT NOT NULL,
    "configuracaoTracao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "Veiculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Implemento" (
    "id" TEXT NOT NULL,
    "tipoEstrutura" "TipoImplemento" NOT NULL,
    "tipoAplicacao" "AplicacaoImplemento" NOT NULL,
    "qtdeEixos" INTEGER NOT NULL,
    "placa" TEXT NOT NULL,
    "renavam" TEXT NOT NULL,
    "capacidadePeso" DOUBLE PRECISION NOT NULL,
    "capacidadeVolume" DOUBLE PRECISION,
    "comprimento" DOUBLE PRECISION,
    "largura" DOUBLE PRECISION,
    "altura" DOUBLE PRECISION,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "veiculoId" TEXT NOT NULL,

    CONSTRAINT "Implemento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnuncioRetorno" (
    "id" TEXT NOT NULL,
    "origemCidade" TEXT NOT NULL,
    "origemUf" TEXT NOT NULL,
    "origemLat" DOUBLE PRECISION,
    "origemLng" DOUBLE PRECISION,
    "destinoCidade" TEXT NOT NULL,
    "destinoUf" TEXT NOT NULL,
    "destinoLat" DOUBLE PRECISION,
    "destinoLng" DOUBLE PRECISION,
    "dataDisponivel" TIMESTAMP(3) NOT NULL,
    "raioOperacao" INTEGER NOT NULL,
    "observacoes" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "veiculoId" TEXT NOT NULL,

    CONSTRAINT "AnuncioRetorno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Frete" (
    "id" TEXT NOT NULL,
    "origemCidade" TEXT NOT NULL,
    "origemUf" TEXT NOT NULL,
    "origemLat" DOUBLE PRECISION,
    "origemLng" DOUBLE PRECISION,
    "destinoCidade" TEXT NOT NULL,
    "destinoUf" TEXT NOT NULL,
    "destinoLat" DOUBLE PRECISION,
    "destinoLng" DOUBLE PRECISION,
    "tipoCarga" TEXT NOT NULL,
    "descricaoCarga" TEXT,
    "peso" DOUBLE PRECISION NOT NULL,
    "volume" DOUBLE PRECISION,
    "prazoColeta" TIMESTAMP(3) NOT NULL,
    "prazoEntrega" TIMESTAMP(3) NOT NULL,
    "valorProposto" DOUBLE PRECISION,
    "status" "StatusFrete" NOT NULL DEFAULT 'ABERTO',
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contratanteId" TEXT NOT NULL,
    "motoristaId" TEXT,

    CONSTRAINT "Frete_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "status" "StatusMatch" NOT NULL DEFAULT 'PENDENTE',
    "detalhes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "freteId" TEXT NOT NULL,
    "anuncioId" TEXT NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mensagem" (
    "id" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "remetenteId" TEXT NOT NULL,
    "destinatarioId" TEXT NOT NULL,
    "freteId" TEXT,

    CONSTRAINT "Mensagem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_cpfCnpj_key" ON "Usuario"("cpfCnpj");

-- CreateIndex
CREATE INDEX "Usuario_email_idx" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "Usuario_cpfCnpj_idx" ON "Usuario"("cpfCnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Veiculo_placa_key" ON "Veiculo"("placa");

-- CreateIndex
CREATE UNIQUE INDEX "Veiculo_renavam_key" ON "Veiculo"("renavam");

-- CreateIndex
CREATE INDEX "Veiculo_usuarioId_idx" ON "Veiculo"("usuarioId");

-- CreateIndex
CREATE INDEX "Veiculo_placa_idx" ON "Veiculo"("placa");

-- CreateIndex
CREATE UNIQUE INDEX "Implemento_placa_key" ON "Implemento"("placa");

-- CreateIndex
CREATE UNIQUE INDEX "Implemento_renavam_key" ON "Implemento"("renavam");

-- CreateIndex
CREATE INDEX "Implemento_veiculoId_idx" ON "Implemento"("veiculoId");

-- CreateIndex
CREATE INDEX "Implemento_placa_idx" ON "Implemento"("placa");

-- CreateIndex
CREATE INDEX "AnuncioRetorno_veiculoId_idx" ON "AnuncioRetorno"("veiculoId");

-- CreateIndex
CREATE INDEX "AnuncioRetorno_ativo_idx" ON "AnuncioRetorno"("ativo");

-- CreateIndex
CREATE INDEX "AnuncioRetorno_dataDisponivel_idx" ON "AnuncioRetorno"("dataDisponivel");

-- CreateIndex
CREATE INDEX "Frete_contratanteId_idx" ON "Frete"("contratanteId");

-- CreateIndex
CREATE INDEX "Frete_motoristaId_idx" ON "Frete"("motoristaId");

-- CreateIndex
CREATE INDEX "Frete_status_idx" ON "Frete"("status");

-- CreateIndex
CREATE INDEX "Frete_prazoColeta_idx" ON "Frete"("prazoColeta");

-- CreateIndex
CREATE INDEX "Match_freteId_idx" ON "Match"("freteId");

-- CreateIndex
CREATE INDEX "Match_anuncioId_idx" ON "Match"("anuncioId");

-- CreateIndex
CREATE INDEX "Match_status_idx" ON "Match"("status");

-- CreateIndex
CREATE INDEX "Match_score_idx" ON "Match"("score");

-- CreateIndex
CREATE UNIQUE INDEX "Match_freteId_anuncioId_key" ON "Match"("freteId", "anuncioId");

-- CreateIndex
CREATE INDEX "Mensagem_remetenteId_idx" ON "Mensagem"("remetenteId");

-- CreateIndex
CREATE INDEX "Mensagem_destinatarioId_idx" ON "Mensagem"("destinatarioId");

-- CreateIndex
CREATE INDEX "Mensagem_freteId_idx" ON "Mensagem"("freteId");

-- CreateIndex
CREATE INDEX "Mensagem_createdAt_idx" ON "Mensagem"("createdAt");

-- AddForeignKey
ALTER TABLE "Veiculo" ADD CONSTRAINT "Veiculo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Implemento" ADD CONSTRAINT "Implemento_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "Veiculo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnuncioRetorno" ADD CONSTRAINT "AnuncioRetorno_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "Veiculo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Frete" ADD CONSTRAINT "Frete_contratanteId_fkey" FOREIGN KEY ("contratanteId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Frete" ADD CONSTRAINT "Frete_motoristaId_fkey" FOREIGN KEY ("motoristaId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_freteId_fkey" FOREIGN KEY ("freteId") REFERENCES "Frete"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_anuncioId_fkey" FOREIGN KEY ("anuncioId") REFERENCES "AnuncioRetorno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensagem" ADD CONSTRAINT "Mensagem_remetenteId_fkey" FOREIGN KEY ("remetenteId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensagem" ADD CONSTRAINT "Mensagem_destinatarioId_fkey" FOREIGN KEY ("destinatarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensagem" ADD CONSTRAINT "Mensagem_freteId_fkey" FOREIGN KEY ("freteId") REFERENCES "Frete"("id") ON DELETE CASCADE ON UPDATE CASCADE;
