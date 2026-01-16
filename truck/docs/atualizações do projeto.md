
---

## 1️⃣ Situação atual do sistema (como é hoje)

Hoje, o seu sistema faz apenas o **cadastro do caminhão**, que tecnicamente é o **Cavalo Mecânico (Caminhão Trator)**.

Esse cadastro representa **somente a unidade tratora**, ou seja, **o veículo que puxa**, mas **não inclui o que ele está transportando**.

Exemplo do que você já cadastra hoje (ou algo muito próximo disso):

* Tipo de veículo: Cavalo mecânico
* Marca
* Modelo
* Ano
* Cor
* Placa
* RENAVAM

👉 **Problema atual:**
Na prática, um caminhão **nunca opera sozinho**. Ele sempre trabalha **acoplado a um implemento rodoviário**, e hoje o sistema **não representa essa realidade operacional**.

---

## 2️⃣ O que muda: necessidade de complemento do caminhão

Você vai precisar **separar o conceito de veículo em duas partes**:

### 🔹 1. Cavalo Mecânico (já existe)

É o caminhão trator, responsável por tracionar o conjunto.

### 🔹 2. Implemento Rodoviário (novo no sistema)

É o **complemento do caminhão**, ou seja, o que define **como e o que ele transporta**.

📌 Esse implemento **não é fixo**:

* Um mesmo cavalo mecânico pode usar **vários tipos de implementos**
* Um implemento pode ser **trocado, removido ou substituído**

---

## 3️⃣ Novo conceito que o sistema precisa entender

O sistema passa a trabalhar com **CONJUNTO VEICULAR**, composto por:

```
Cavalo Mecânico + Implemento Rodoviário
```

Isso reflete a realidade operacional e legal do transporte.

---

## 4️⃣ Detalhamento do Cavalo Mecânico (continua existindo)

Esse cadastro permanece, mas agora com **mais clareza de função**.

### 📋 Campos do Cavalo Mecânico

* Tipo de veículo: Cavalo mecânico (fixo)
* Categoria: Veículo de carga pesada
* Configuração de tração:

  * 4x2
  * 6x2
  * 6x4
* Marca
* Modelo
* Ano de fabricação / modelo
* Cor
* Placa
* RENAVAM

✅ Esse cadastro **não muda muito**, apenas passa a ser **a parte tratora do conjunto**.

---

## 5️⃣ Novo cadastro: Implemento Rodoviário (principal novidade)

Agora entra o **complemento do caminhão**, que é o que o texto descreve em detalhes.

### 5.1️⃣ Tipo de Implemento (estrutura do conjunto)

Define **como o implemento é fisicamente formado**:

* Carreta / Semirreboque simples
* Bitrem (duas unidades articuladas)
* Rodotrem (com dolly intermediário)
* Reboque + Semirreboque
* Prancha / Linha de eixos
* Carreta extensiva / telescópica

📌 **Impacto no sistema**:

* Esse campo define **quantas unidades existem**
* Impacta regras de peso, eixos e permissões

---

### 5.2️⃣ Configuração de Eixos (estrutura técnica)

Define **quantos eixos o conjunto possui**, algo essencial para:

* Legislação
* Cálculo de carga
* Restrições de rodovia

Exemplos:

* 2 eixos
* 3 eixos (trucado)
* 4 eixos
* 5 eixos
* 6 eixos
* 7 eixos
* 9 eixos ou mais (linhas de eixos especiais)

📌 No sistema, isso pode ser:

* Um campo numérico (`qtde_eixos`)
* Ou uma configuração detalhada por eixo (em versões futuras)

---

### 5.3️⃣ Tipo de Carreta por Aplicação (uso do implemento)

Define **para que o implemento serve**, ou seja, **o tipo de carga**.

Exemplos:

* Baú (seca ou frigorificada)
* Sider
* Graneleira
* Basculante
* Tanque (combustível, químico, alimentício)
* Prancha (máquinas e cargas indivisíveis)
* Porta-contêiner
* Florestal
* Canavieira
* Bobineira
* Linha de eixos modular

📌 **Importante:**
Esse campo impacta:

* Tipo de operação
* Restrições de carga
* Regras fiscais e logísticas futuramente

---

## 6️⃣ O que muda na prática no sistema

### Antes

❌ Caminhão era cadastrado como uma coisa só
❌ Não representava a realidade do transporte
❌ Não diferenciava tipo de carga nem conjunto

### Depois

✅ Cadastro separado:

* Cavalo mecânico
* Implemento rodoviário

✅ Associação flexível:

* Um caminhão pode ter vários implementos
* Um implemento pode ser trocado

✅ Base pronta para:

* Controle operacional real
* Regras de peso e eixos
* Evoluções fiscais e logísticas

---

## 7️⃣ Resumo executivo (para documentação ou task)

> Atualmente o sistema realiza apenas o cadastro do cavalo mecânico (caminhão trator).
> Será necessário evoluir o modelo para contemplar o **implemento rodoviário**, permitindo o cadastro e a vinculação de carretas, bitrens, rodotrens e demais configurações.
> Essa separação reflete a realidade do transporte rodoviário, onde o conjunto veicular é formado pela união do cavalo mecânico com um ou mais implementos, cada um com sua configuração estrutural, quantidade de eixos e tipo de aplicação.

---

