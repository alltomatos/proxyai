# Guia de Especificação e Desenvolvimento: Gestão de Colaboradores & OpenCode Seats

> **Módulo:** `frontend/src/pages/collaborators`  
> **Status:** Aprovado para Implementação  
> **Tema:** Clean Light & Colorful Enterprise  
> **Referência Visual:** `design-system/pages/collaborators/mockups/`

---

## 1. Visão Geral do Módulo
A gestão de colaboradores corporativos para o OpenCode foi concebida através de **duas páginas dedicadas** (evitando formulários comprimidos em modais para comportar múltiplas regras, governança de modelos e cotas temporais):

1. **Página de Listagem de Membros (`/collaborators`):**
   - Tabela com os desenvolvedores da empresa, barras de consumo pessoal, status (`ATIVO`, `ALERTA`, `429 CAP`), modelos autorizados e atalho do comando CLI.
2. **Página Dedicada de Cadastro e Edição (`/collaborators/new` ou `/collaborators/:id`):**
   - **Formulário Completo de 2 Colunas:**
     - **Coluna Principal (Esquerda):** Dados do colaborador (Nome, E-mail corporativo, Senha de login no OpenCode, Cargo/Squad), matriz de permissões de modelos (Fast-Coder, Modelos Avançados, Modelos de Ultra-Raciocínio) e flags de ferramentas (MCP integrado, Proxies Webshare).
     - **Coluna Lateral (Direita):** Configuração de governança multi-janela temporal (Janela Móvel de 5 Horas, Teto Semanal e Teto Mensal) + terminal box exibindo o preview do comando que o dev deverá rodar.

---

## 2. Componentes e Estrutura de Arquivos

```
src/pages/collaborators/
├── index.tsx                         # Listagem dos membros da equipe
├── form.tsx                          # Página dedicada de cadastro/edição (Substitui o modal)
├── components/
│   ├── SeatSummaryCards.tsx          # Seats ativos, consumo acumulado e médias
│   ├── CollaboratorTable.tsx         # Tabela de desenvolvedores e barras de progresso
│   ├── MultiWindowLimitsCard.tsx     # Inputs das janelas de 5h, semanal e mensal
│   ├── ModelPermissionMatrix.tsx     # Matriz de permissão por categoria de modelo
│   └── OpenCodeCliTerminalBox.tsx    # Card visual com comando CLI customizado
└── modals/
    └── ResetUserPasswordModal.tsx    # Modal rápido exclusivo para redefinição de credencial
```

---

## 3. Mockups SVG do Módulo

| Arquivo SVG | Descrição |
| :--- | :--- |
| [`mockups/page-layout.svg`](mockups/page-layout.svg) | Visão geral da listagem de colaboradores e status no OpenCode. |
| [`mockups/page-collaborator-form.svg`](mockups/page-collaborator-form.svg) | **Nova Página Dedicada:** Formulário completo de cadastro, permissões e limites multi-janela. |
| [`mockups/collaborator-table-row.svg`](mockups/collaborator-table-row.svg) | Linha da tabela com barra de consumo pessoal e badges. |
| [`mockups/modal-multi-window-limits.svg`](mockups/modal-multi-window-limits.svg) | Modal rápido para ajuste pontual de cotas (5h / semana / mês). |

---

## 4. Diretrizes Técnicas de Implementação

### A. Validação de Cotas no Redis (Multi-Janela Atômica)
- O backend em Go verifica 4 chaves no Redis em tempo de execução:
  - `quota:tenant:<tid>:5h` e `quota:tenant:<tid>:week`
  - `quota:user:<uid>:5h` e `quota:user:<uid>:week`
- Se qualquer limite de 5h for estourado, o gateway responde com HTTP 429 contendo o campo `Retry-After: <segundos_restantes>` e mensagem amigável no terminal do OpenCode.

### B. Rotas no Control Plane (Go / PostgreSQL RLS)
- `GET /api/v1/collaborators`: Lista os colaboradores do tenant da sessão.
- `POST /api/v1/collaborators`: Cria colaborador com hash Argon2id e inicializa os limites.
- `PUT /api/v1/collaborators/:id`: Atualiza permissões de modelos e cotas temporais.
