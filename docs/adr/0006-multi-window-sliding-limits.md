# ADR 0006: Governança de Limites Multi-Janela Temporal (5 Horas, Semanal e Mensal)

- **Status:** Aceito
- **Data:** 2026-10-15
- **Decisores:** Arquiteto de Software & Engenharia

## Contexto
Na comercialização corporativa de IA e uso intensivo em IDEs/CLIs (como o OpenCode), apenas um teto mensal é insuficiente para proteger tanto o provedor quanto a empresa contratante contra:
1. **Picos Descontrolados (Burst de Tokens):** Um script em loop infinito ou um agente desgovernado pode consumir toda a cota mensal da empresa em poucas horas.
2. **Modelo de Consumo Justo (Fair Use):** Provedores como Claude e OpenAI aplicam limites por janela deslizante (ex.: janelas de 5 horas no Claude). Empresas querem replicar exatamente essa política para seus funcionários (ex.: "Máximo de 1 milhão de tokens a cada 5 horas e 5 milhões por semana").
3. **Hierarquia Dupla (Tenant e Membro):** O limite precisa ser avaliado nos dois níveis:
   - **Nível Tenant (Empresa):** Teto global de 5h e semanal para proteger o orçamento corporativo total.
   - **Nível Usuário (Colaborador):** Teto de 5h e semanal individual para evitar que um único dev esgote a quota de todos os outros.

## Decisão
Implementar o motor de **Sliding Window / Rolling Quota com Redis** no Data Plane em Go:
1. **Estrutura de Janelas Temporais Suportadas:**
   - **Janela de 5 Horas (`window_5h`):** Medida em tokens ou valor monetário (USD/BRL), reiniciada ou calculada em janela deslizante de 18.000 segundos.
   - **Janela Semanal (`window_weekly`):** Reseta a cada 7 dias (ou início da semana configurado).
   - **Janela Mensal (`window_monthly`):** Cota total contratada do ciclo de faturamento.
2. **Algoritmo de Verificação em Alta Velocidade no Redis:**
   - Para garantir execução em <1ms sem lock no PostgreSQL, o Data Plane utiliza **Redis Buckets com TTL** e scripts Lua atômicos:
     - `quota:tenant:<tenant_id>:5h` (TTL de 18.000s)
     - `quota:tenant:<tenant_id>:week:<ano_semana>` (TTL de 7 dias)
     - `quota:user:<user_id>:5h` (TTL de 18.000s)
     - `quota:user:<user_id>:week:<ano_semana>` (TTL de 7 dias)
3. **Comportamento em Caso de Violação:**
   - Se o limite de 5h for atingido, o gateway responde com HTTP 429 contendo cabeçalho `Retry-After: <segundos_restantes>` e mensagem informativa:
     ```json
     {
       "error": {
         "message": "Limite de 5 horas excedido (consumido: R$ 35,00 / teto: R$ 35,00). Sua janela renovará em 1h 24m.",
         "type": "quota_exceeded",
         "code": "limit_5h_exceeded",
         "resets_in_seconds": 5040
       }
     }
     ```

## Consequências
- **Previsibilidade Financeira:** Previne surpresas na fatura e impede que um único dev zere o saldo da empresa.
- **Transparência no OpenCode:** O OpenCode CLI recebe o tempo exato para o reset da janela de 5 horas e informa o desenvolvedor de forma clara no terminal.
- **Performance:** Avaliação atômica no Redis em <0.5ms sem impacto na latência do streaming.
