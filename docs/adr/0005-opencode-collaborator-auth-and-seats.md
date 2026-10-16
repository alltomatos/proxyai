# ADR 0005: Autenticação de Colaboradores e Governança de Seats no OpenCode CLI/Desktop

- **Status:** Aceito
- **Data:** 2026-10-15
- **Decisores:** Arquiteto de Software & Engenharia

## Contexto
O cliente corporativo (Tenant B2B) precisa contratar planos ou comprar créditos do ProxyAI e distribuir acessos para seus desenvolvedores trabalharem no **OpenCode** (CLI e Desktop). No cenário atual:
1. O desenvolvedor precisava colar manualmente chaves de API cruas (`pk-live-...`) em configurações locais (`opencode.json`), gerando risco de vazamento de segredos no git ou uso descontrolado.
2. A empresa não conseguia limitar quanto cada colaborador gasta individualmente por dia ou mês (ex.: Dev Júnior limitado a $20/mês e proibido de chamar o modelo `o1`, enquanto Tech Lead tem cota de $200/mês com acesso total).
3. O OpenCode não possui nativamente um fluxo de login com usuário e senha corporativo conectado ao ProxyAI.

## Decisão
Implementar no ProxyAI o subsistema **Corporate Seats & OpenCode Auth**:
1. **Credenciais de Colaborador (Member Seats):**
   - Na área do cliente corporativo no Dashboard do ProxyAI, o gestor cadastra o colaborador com `Nome`, `E-mail / Username`, `Senha Provisória`, `Cota Mensal Máxima (USD/BRL)` e `Combos/Modelos Permitidos`.
2. **Protocolo de Login no OpenCode (OAuth 2.0 Device Flow & CLI Login):**
   - O ProxyAI expõe os endpoints:
     - `POST /api/v1/auth/opencode/login`: Permite autenticação direta com `username/password` + `tenant_slug` gerando um Bearer Token de Colaborador (`opc_usr_...`) criptografado.
     - `POST /api/v1/auth/opencode/device`: Fluxo alternativo para terminal onde o CLI gera um código alfanumérico curto de 8 dígitos para o dev autorizar no navegador.
3. **Comando de Setup / Plugin do OpenCode:**
   - Criar comando ou plugin no OpenCode: `opencode auth login --proxy https://proxy.empresa.com`.
   - O OpenCode armazena o token na sua pasta de credenciais seguras (`~/.opencode/auth.json` ou `opencode.json`), sem expor a chave mestra da empresa.
4. **Governança de Limites no Data Plane em Go:**
   - Ao receber `POST /v1/chat/completions` com token `opc_usr_...`:
     - O Data Plane consulta o Redis em <1ms para validar:
       1. Se o Tenant mestre tem saldo/cota.
       2. Se a cota individual do colaborador não foi estourada.
       3. Se o modelo solicitado está na lista permitida do colaborador.
     - Se o colaborador estourar seu teto pessoal, o gateway retorna HTTP 429 com mensagem amigável: `Colaborador atingiu a cota individual de R$ 150,00 definida pela sua organização`.
     - O débito é descontado simultaneamente do saldo da empresa e do acumulador do colaborador.

## Consequências
- **Para a Empresa:** Controle granular de custos por funcionário, auditoria de quem gastou o quê e eliminação de compartilhamento de chaves mestras.
- **Para o Desenvolvedor:** Experiência de login simples e transparente no OpenCode com credenciais da empresa.
- **Para a Arquitetura:** RLS estrito no PostgreSQL e checagem dupla de cotas no Redis (Tenant + Colaborador).
