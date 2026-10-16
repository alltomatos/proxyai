# ADR 0002: Modelo Híbrido de Faturamento e Prevenção de Race Conditions via Ledger Atômico

- **Status:** Aceito
- **Data:** 2026-10-15
- **Decisores:** Arquiteto de Software & Engenharia

## Contexto
O sistema precisa ser comercializado permitindo que clientes utilizem:
1. **Planos Recorrentes:** Cotas mensais de tokens/requisições (ex.: 10 milhões de tokens/mês).
2. **Créditos Pré-Pagos:** Saldo em moeda (BRL/USD) que vai sendo descontado por token gerado.
3. **Margem de Lucro Configurável:** O revendedor pode cobrar um multiplicador ou taxa fixa por milhão de tokens sobre o custo real do provedor upstream.

Em conexões de streaming Server-Sent Events (SSE), a contagem exata de tokens de saída só é confirmada no término do stream. Se múltiplos clientes ou instâncias utilizarem a mesma chave simultaneamente, requisições paralelas podem levar o saldo a valores negativos caso a verificação seja feita apenas no início sem bloqueio prévio.

## Decisão
Implementar o protocolo **Pre-Flight Hold & Post-Flight Settlement**:
1. **Verificação & Reserva (Pre-flight):**
   - Ao receber `POST /v1/chat/completions`, o gateway consulta o Redis via script Lua.
   - O saldo disponível (Crédito Real - Holds Ativos) é testado contra um valor mínimo de segurança (ex.: estimativa de 4096 tokens de saída).
   - Se aprovado, uma reserva atômica (Hold com TTL de 5 minutos) é gravada no Redis.
2. **Streaming em Trânsito:**
   - O fluxo de tokens é transmitido para o cliente em tempo real, enquanto um contador leve no gateway monitora o tamanho dos deltas e procura o bloco `usage` do upstream.
3. **Liquidação Efetiva (Settlement):**
   - Ao emitir `[DONE]`, o gateway executa um commit no Redis (remove o Hold) e envia um evento para a fila assíncrona que grava a transação na tabela `credit_ledger` no PostgreSQL.
   - Em caso de desconexão abrupta do cliente ou queda do upstream, cobra-se apenas os tokens consumidos até o momento da quebra.

## Consequências
- **Garantia:** Zero possibilidade de saldo negativo em contas pré-pagas sob alta concorrência.
- **Tolerância a Falhas:** TTL automático no Redis garante que requisições interrompidas por pane do servidor não bloqueiem o saldo do cliente eternamente.
