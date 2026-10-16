# Guia de Especificação e Desenvolvimento: Faturamento & Ledger Atômico

> **Módulo:** `frontend/src/pages/billing`  
> **Status:** Aprovado para Implementação  
> **Tema:** Clean Light & Colorful Enterprise  
> **Referência Visual:** `design-system/pages/billing/mockups/`

---

## 1. Visão Geral da Tela
O módulo de Faturamento gerencia o modelo comercial híbrido da plataforma:
- **Carteira Pré-Paga:** Saldo disponível, holds ativos no Redis e recargas instantâneas via PIX / Cartão de Crédito.
- **Planos Mensais Recorrentes:** Acompanhamento percentual do consumo de cotas de tokens.
- **Credit Ledger Imutável:** Extrato transacional linha a linha de cada inferência completada (tokens de entrada + saída $\times$ multiplicador de margem de revenda).

---

## 2. Componentes e Estrutura de Arquivos

```
src/pages/billing/
├── index.tsx                         # Página principal de faturamento
├── components/
│   ├── BillingOverviewCards.tsx      # Cards de Saldo, Plano e Lucro Bruto
│   ├── BalanceProgressBar.tsx        # Barra de consumo da cota mensal
│   ├── CreditLedgerTable.tsx         # Tabela imutável de transações (audit log)
│   ├── LedgerStatusBadge.tsx         # Badges: SETTLED (débito), CREDIT (recarga)
│   └── AutoRechargeSettings.tsx      # Configuração de recarga automática
└── modals/
    ├── BuyCreditsModal.tsx           # Modal de compra de créditos (PIX / Stripe / Mercado Pago)
    └── UpgradePlanModal.tsx          # Modal de seleção de planos (Starter, Pro, Enterprise)
```

---

## 3. Mockups SVG do Módulo

| Arquivo SVG | Descrição |
| :--- | :--- |
| [`mockups/page-layout.svg`](mockups/page-layout.svg) | Visão geral da tela de faturamento e ledger. |
| [`mockups/billing-cards.svg`](mockups/billing-cards.svg) | Cards de Saldo Pré-Pago, Cota do Plano e Margem de Lucro. |
| [`mockups/ledger-table-row.svg`](mockups/ledger-table-row.svg) | Linhas da tabela de débitos e créditos de recarga. |
| [`mockups/modal-buy-credits.svg`](mockups/modal-buy-credits.svg) | Modal para compra de créditos com chave PIX e QR Code. |

---

## 4. Diretrizes Técnicas de Implementação

- Todas as chamadas de débito consultam o PostgreSQL através de transações isoladas (`SELECT ... FOR UPDATE` ou eventos de ledger imutáveis via append-only).
- O modal de compra de créditos via PIX deve conectar no endpoint `/api/v1/billing/pix/create` e escutar webhooks do Mercado Pago para confirmação instantânea na tela.
