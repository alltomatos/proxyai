# Guia de Especificação e Desenvolvimento: Gestão Multi-Empresa (Tenants)

> **Módulo:** `frontend/src/pages/tenants`  
> **Status:** Aprovado para Implementação  
> **Tema:** Clean Light & Colorful Enterprise  
> **Referência Visual:** `design-system/pages/tenants/mockups/`

---

## 1. Visão Geral da Tela
O módulo de Gestão de Empresas / Tenants permite ao administrador cadastrar clientes corporativos, definir orçamentos mensais, visualizar consumo em tempo real e restringir o acesso a combos ou modelos específicos:
- **Isolamento de Contas:** Cada tenant possui suas próprias chaves virtuais de API.
- **Teto de Gastos (Budget Cap):** Se o cliente atingir 100% da cota mensal, o gateway corta novas inferências com HTTP 429 (`Quota Exceeded`).
- **Lista Branca de Modelos (Allowed Models):** Empresas no plano básico não conseguem chamar modelos de alto custo, recebendo HTTP 403.

---

## 2. Componentes e Estrutura de Arquivos

```
src/pages/tenants/
├── index.tsx                         # Tabela de empresas clientes e resumo de cotas
├── components/
│   ├── TenantKpiGrid.tsx             # Totais de empresas ativas, faturamento e cotas
│   ├── TenantTable.tsx               # Tabela com progresso de cota mensal (% usada)
│   ├── TenantStatusBadge.tsx         # Badges: ATIVO, COTA ESGOTADA, SUSPENSO
│   └── ModelAccessTags.tsx           # Tags coloridas com os combos autorizados
└── modals/
    ├── CreateTenantModal.tsx         # Modal de cadastro de nova empresa cliente
    └── EditTenantPermissionsModal.tsx# Modal de ajuste de limite financeiro e modelos
```

---

## 3. Mockups SVG do Módulo

| Arquivo SVG | Descrição |
| :--- | :--- |
| [`mockups/page-layout.svg`](mockups/page-layout.svg) | Visão geral da tela de empresas e cotas ativas. |
| [`mockups/tenant-table-row.svg`](mockups/tenant-table-row.svg) | Especificação das linhas da tabela com progresso de gasto. |
| [`mockups/modal-create-tenant.svg`](mockups/modal-create-tenant.svg) | Modal para cadastrar nova empresa e definir cota em USD/BRL. |
