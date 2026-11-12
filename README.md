# Salgado Lucrativo — RendaPrática

Plataforma de receitas e gestão para pequenos negócios de **salgados** (coxinha, pastel, empada, esfiha, quibe, risole, folhado, pão de queijo e mais). HTML, CSS e JavaScript puros; dados no **IndexedDB** (ficam salvos ao fechar o navegador); gráficos com **Chart.js** (incluído na pasta, sem CDN). Funciona offline depois de carregado e não precisa de servidor nem de serviço pago.

## O que tem

| Página | Para quê |
|---|---|
| `index.html` | Início, atalhos e resumo do dia |
| `dashboard.html` | Painel: 9 indicadores, seletor de período e 4 gráficos (faturamento × despesas, mais vendidos, despesas por categoria, formas de pagamento), alertas de estoque baixo, validade e encomendas |
| `produtos.html` | 11 categorias, unidade de venda, preço, custo, estoque mínimo e foto |
| `producao.html` | Produção com custo de ingredientes, embalagens e outros; entra como pronto ou congelado, com validade opcional |
| `vendas.html` | Vendas concluídas e **encomendas pendentes** (só baixam estoque e entram no faturamento ao concluir); cliente opcional; 5 formas de pagamento |
| `estoque.html` | Saldos prontos × congelados, entradas, ajustes, conversão pronto ↔ congelado, lotes (FIFO) e histórico de movimentações |
| `despesas.html` | 14 categorias e observação |
| `calculadora.html` | Preço por ingrediente (converte g, kg, ml, litro, unidade, dúzia), margem × markup, salva custo e preço no produto |
| `relatorios.html` | Filtros por período, produto e categoria; mais vendidos e mais lucrativos; CSV de resumo, vendas, encomendas, produção, despesas e estoque |
| `receitas.html` | 51 receitas originais (dificuldade, custo estimado, rendimento, como congelar) + suas próprias receitas |
| `backup.html` | Backup/restauração JSON validados, ajustes, modo demonstração e zona de perigo |

## Regras que o sistema garante

- O estoque **nunca fica negativo**; vender acima do estoque é bloqueado e a operação inteira é desfeita se algo falhar (transações do IndexedDB).
- Todo movimento de estoque gera uma linha no histórico; o saldo de cada produto sempre bate com a soma do histórico (o backup é rejeitado se não bater).
- **Faturamento** = soma das vendas concluídas. **Lucro bruto** = faturamento − custo dos salgados vendidos (custo unitário gravado na venda). **Lucro estimado** = faturamento − despesas.
- Registros idênticos feitos em menos de 2 minutos pedem confirmação (proteção contra clique duplo); nomes de produto/receita são únicos.
- Exclusões pedem confirmação.

## Dados são locais

Tudo fica **apenas no navegador e no aparelho** de quem usa. Trocar de celular ou limpar os dados do navegador apaga os registros — use `Backup e ajustes` com frequência.

## Publicar no GitHub Pages

1. Crie um repositório e envie todo o conteúdo desta pasta (o arquivo `.nojekyll` já está incluso).
2. Em *Settings → Pages*, escolha a branch `main` e a pasta `/ (root)`.
3. A página inicial é `index.html`.

## Fotos

Não há imagens externas: o sistema usa **ilustrações originais em SVG**. Para usar fotos suas nas receitas, coloque em `img/receitas/<id>.jpg` e preencha `photo` em `js/recipes-data.js`; nos produtos e receitas próprias, o usuário envia a foto pelo próprio sistema.

## Hotmart

Ver `docs/HOTMART.md` (webhooks, Hotmart Club, login individual, liberação e bloqueio por reembolso). **Nenhum segredo vai no JavaScript do navegador**; a validação fica em um backend separado. O arquivo `js/auth.js` já tem o ponto de integração (desligado).

## Testes

```
npm i fake-indexeddb
node --test tests/core.test.js tests/recipes.test.js
```

`tests/e2e.playwright.js` percorre as telas no navegador (desktop e celular).
