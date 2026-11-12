/* recipes-data.js — biblioteca inicial de receitas (somente leitura no app).

   COMO ADICIONAR MAIS RECEITAS:
   • Opção 1 (sem mexer em código): na página Receitas, clique em "Nova receita". Elas ficam salvas no
     navegador de quem cadastrou (entram no backup).
   • Opção 2 (para vender no produto): copie um bloco abaixo, mude os textos e cole no fim da lista.
     Todos os compradores passam a ver a receita. Mantenha `id` único (letras minúsculas e hífens).

   FOTOS: coloque a foto em img/receitas/<id>.jpg (use fotos suas ou com licença de uso) e escreva
   photo: 'img/receitas/<id>.jpg'. Enquanto photo for null, o app mostra uma ilustração original.

   Os rendimentos, tempos, preços e prazos são orientações iniciais. Teste cada receita na sua cozinha,
   confira o custo na Calculadora e ajuste os prazos de validade às normas sanitárias da sua região. */
(function (global) {
  'use strict';
  const SL = (global.SL = global.SL || {});
  SL.RECIPE_SLOTS = 50;
  SL.RECIPES = [
 {
  "name": "Coxinha de frango tradicional",
  "category": "Coxinhas",
  "time": "1 h 40 min",
  "difficulty": "Médio",
  "estimatedCost": 38,
  "suggestedPrice": 5.5,
  "ingredients": [
   "Recheio:",
   "600 g de peito de frango",
   "1 cebola pequena picada",
   "2 dentes de alho amassados",
   "2 colheres (sopa) de óleo",
   "1 tomate sem sementes picado",
   "Sal, pimenta-do-reino e cheiro-verde a gosto",
   "Massa:",
   "1 litro de caldo do cozimento do frango (ou caldo de legumes)",
   "2 colheres (sopa) de margarina ou manteiga",
   "1 colher (chá) de sal",
   "400 g de farinha de trigo (cerca de 2 3/4 xícaras)",
   "Para empanar:",
   "2 ovos batidos com uma pitada de sal",
   "Farinha de rosca para empanar",
   "Óleo para fritar"
  ],
  "steps": [
   "Cozinhe o frango com sal, cebola e louro em água suficiente para cobrir. Reserve 1 litro do caldo, desfie o frango e deixe esfriar.",
   "Refogue a cebola e o alho no óleo, junte o tomate e o frango desfiado, tempere e cozinhe 5 minutos. Finalize com cheiro-verde e deixe esfriar completamente.",
   "Leve o caldo, a margarina e o sal ao fogo até ferver.",
   "Junte a farinha de uma vez e mexa vigorosamente até a massa soltar do fundo da panela.",
   "Passe para uma superfície untada e sove ainda morna até ficar lisa e macia. Deixe amornar coberta com pano úmido.",
   "Pegue uma porção de massa, abra na palma da mão, coloque o recheio e feche em formato de gota, cuidando para não deixar furos.",
   "Modele as coxinhas, passe no ovo e na farinha de rosca (se quiser mais crocante, repita), e frite em óleo médio (170 °C) até dourar por igual.",
   "Escorra em papel-toalha antes de servir."
  ],
  "freezing": "Congele cru e já empanado, em bandeja forrada e sem encostar um no outro, por 2 horas; depois passe para saco próprio com a data. Dura até 90 dias. Frite ainda congelado em óleo médio (170 °C) por 8 a 10 minutos, sem descongelar.",
  "storage": "Fritos: melhor no mesmo dia, em recipiente aberto. Sobras: geladeira por até 2 dias e reaqueça no forno ou air fryer para recuperar a crocância.",
  "id": "coxinha-de-frango-tradicional",
  "yield": "30 unidades médias"
 },
 {
  "name": "Coxinha de frango com catupiry",
  "category": "Coxinhas",
  "time": "1 h 40 min",
  "difficulty": "Médio",
  "estimatedCost": 46,
  "suggestedPrice": 6.5,
  "ingredients": [
   "Recheio:",
   "600 g de peito de frango cozido e desfiado",
   "1 cebola pequena",
   "2 dentes de alho",
   "2 colheres (sopa) de óleo",
   "200 g de requeijão cremoso firme (tipo catupiry)",
   "Sal, pimenta e cheiro-verde",
   "Massa:",
   "1 litro de caldo do cozimento do frango (ou caldo de legumes)",
   "2 colheres (sopa) de margarina ou manteiga",
   "1 colher (chá) de sal",
   "400 g de farinha de trigo (cerca de 2 3/4 xícaras)",
   "Para empanar:",
   "2 ovos batidos com uma pitada de sal",
   "Farinha de rosca para empanar",
   "Óleo para fritar"
  ],
  "steps": [
   "Cozinhe o frango, reserve 1 litro do caldo e desfie.",
   "Refogue cebola e alho, junte o frango, tempere e deixe esfriar.",
   "Na hora de rechear, coloque uma colher de frango e uma colher pequena de requeijão em cada coxinha.",
   "Leve o caldo, a margarina e o sal ao fogo até ferver.",
   "Junte a farinha de uma vez e mexa vigorosamente até a massa soltar do fundo da panela.",
   "Passe para uma superfície untada e sove ainda morna até ficar lisa e macia. Deixe amornar coberta com pano úmido.",
   "Pegue uma porção de massa, abra na palma da mão, coloque o recheio e feche em formato de gota, cuidando para não deixar furos.",
   "Modele as coxinhas, passe no ovo e na farinha de rosca (se quiser mais crocante, repita), e frite em óleo médio (170 °C) até dourar por igual.",
   "Escorra em papel-toalha antes de servir."
  ],
  "freezing": "Congele cru e já empanado, em bandeja forrada e sem encostar um no outro, por 2 horas; depois passe para saco próprio com a data. Dura até 90 dias. Frite ainda congelado em óleo médio (170 °C) por 8 a 10 minutos, sem descongelar.",
  "storage": "Fritos: melhor no mesmo dia, em recipiente aberto. Sobras: geladeira por até 2 dias e reaqueça no forno ou air fryer para recuperar a crocância.",
  "id": "coxinha-de-frango-com-catupiry",
  "yield": "30 unidades médias"
 },
 {
  "name": "Coxinha de carne seca com requeijão",
  "category": "Coxinhas",
  "time": "1 h 40 min",
  "difficulty": "Médio",
  "estimatedCost": 64,
  "suggestedPrice": 7.5,
  "ingredients": [
   "Recheio:",
   "500 g de carne seca dessalgada e desfiada",
   "1 cebola picada",
   "2 dentes de alho",
   "2 colheres (sopa) de óleo",
   "1 colher (sopa) de extrato de tomate",
   "200 g de requeijão cremoso firme",
   "Cheiro-verde a gosto",
   "Massa:",
   "1 litro de caldo do cozimento do frango (ou caldo de legumes)",
   "2 colheres (sopa) de margarina ou manteiga",
   "1 colher (chá) de sal",
   "400 g de farinha de trigo (cerca de 2 3/4 xícaras)",
   "Para empanar:",
   "2 ovos batidos com uma pitada de sal",
   "Farinha de rosca para empanar",
   "Óleo para fritar"
  ],
  "steps": [
   "Dessalgue a carne seca na água por 12 h (trocando a água) e cozinhe na pressão por 30 minutos. Desfie e reserve 1 litro de caldo diluído (se estiver muito salgado, use metade água).",
   "Refogue cebola, alho e extrato, junte a carne e cozinhe até secar. Esfrie.",
   "Leve o caldo, a margarina e o sal ao fogo até ferver.",
   "Junte a farinha de uma vez e mexa vigorosamente até a massa soltar do fundo da panela.",
   "Passe para uma superfície untada e sove ainda morna até ficar lisa e macia. Deixe amornar coberta com pano úmido.",
   "Pegue uma porção de massa, abra na palma da mão, coloque o recheio e feche em formato de gota, cuidando para não deixar furos.",
   "Modele as coxinhas, passe no ovo e na farinha de rosca (se quiser mais crocante, repita), e frite em óleo médio (170 °C) até dourar por igual.",
   "Escorra em papel-toalha antes de servir."
  ],
  "freezing": "Congele cru e já empanado, em bandeja forrada e sem encostar um no outro, por 2 horas; depois passe para saco próprio com a data. Dura até 90 dias. Frite ainda congelado em óleo médio (170 °C) por 8 a 10 minutos, sem descongelar.",
  "storage": "Fritos: melhor no mesmo dia, em recipiente aberto. Sobras: geladeira por até 2 dias e reaqueça no forno ou air fryer para recuperar a crocância.",
  "id": "coxinha-de-carne-seca-com-requeijao",
  "yield": "30 unidades médias"
 },
 {
  "name": "Coxinha de calabresa com queijo",
  "category": "Coxinhas",
  "time": "1 h 40 min",
  "difficulty": "Médio",
  "estimatedCost": 40,
  "suggestedPrice": 5.5,
  "ingredients": [
   "Recheio:",
   "400 g de linguiça calabresa em cubinhos pequenos",
   "200 g de muçarela em cubos",
   "1 cebola pequena picada",
   "1 colher (sopa) de óleo",
   "1 litro de caldo de legumes",
   "Orégano a gosto",
   "Massa:",
   "1 litro de caldo do cozimento do frango (ou caldo de legumes)",
   "2 colheres (sopa) de margarina ou manteiga",
   "1 colher (chá) de sal",
   "400 g de farinha de trigo (cerca de 2 3/4 xícaras)",
   "Para empanar:",
   "2 ovos batidos com uma pitada de sal",
   "Farinha de rosca para empanar",
   "Óleo para fritar"
  ],
  "steps": [
   "Refogue a cebola e a calabresa no óleo até dourar. Tempere com orégano e deixe esfriar.",
   "Prepare o caldo de legumes (cozinhando cenoura, cebola e salsão em 1,2 litro de água por 20 minutos).",
   "Leve o caldo, a margarina e o sal ao fogo até ferver.",
   "Junte a farinha de uma vez e mexa vigorosamente até a massa soltar do fundo da panela.",
   "Passe para uma superfície untada e sove ainda morna até ficar lisa e macia. Deixe amornar coberta com pano úmido.",
   "Pegue uma porção de massa, abra na palma da mão, coloque o recheio e feche em formato de gota, cuidando para não deixar furos.",
   "Modele as coxinhas, passe no ovo e na farinha de rosca (se quiser mais crocante, repita), e frite em óleo médio (170 °C) até dourar por igual.",
   "Escorra em papel-toalha antes de servir."
  ],
  "freezing": "Congele cru e já empanado, em bandeja forrada e sem encostar um no outro, por 2 horas; depois passe para saco próprio com a data. Dura até 90 dias. Frite ainda congelado em óleo médio (170 °C) por 8 a 10 minutos, sem descongelar.",
  "storage": "Fritos: melhor no mesmo dia, em recipiente aberto. Sobras: geladeira por até 2 dias e reaqueça no forno ou air fryer para recuperar a crocância.",
  "id": "coxinha-de-calabresa-com-queijo",
  "yield": "30 unidades médias"
 },
 {
  "name": "Coxinha assada de batata-doce com frango",
  "category": "Coxinhas",
  "time": "1 h 15 min",
  "difficulty": "Fácil",
  "estimatedCost": 32,
  "suggestedPrice": 5.5,
  "ingredients": [
   "Recheio:",
   "300 g de peito de frango cozido e desfiado",
   "600 g de batata-doce cozida e amassada",
   "1 cebola pequena",
   "2 dentes de alho",
   "2 colheres (sopa) de azeite",
   "4 colheres (sopa) de farinha de aveia ou de trigo",
   "Sal e cheiro-verde",
   "Massa:",
   "1 litro de caldo do cozimento do frango (ou caldo de legumes)",
   "2 colheres (sopa) de margarina ou manteiga",
   "1 colher (chá) de sal",
   "400 g de farinha de trigo (cerca de 2 3/4 xícaras)",
   "Para empanar:",
   "2 ovos batidos com uma pitada de sal",
   "Farinha de rosca para empanar",
   "Óleo para fritar"
  ],
  "steps": [
   "Refogue cebola e alho no azeite, junte o frango, tempere e esfrie.",
   "Misture a batata-doce amassada com a farinha e o sal até dar ponto de modelar.",
   "Modele as coxinhas com o recheio, pincele com um pouco de azeite e leve ao forno a 200 °C por 25 a 30 minutos, virando na metade.",
   "Leve o caldo, a margarina e o sal ao fogo até ferver.",
   "Junte a farinha de uma vez e mexa vigorosamente até a massa soltar do fundo da panela.",
   "Passe para uma superfície untada e sove ainda morna até ficar lisa e macia. Deixe amornar coberta com pano úmido.",
   "Pegue uma porção de massa, abra na palma da mão, coloque o recheio e feche em formato de gota, cuidando para não deixar furos.",
   "Modele as coxinhas, passe no ovo e na farinha de rosca (se quiser mais crocante, repita), e frite em óleo médio (170 °C) até dourar por igual.",
   "Escorra em papel-toalha antes de servir."
  ],
  "freezing": "Congele cru, em bandeja, até endurecer (2 horas), e depois guarde em saco próprio por até 90 dias. Leve ainda congelado ao forno pré-aquecido a 200 °C e asse por 30 a 40 minutos, até dourar.",
  "storage": "Em recipiente fechado, na geladeira, por até 3 dias. Reaqueça no forno antes de servir. Recheios com carne, frango ou queijo não devem ficar fora da geladeira por mais de 2 horas.",
  "id": "coxinha-assada-de-batata-doce-com-frango",
  "yield": "30 unidades médias"
 },
 {
  "name": "Coxinha de camarão",
  "category": "Coxinhas",
  "time": "1 h 40 min",
  "difficulty": "Difícil",
  "estimatedCost": 85,
  "suggestedPrice": 9.0,
  "ingredients": [
   "Recheio:",
   "400 g de camarão limpo",
   "1 cebola pequena picada",
   "2 dentes de alho",
   "2 colheres (sopa) de azeite",
   "200 g de requeijão cremoso firme",
   "Suco de 1/2 limão",
   "Cheiro-verde",
   "Massa:",
   "1 litro de caldo do cozimento do frango (ou caldo de legumes)",
   "2 colheres (sopa) de margarina ou manteiga",
   "1 colher (chá) de sal",
   "400 g de farinha de trigo (cerca de 2 3/4 xícaras)",
   "Para empanar:",
   "2 ovos batidos com uma pitada de sal",
   "Farinha de rosca para empanar",
   "Óleo para fritar"
  ],
  "steps": [
   "Tempere o camarão com limão, sal e alho. Refogue no azeite por 3 minutos com a cebola, pique em pedaços pequenos e esfrie.",
   "Misture o camarão com o requeijão e o cheiro-verde. Para a massa, use 1 litro de caldo feito com as cascas do camarão fervidas por 15 minutos e coadas.",
   "Leve o caldo, a margarina e o sal ao fogo até ferver.",
   "Junte a farinha de uma vez e mexa vigorosamente até a massa soltar do fundo da panela.",
   "Passe para uma superfície untada e sove ainda morna até ficar lisa e macia. Deixe amornar coberta com pano úmido.",
   "Pegue uma porção de massa, abra na palma da mão, coloque o recheio e feche em formato de gota, cuidando para não deixar furos.",
   "Modele as coxinhas, passe no ovo e na farinha de rosca (se quiser mais crocante, repita), e frite em óleo médio (170 °C) até dourar por igual.",
   "Escorra em papel-toalha antes de servir."
  ],
  "freezing": "Congele cru e já empanado, em bandeja forrada e sem encostar um no outro, por 2 horas; depois passe para saco próprio com a data. Dura até 90 dias. Frite ainda congelado em óleo médio (170 °C) por 8 a 10 minutos, sem descongelar.",
  "storage": "Fritos: melhor no mesmo dia, em recipiente aberto. Sobras: geladeira por até 2 dias e reaqueça no forno ou air fryer para recuperar a crocância.",
  "id": "coxinha-de-camarao",
  "yield": "30 unidades médias"
 },
 {
  "name": "Pastel de carne",
  "category": "Pastéis",
  "time": "1 h 10 min",
  "difficulty": "Fácil",
  "estimatedCost": 30,
  "suggestedPrice": 6.0,
  "ingredients": [
   "Recheio:",
   "400 g de carne moída",
   "1 cebola picada",
   "2 dentes de alho",
   "1 tomate picado",
   "Azeitonas picadas (opcional)",
   "Sal, pimenta e cheiro-verde",
   "Massa:",
   "500 g de farinha de trigo",
   "1 colher (chá) de sal",
   "2 colheres (sopa) de óleo",
   "1 colher (sopa) de cachaça ou vinagre branco",
   "1 ovo",
   "Cerca de 200 ml de água morna",
   "Óleo para fritar"
  ],
  "steps": [
   "Refogue a cebola e o alho, junte a carne e cozinhe até secar. Acrescente o tomate, tempere e finalize com cheiro-verde. Deixe esfriar.",
   "Misture a farinha e o sal, faça um buraco no meio e junte o óleo, o ovo, a cachaça e a água aos poucos.",
   "Sove por 10 minutos até a massa ficar lisa e elástica. Descanse 30 minutos coberta.",
   "Abra bem fina (1 a 2 mm), corte círculos ou retângulos, recheie, feche pressionando as bordas com garfo e frite em óleo bem quente (180 °C) até dourar e fazer bolhas."
  ],
  "freezing": "Congele cru e já fechado, em bandeja forrada com papel manteiga e separados, por 2 horas; depois passe para saco próprio com a data. Dura até 90 dias. Frite ainda congelado em óleo médio (170 °C) por 5 a 7 minutos, sem descongelar.",
  "storage": "Em recipiente fechado, na geladeira, por até 3 dias. Reaqueça no forno antes de servir. Recheios com carne, frango ou queijo não devem ficar fora da geladeira por mais de 2 horas.",
  "id": "pastel-de-carne",
  "yield": "20 pastéis"
 },
 {
  "name": "Pastel de queijo",
  "category": "Pastéis",
  "time": "1 h 10 min",
  "difficulty": "Fácil",
  "estimatedCost": 34,
  "suggestedPrice": 5.5,
  "ingredients": [
   "Recheio:",
   "400 g de muçarela fatiada ou em cubos",
   "Orégano a gosto",
   "Massa:",
   "500 g de farinha de trigo",
   "1 colher (chá) de sal",
   "2 colheres (sopa) de óleo",
   "1 colher (sopa) de cachaça ou vinagre branco",
   "1 ovo",
   "Cerca de 200 ml de água morna",
   "Óleo para fritar"
  ],
  "steps": [
   "Corte o queijo em tiras finas para facilitar o fechamento.",
   "Misture a farinha e o sal, faça um buraco no meio e junte o óleo, o ovo, a cachaça e a água aos poucos.",
   "Sove por 10 minutos até a massa ficar lisa e elástica. Descanse 30 minutos coberta.",
   "Abra bem fina (1 a 2 mm), corte círculos ou retângulos, recheie, feche pressionando as bordas com garfo e frite em óleo bem quente (180 °C) até dourar e fazer bolhas."
  ],
  "freezing": "Congele cru e já fechado, em bandeja forrada com papel manteiga e separados, por 2 horas; depois passe para saco próprio com a data. Dura até 90 dias. Frite ainda congelado em óleo médio (170 °C) por 5 a 7 minutos, sem descongelar.",
  "storage": "Em recipiente fechado, na geladeira, por até 3 dias. Reaqueça no forno antes de servir. Recheios com carne, frango ou queijo não devem ficar fora da geladeira por mais de 2 horas.",
  "id": "pastel-de-queijo",
  "yield": "20 pastéis"
 },
 {
  "name": "Pastel de frango com catupiry",
  "category": "Pastéis",
  "time": "1 h 10 min",
  "difficulty": "Fácil",
  "estimatedCost": 36,
  "suggestedPrice": 6.5,
  "ingredients": [
   "Recheio:",
   "400 g de frango cozido e desfiado",
   "1 cebola pequena",
   "1 dente de alho",
   "200 g de requeijão cremoso firme",
   "Sal e cheiro-verde",
   "Massa:",
   "500 g de farinha de trigo",
   "1 colher (chá) de sal",
   "2 colheres (sopa) de óleo",
   "1 colher (sopa) de cachaça ou vinagre branco",
   "1 ovo",
   "Cerca de 200 ml de água morna",
   "Óleo para fritar"
  ],
  "steps": [
   "Refogue cebola e alho, junte o frango, tempere e esfrie. Misture com o requeijão.",
   "Misture a farinha e o sal, faça um buraco no meio e junte o óleo, o ovo, a cachaça e a água aos poucos.",
   "Sove por 10 minutos até a massa ficar lisa e elástica. Descanse 30 minutos coberta.",
   "Abra bem fina (1 a 2 mm), corte círculos ou retângulos, recheie, feche pressionando as bordas com garfo e frite em óleo bem quente (180 °C) até dourar e fazer bolhas."
  ],
  "freezing": "Congele cru e já fechado, em bandeja forrada com papel manteiga e separados, por 2 horas; depois passe para saco próprio com a data. Dura até 90 dias. Frite ainda congelado em óleo médio (170 °C) por 5 a 7 minutos, sem descongelar.",
  "storage": "Em recipiente fechado, na geladeira, por até 3 dias. Reaqueça no forno antes de servir. Recheios com carne, frango ou queijo não devem ficar fora da geladeira por mais de 2 horas.",
  "id": "pastel-de-frango-com-catupiry",
  "yield": "20 pastéis"
 },
 {
  "name": "Pastel de pizza",
  "category": "Pastéis",
  "time": "1 h 10 min",
  "difficulty": "Fácil",
  "estimatedCost": 35,
  "suggestedPrice": 6.0,
  "ingredients": [
   "Recheio:",
   "250 g de muçarela",
   "150 g de presunto fatiado",
   "2 tomates sem sementes em cubos",
   "Orégano",
   "Massa:",
   "500 g de farinha de trigo",
   "1 colher (chá) de sal",
   "2 colheres (sopa) de óleo",
   "1 colher (sopa) de cachaça ou vinagre branco",
   "1 ovo",
   "Cerca de 200 ml de água morna",
   "Óleo para fritar"
  ],
  "steps": [
   "Misture queijo, presunto e tomate com orégano; mantenha refrigerado até a hora de rechear.",
   "Misture a farinha e o sal, faça um buraco no meio e junte o óleo, o ovo, a cachaça e a água aos poucos.",
   "Sove por 10 minutos até a massa ficar lisa e elástica. Descanse 30 minutos coberta.",
   "Abra bem fina (1 a 2 mm), corte círculos ou retângulos, recheie, feche pressionando as bordas com garfo e frite em óleo bem quente (180 °C) até dourar e fazer bolhas."
  ],
  "freezing": "Congele cru e já fechado, em bandeja forrada com papel manteiga e separados, por 2 horas; depois passe para saco próprio com a data. Dura até 90 dias. Frite ainda congelado em óleo médio (170 °C) por 5 a 7 minutos, sem descongelar.",
  "storage": "Em recipiente fechado, na geladeira, por até 3 dias. Reaqueça no forno antes de servir. Recheios com carne, frango ou queijo não devem ficar fora da geladeira por mais de 2 horas.",
  "id": "pastel-de-pizza",
  "yield": "20 pastéis"
 },
 {
  "name": "Pastel de palmito",
  "category": "Pastéis",
  "time": "1 h 10 min",
  "difficulty": "Fácil",
  "estimatedCost": 38,
  "suggestedPrice": 6.0,
  "ingredients": [
   "Recheio:",
   "1 vidro (300 g) de palmito picado",
   "1 cebola pequena",
   "1 colher (sopa) de azeite",
   "150 g de requeijão cremoso firme",
   "Sal e salsinha",
   "Massa:",
   "500 g de farinha de trigo",
   "1 colher (chá) de sal",
   "2 colheres (sopa) de óleo",
   "1 colher (sopa) de cachaça ou vinagre branco",
   "1 ovo",
   "Cerca de 200 ml de água morna",
   "Óleo para fritar"
  ],
  "steps": [
   "Refogue a cebola no azeite, junte o palmito escorrido, tempere e acrescente o requeijão fora do fogo.",
   "Misture a farinha e o sal, faça um buraco no meio e junte o óleo, o ovo, a cachaça e a água aos poucos.",
   "Sove por 10 minutos até a massa ficar lisa e elástica. Descanse 30 minutos coberta.",
   "Abra bem fina (1 a 2 mm), corte círculos ou retângulos, recheie, feche pressionando as bordas com garfo e frite em óleo bem quente (180 °C) até dourar e fazer bolhas."
  ],
  "freezing": "Congele cru e já fechado, em bandeja forrada com papel manteiga e separados, por 2 horas; depois passe para saco próprio com a data. Dura até 90 dias. Frite ainda congelado em óleo médio (170 °C) por 5 a 7 minutos, sem descongelar.",
  "storage": "Em recipiente fechado, na geladeira, por até 3 dias. Reaqueça no forno antes de servir. Recheios com carne, frango ou queijo não devem ficar fora da geladeira por mais de 2 horas.",
  "id": "pastel-de-palmito",
  "yield": "20 pastéis"
 },
 {
  "name": "Pastel de carne seca com abóbora",
  "category": "Pastéis",
  "time": "1 h 10 min",
  "difficulty": "Médio",
  "estimatedCost": 46,
  "suggestedPrice": 7.5,
  "ingredients": [
   "Recheio:",
   "300 g de carne seca dessalgada e desfiada",
   "300 g de abóbora cabotiá cozida e amassada",
   "1 cebola",
   "1 dente de alho",
   "1 colher (sopa) de azeite",
   "Massa:",
   "500 g de farinha de trigo",
   "1 colher (chá) de sal",
   "2 colheres (sopa) de óleo",
   "1 colher (sopa) de cachaça ou vinagre branco",
   "1 ovo",
   "Cerca de 200 ml de água morna",
   "Óleo para fritar"
  ],
  "steps": [
   "Refogue cebola e alho, junte a carne e depois a abóbora amassada. Cozinhe até formar um creme firme e esfrie.",
   "Misture a farinha e o sal, faça um buraco no meio e junte o óleo, o ovo, a cachaça e a água aos poucos.",
   "Sove por 10 minutos até a massa ficar lisa e elástica. Descanse 30 minutos coberta.",
   "Abra bem fina (1 a 2 mm), corte círculos ou retângulos, recheie, feche pressionando as bordas com garfo e frite em óleo bem quente (180 °C) até dourar e fazer bolhas."
  ],
  "freezing": "Congele cru e já fechado, em bandeja forrada com papel manteiga e separados, por 2 horas; depois passe para saco próprio com a data. Dura até 90 dias. Frite ainda congelado em óleo médio (170 °C) por 5 a 7 minutos, sem descongelar.",
  "storage": "Em recipiente fechado, na geladeira, por até 3 dias. Reaqueça no forno antes de servir. Recheios com carne, frango ou queijo não devem ficar fora da geladeira por mais de 2 horas.",
  "id": "pastel-de-carne-seca-com-abobora",
  "yield": "20 pastéis"
 },
 {
  "name": "Empada de frango",
  "category": "Empadas",
  "time": "1 h 20 min",
  "difficulty": "Médio",
  "estimatedCost": 34,
  "suggestedPrice": 5.5,
  "ingredients": [
   "Recheio:",
   "400 g de peito de frango cozido e desfiado",
   "1 cebola",
   "1 tomate sem sementes",
   "1 colher (sopa) de farinha de trigo",
   "200 ml de caldo do cozimento",
   "Sal, azeitonas e cheiro-verde",
   "Massa:",
   "300 g de farinha de trigo",
   "150 g de manteiga gelada em cubos",
   "1 ovo",
   "1 gema para pincelar",
   "1 colher (chá) de sal",
   "2 colheres (sopa) de água gelada"
  ],
  "steps": [
   "Refogue a cebola, junte o tomate e o frango. Dissolva a farinha no caldo, despeje e cozinhe até engrossar. Esfrie bem.",
   "Misture a farinha, o sal e a manteiga com as pontas dos dedos até formar uma farofa.",
   "Junte o ovo e a água e una sem sovar. Envolva em filme e leve à geladeira por 30 minutos.",
   "Forre as forminhas com 2/3 da massa, recheie, cubra com o restante, pincele a gema e asse a 200 °C por 25 a 30 minutos até dourar."
  ],
  "freezing": "Congele já recheadas e cruas por até 60 dias. Asse sem descongelar, a 200 °C, por 35 a 40 minutos. Também podem ser congeladas depois de assadas e reaquecidas a 180 °C por 10 minutos.",
  "storage": "Em recipiente fechado, na geladeira, por até 3 dias. Reaqueça no forno antes de servir. Recheios com carne, frango ou queijo não devem ficar fora da geladeira por mais de 2 horas.",
  "id": "empada-de-frango",
  "yield": "18 empadinhas"
 },
 {
  "name": "Empada de palmito",
  "category": "Empadas",
  "time": "1 h 20 min",
  "difficulty": "Médio",
  "estimatedCost": 36,
  "suggestedPrice": 5.5,
  "ingredients": [
   "Recheio:",
   "1 vidro (300 g) de palmito picado",
   "1 cebola",
   "1 colher (sopa) de farinha de trigo",
   "200 ml de leite",
   "1 colher (sopa) de manteiga",
   "Sal e salsinha",
   "Massa:",
   "300 g de farinha de trigo",
   "150 g de manteiga gelada em cubos",
   "1 ovo",
   "1 gema para pincelar",
   "1 colher (chá) de sal",
   "2 colheres (sopa) de água gelada"
  ],
  "steps": [
   "Refogue a cebola na manteiga, junte o palmito, a farinha e o leite e mexa até virar um creme grosso. Esfrie.",
   "Misture a farinha, o sal e a manteiga com as pontas dos dedos até formar uma farofa.",
   "Junte o ovo e a água e una sem sovar. Envolva em filme e leve à geladeira por 30 minutos.",
   "Forre as forminhas com 2/3 da massa, recheie, cubra com o restante, pincele a gema e asse a 200 °C por 25 a 30 minutos até dourar."
  ],
  "freezing": "Congele já recheadas e cruas por até 60 dias. Asse sem descongelar, a 200 °C, por 35 a 40 minutos. Também podem ser congeladas depois de assadas e reaquecidas a 180 °C por 10 minutos.",
  "storage": "Em recipiente fechado, na geladeira, por até 3 dias. Reaqueça no forno antes de servir. Recheios com carne, frango ou queijo não devem ficar fora da geladeira por mais de 2 horas.",
  "id": "empada-de-palmito",
  "yield": "18 empadinhas"
 },
 {
  "name": "Empada de queijo com tomate seco",
  "category": "Empadas",
  "time": "1 h 20 min",
  "difficulty": "Fácil",
  "estimatedCost": 33,
  "suggestedPrice": 5.5,
  "ingredients": [
   "Recheio:",
   "200 g de muçarela ralada",
   "100 g de ricota amassada",
   "50 g de tomate seco picado",
   "1 colher (sopa) de azeite",
   "Orégano",
   "Massa:",
   "300 g de farinha de trigo",
   "150 g de manteiga gelada em cubos",
   "1 ovo",
   "1 gema para pincelar",
   "1 colher (chá) de sal",
   "2 colheres (sopa) de água gelada"
  ],
  "steps": [
   "Misture o queijo, a ricota, o tomate seco e o azeite. Não precisa cozinhar o recheio.",
   "Misture a farinha, o sal e a manteiga com as pontas dos dedos até formar uma farofa.",
   "Junte o ovo e a água e una sem sovar. Envolva em filme e leve à geladeira por 30 minutos.",
   "Forre as forminhas com 2/3 da massa, recheie, cubra com o restante, pincele a gema e asse a 200 °C por 25 a 30 minutos até dourar."
  ],
  "freezing": "Congele já recheadas e cruas por até 60 dias. Asse sem descongelar, a 200 °C, por 35 a 40 minutos. Também podem ser congeladas depois de assadas e reaquecidas a 180 °C por 10 minutos.",
  "storage": "Em recipiente fechado, na geladeira, por até 3 dias. Reaqueça no forno antes de servir. Recheios com carne, frango ou queijo não devem ficar fora da geladeira por mais de 2 horas.",
  "id": "empada-de-queijo-com-tomate-seco",
  "yield": "18 empadinhas"
 },
 {
  "name": "Empada de carne seca com requeijão",
  "category": "Empadas",
  "time": "1 h 20 min",
  "difficulty": "Médio",
  "estimatedCost": 52,
  "suggestedPrice": 7.0,
  "ingredients": [
   "Recheio:",
   "300 g de carne seca dessalgada e desfiada",
   "1 cebola",
   "1 dente de alho",
   "150 g de requeijão cremoso firme",
   "Massa:",
   "300 g de farinha de trigo",
   "150 g de manteiga gelada em cubos",
   "1 ovo",
   "1 gema para pincelar",
   "1 colher (chá) de sal",
   "2 colheres (sopa) de água gelada"
  ],
  "steps": [
   "Refogue cebola e alho, junte a carne desfiada e cozinhe até secar. Esfrie e misture ao requeijão.",
   "Misture a farinha, o sal e a manteiga com as pontas dos dedos até formar uma farofa.",
   "Junte o ovo e a água e una sem sovar. Envolva em filme e leve à geladeira por 30 minutos.",
   "Forre as forminhas com 2/3 da massa, recheie, cubra com o restante, pincele a gema e asse a 200 °C por 25 a 30 minutos até dourar."
  ],
  "freezing": "Congele já recheadas e cruas por até 60 dias. Asse sem descongelar, a 200 °C, por 35 a 40 minutos. Também podem ser congeladas depois de assadas e reaquecidas a 180 °C por 10 minutos.",
  "storage": "Em recipiente fechado, na geladeira, por até 3 dias. Reaqueça no forno antes de servir. Recheios com carne, frango ou queijo não devem ficar fora da geladeira por mais de 2 horas.",
  "id": "empada-de-carne-seca-com-requeijao",
  "yield": "18 empadinhas"
 },
 {
  "name": "Empada de camarão",
  "category": "Empadas",
  "time": "1 h 20 min",
  "difficulty": "Difícil",
  "estimatedCost": 72,
  "suggestedPrice": 9.0,
  "ingredients": [
   "Recheio:",
   "400 g de camarão limpo",
   "1 cebola",
   "1 colher (sopa) de farinha de trigo",
   "200 ml de leite",
   "1 colher (sopa) de manteiga",
   "Cheiro-verde e limão",
   "Massa:",
   "300 g de farinha de trigo",
   "150 g de manteiga gelada em cubos",
   "1 ovo",
   "1 gema para pincelar",
   "1 colher (chá) de sal",
   "2 colheres (sopa) de água gelada"
  ],
  "steps": [
   "Refogue a cebola na manteiga, junte o camarão picado por 3 minutos, adicione a farinha e o leite e cozinhe até engrossar. Esfrie.",
   "Misture a farinha, o sal e a manteiga com as pontas dos dedos até formar uma farofa.",
   "Junte o ovo e a água e una sem sovar. Envolva em filme e leve à geladeira por 30 minutos.",
   "Forre as forminhas com 2/3 da massa, recheie, cubra com o restante, pincele a gema e asse a 200 °C por 25 a 30 minutos até dourar."
  ],
  "freezing": "Congele já recheadas e cruas por até 60 dias. Asse sem descongelar, a 200 °C, por 35 a 40 minutos. Também podem ser congeladas depois de assadas e reaquecidas a 180 °C por 10 minutos.",
  "storage": "Em recipiente fechado, na geladeira, por até 3 dias. Reaqueça no forno antes de servir. Recheios com carne, frango ou queijo não devem ficar fora da geladeira por mais de 2 horas.",
  "id": "empada-de-camarao",
  "yield": "18 empadinhas"
 },
 {
  "name": "Esfiha aberta de carne",
  "category": "Esfihas",
  "time": "2 h 10 min",
  "difficulty": "Fácil",
  "estimatedCost": 42,
  "suggestedPrice": 4.5,
  "ingredients": [
   "Recheio:",
   "500 g de carne moída",
   "2 cebolas picadas",
   "2 tomates sem sementes picados",
   "Suco de 1 limão",
   "1 colher (chá) de canela",
   "Sal, pimenta e hortelã",
   "Massa:",
   "500 g de farinha de trigo",
   "1 envelope (10 g) de fermento biológico seco",
   "1 colher (sopa) de açúcar",
   "1 colher (chá) de sal",
   "1/2 xícara de óleo",
   "1/2 xícara de leite morno",
   "1/2 xícara de água morna"
  ],
  "steps": [
   "Misture todos os ingredientes do recheio crus e deixe 15 minutos descansando para soltar o sabor.",
   "Misture o fermento, o açúcar, o leite e a água. Junte o óleo, o sal e a farinha aos poucos.",
   "Sove por 10 minutos até ficar lisa. Deixe crescer coberta por 1 hora, até dobrar.",
   "Faça bolinhas de 40 g, abra em discos, coloque o recheio, deixe descansar 20 minutos e asse a 200 °C por 20 a 25 minutos."
  ],
  "freezing": "Congele já assadas e frias, em saco, por até 90 dias. Reaqueça direto do freezer a 180 °C por 10 a 12 minutos. Também dá para congelar crua, já recheada, e assar sem descongelar (30 a 35 min).",
  "storage": "Em recipiente fechado, na geladeira, por até 3 dias. Reaqueça no forno antes de servir. Recheios com carne, frango ou queijo não devem ficar fora da geladeira por mais de 2 horas.",
  "id": "esfiha-aberta-de-carne",
  "yield": "24 esfihas"
 },
 {
  "name": "Esfiha de queijo",
  "category": "Esfihas",
  "time": "2 h 10 min",
  "difficulty": "Fácil",
  "estimatedCost": 40,
  "suggestedPrice": 4.5,
  "ingredients": [
   "Recheio:",
   "300 g de muçarela ralada",
   "200 g de requeijão cremoso",
   "1 colher (sopa) de orégano",
   "Massa:",
   "500 g de farinha de trigo",
   "1 envelope (10 g) de fermento biológico seco",
   "1 colher (sopa) de açúcar",
   "1 colher (chá) de sal",
   "1/2 xícara de óleo",
   "1/2 xícara de leite morno",
   "1/2 xícara de água morna"
  ],
  "steps": [
   "Misture o queijo ralado com o requeijão até formar uma pasta.",
   "Misture o fermento, o açúcar, o leite e a água. Junte o óleo, o sal e a farinha aos poucos.",
   "Sove por 10 minutos até ficar lisa. Deixe crescer coberta por 1 hora, até dobrar.",
   "Faça bolinhas de 40 g, abra em discos, coloque o recheio, deixe descansar 20 minutos e asse a 200 °C por 20 a 25 minutos."
  ],
  "freezing": "Congele já assadas e frias, em saco, por até 90 dias. Reaqueça direto do freezer a 180 °C por 10 a 12 minutos. Também dá para congelar crua, já recheada, e assar sem descongelar (30 a 35 min).",
  "storage": "Em recipiente fechado, na geladeira, por até 3 dias. Reaqueça no forno antes de servir. Recheios com carne, frango ou queijo não devem ficar fora da geladeira por mais de 2 horas.",
  "id": "esfiha-de-queijo",
  "yield": "24 esfihas"
 },
 {
  "name": "Esfiha de frango com catupiry",
  "category": "Esfihas",
  "time": "2 h 10 min",
  "difficulty": "Fácil",
  "estimatedCost": 44,
  "suggestedPrice": 5.0,
  "ingredients": [
   "Recheio:",
   "400 g de frango cozido e desfiado",
   "1 cebola",
   "1 dente de alho",
   "200 g de requeijão cremoso firme",
   "Sal e cheiro-verde",
   "Massa:",
   "500 g de farinha de trigo",
   "1 envelope (10 g) de fermento biológico seco",
   "1 colher (sopa) de açúcar",
   "1 colher (chá) de sal",
   "1/2 xícara de óleo",
   "1/2 xícara de leite morno",
   "1/2 xícara de água morna"
  ],
  "steps": [
   "Refogue cebola e alho, junte o frango, tempere e esfrie. Misture ao requeijão.",
   "Misture o fermento, o açúcar, o leite e a água. Junte o óleo, o sal e a farinha aos poucos.",
   "Sove por 10 minutos até ficar lisa. Deixe crescer coberta por 1 hora, até dobrar.",
   "Faça bolinhas de 40 g, abra em discos, coloque o recheio, deixe descansar 20 minutos e asse a 200 °C por 20 a 25 minutos."
  ],
  "freezing": "Congele já assadas e frias, em saco, por até 90 dias. Reaqueça direto do freezer a 180 °C por 10 a 12 minutos. Também dá para congelar crua, já recheada, e assar sem descongelar (30 a 35 min).",
  "storage": "Em recipiente fechado, na geladeira, por até 3 dias. Reaqueça no forno antes de servir. Recheios com carne, frango ou queijo não devem ficar fora da geladeira por mais de 2 horas.",
  "id": "esfiha-de-frango-com-catupiry",
  "yield": "24 esfihas"
 },
 {
  "name": "Esfiha de escarola com queijo",
  "category": "Esfihas",
  "time": "2 h 10 min",
  "difficulty": "Fácil",
  "estimatedCost": 36,
  "suggestedPrice": 4.5,
  "ingredients": [
   "Recheio:",
   "1 maço de escarola",
   "1 cebola",
   "2 dentes de alho",
   "1 colher (sopa) de azeite",
   "200 g de muçarela ralada",
   "Massa:",
   "500 g de farinha de trigo",
   "1 envelope (10 g) de fermento biológico seco",
   "1 colher (sopa) de açúcar",
   "1 colher (chá) de sal",
   "1/2 xícara de óleo",
   "1/2 xícara de leite morno",
   "1/2 xícara de água morna"
  ],
  "steps": [
   "Cozinhe a escarola em água por 2 minutos, escorra e esprema bem. Refogue com cebola e alho, misture o queijo e esfrie.",
   "Misture o fermento, o açúcar, o leite e a água. Junte o óleo, o sal e a farinha aos poucos.",
   "Sove por 10 minutos até ficar lisa. Deixe crescer coberta por 1 hora, até dobrar.",
   "Faça bolinhas de 40 g, abra em discos, coloque o recheio, deixe descansar 20 minutos e asse a 200 °C por 20 a 25 minutos."
  ],
  "freezing": "Congele já assadas e frias, em saco, por até 90 dias. Reaqueça direto do freezer a 180 °C por 10 a 12 minutos. Também dá para congelar crua, já recheada, e assar sem descongelar (30 a 35 min).",
  "storage": "Em recipiente fechado, na geladeira, por até 3 dias. Reaqueça no forno antes de servir. Recheios com carne, frango ou queijo não devem ficar fora da geladeira por mais de 2 horas.",
  "id": "esfiha-de-escarola-com-queijo",
  "yield": "24 esfihas"
 },
 {
  "name": "Esfiha fechada de carne",
  "category": "Esfihas",
  "time": "2 h 10 min",
  "difficulty": "Médio",
  "estimatedCost": 42,
  "suggestedPrice": 5.0,
  "ingredients": [
   "Recheio:",
   "500 g de carne moída",
   "2 cebolas",
   "1 tomate sem sementes",
   "Sal, pimenta e cheiro-verde",
   "1 gema para pincelar",
   "Massa:",
   "500 g de farinha de trigo",
   "1 envelope (10 g) de fermento biológico seco",
   "1 colher (sopa) de açúcar",
   "1 colher (chá) de sal",
   "1/2 xícara de óleo",
   "1/2 xícara de leite morno",
   "1/2 xícara de água morna"
  ],
  "steps": [
   "Refogue a carne com a cebola até secar, junte o tomate e tempere. Esfrie.",
   "Misture o fermento, o açúcar, o leite e a água. Junte o óleo, o sal e a farinha aos poucos.",
   "Sove por 10 minutos até ficar lisa. Deixe crescer coberta por 1 hora, até dobrar.",
   "Faça bolinhas de 40 g, abra em discos, recheie, feche em triângulo apertando as pontas, pincele a gema e asse a 200 °C por 25 minutos."
  ],
  "freezing": "Congele já assadas e frias, em saco, por até 90 dias. Reaqueça direto do freezer a 180 °C por 10 a 12 minutos. Também dá para congelar crua, já recheada, e assar sem descongelar (30 a 35 min).",
  "storage": "Em recipiente fechado, na geladeira, por até 3 dias. Reaqueça no forno antes de servir. Recheios com carne, frango ou queijo não devem ficar fora da geladeira por mais de 2 horas.",
  "id": "esfiha-fechada-de-carne",
  "yield": "24 esfihas"
 },
 {
  "name": "Quibe frito de carne",
  "category": "Quibes",
  "time": "1 h 15 min + 1 h de repouso",
  "difficulty": "Médio",
  "estimatedCost": 40,
  "suggestedPrice": 5.5,
  "ingredients": [
   "250 g de trigo para quibe",
   "500 g de carne moída (patinho)",
   "1 cebola ralada",
   "1 maço pequeno de hortelã picada",
   "1 colher (chá) de canela",
   "Sal e pimenta-do-reino",
   "Recheio: 1 cebola refogada com 200 g de carne moída",
   "Óleo para fritar"
  ],
  "steps": [
   "Deixe o trigo de molho em água morna por 30 minutos, escorra e esprema bem.",
   "Misture o trigo com a carne crua, a cebola ralada, a hortelã e os temperos. Processe ou amasse bem até ficar uma massa lisa. Gele por 1 hora.",
   "Refogue a carne do recheio com cebola e esfrie.",
   "Modele bolinhas, faça um buraco, coloque o recheio, feche em formato de ovo pontudo e frite em óleo quente (180 °C) até dourar."
  ],
  "freezing": "Congele cru e já empanado, em bandeja forrada e sem encostar um no outro, por 2 horas; depois passe para saco próprio com a data. Dura até 90 dias. Frite ainda congelado em óleo médio (170 °C) por 8 a 10 minutos, sem descongelar.",
  "storage": "Fritos: melhor no mesmo dia, em recipiente aberto. Sobras: geladeira por até 2 dias e reaqueça no forno ou air fryer para recuperar a crocância.",
  "id": "quibe-frito-de-carne",
  "yield": "25 unidades"
 },
 {
  "name": "Quibe assado de forma",
  "category": "Quibes",
  "time": "1 h 20 min",
  "difficulty": "Fácil",
  "estimatedCost": 32,
  "suggestedPrice": 5.0,
  "ingredients": [
   "250 g de trigo para quibe",
   "500 g de carne moída",
   "1 cebola ralada",
   "Hortelã picada",
   "Sal, pimenta e canela",
   "3 colheres (sopa) de azeite",
   "200 g de muçarela fatiada (recheio)"
  ],
  "steps": [
   "Hidrate o trigo por 30 minutos e esprema.",
   "Misture o trigo com a carne, cebola e temperos e amasse bem.",
   "Em forma untada, coloque metade da massa, o queijo fatiado e cubra com o restante. Marque losangos, regue com azeite e asse a 200 °C por 40 minutos."
  ],
  "freezing": "Depois de assado e frio, corte em porções, congele por até 90 dias e reaqueça a 180 °C por 15 minutos.",
  "storage": "Em recipiente fechado, na geladeira, por até 3 dias. Reaqueça no forno antes de servir. Recheios com carne, frango ou queijo não devem ficar fora da geladeira por mais de 2 horas.",
  "id": "quibe-assado-de-forma",
  "yield": "12 fatias"
 },
 {
  "name": "Quibe recheado com requeijão",
  "category": "Quibes",
  "time": "1 h 20 min + 1 h de repouso",
  "difficulty": "Médio",
  "estimatedCost": 46,
  "suggestedPrice": 6.0,
  "ingredients": [
   "250 g de trigo para quibe",
   "500 g de carne moída",
   "1 cebola ralada",
   "Hortelã",
   "Sal e pimenta",
   "200 g de requeijão cremoso firme",
   "Óleo para fritar"
  ],
  "steps": [
   "Hidrate o trigo por 30 minutos e esprema bem.",
   "Amasse o trigo com a carne e os temperos até formar massa lisa; gele 1 hora.",
   "Modele, recheie com uma colher de requeijão, feche bem e frite em óleo quente (180 °C) até dourar."
  ],
  "freezing": "Congele cru e já empanado, em bandeja forrada e sem encostar um no outro, por 2 horas; depois passe para saco próprio com a data. Dura até 90 dias. Frite ainda congelado em óleo médio (170 °C) por 8 a 10 minutos, sem descongelar.",
  "storage": "Fritos: melhor no mesmo dia, em recipiente aberto. Sobras: geladeira por até 2 dias e reaqueça no forno ou air fryer para recuperar a crocância.",
  "id": "quibe-recheado-com-requeijao",
  "yield": "25 unidades"
 },
 {
  "name": "Quibe de grão-de-bico assado",
  "category": "Quibes",
  "time": "50 min",
  "difficulty": "Fácil",
  "estimatedCost": 22,
  "suggestedPrice": 4.5,
  "ingredients": [
   "2 xícaras de grão-de-bico cozido",
   "1 xícara de trigo para quibe hidratado",
   "1 cebola ralada",
   "1 dente de alho",
   "1 colher (sopa) de hortelã",
   "3 colheres (sopa) de azeite",
   "Sal e cominho"
  ],
  "steps": [
   "Processe o grão-de-bico com a cebola e o alho até ficar uma pasta grossa.",
   "Misture com o trigo hidratado e escorrido, a hortelã e os temperos.",
   "Modele bolinhas pontudas, pincele azeite e asse a 200 °C por 25 minutos, virando na metade."
  ],
  "freezing": "Congele cru, em bandeja, até endurecer (2 horas), e depois guarde em saco próprio por até 90 dias. Leve ainda congelado ao forno pré-aquecido a 200 °C e asse por 30 a 40 minutos, até dourar.",
  "storage": "Em recipiente fechado, na geladeira, por até 3 dias. Reaqueça no forno antes de servir. Recheios com carne, frango ou queijo não devem ficar fora da geladeira por mais de 2 horas.",
  "id": "quibe-de-grao-de-bico-assado",
  "yield": "20 unidades"
 },
 {
  "name": "Risole de presunto e queijo",
  "category": "Risoles",
  "time": "1 h 30 min",
  "difficulty": "Médio",
  "estimatedCost": 36,
  "suggestedPrice": 5.0,
  "ingredients": [
   "Recheio:",
   "300 g de presunto picado",
   "300 g de muçarela picada",
   "1 xícara de molho branco grosso",
   "Massa:",
   "500 ml de leite",
   "500 ml de água",
   "2 colheres (sopa) de margarina",
   "1 colher (chá) de sal",
   "2 xícaras (300 g) de farinha de trigo",
   "Para empanar: 2 ovos batidos e farinha de rosca",
   "Óleo para fritar"
  ],
  "steps": [
   "Misture o presunto e o queijo ao molho branco grosso e esfrie.",
   "Ferva o leite, a água, a margarina e o sal. Junte a farinha de uma vez e mexa sem parar até desgrudar da panela. Deixe amornar.",
   "Abra a massa com rolo (3 mm), corte discos de 8 cm, recheie, feche em meia-lua e passe no ovo e na farinha de rosca.",
   "Frite em óleo médio (170 °C) até dourar bem."
  ],
  "freezing": "Congele cru e já empanado, em bandeja forrada e sem encostar um no outro, por 2 horas; depois passe para saco próprio com a data. Dura até 90 dias. Frite ainda congelado em óleo médio (170 °C) por 8 a 10 minutos, sem descongelar.",
  "storage": "Fritos: melhor no mesmo dia, em recipiente aberto. Sobras: geladeira por até 2 dias e reaqueça no forno ou air fryer para recuperar a crocância.",
  "id": "risole-de-presunto-e-queijo",
  "yield": "30 unidades"
 },
 {
  "name": "Risole de frango",
  "category": "Risoles",
  "time": "1 h 30 min",
  "difficulty": "Médio",
  "estimatedCost": 36,
  "suggestedPrice": 5.0,
  "ingredients": [
   "Recheio:",
   "500 g de frango cozido e desfiado",
   "1 cebola",
   "1 dente de alho",
   "1 xícara de molho branco grosso",
   "Salsinha",
   "Massa:",
   "500 ml de leite",
   "500 ml de água",
   "2 colheres (sopa) de margarina",
   "1 colher (chá) de sal",
   "2 xícaras (300 g) de farinha de trigo",
   "Para empanar: 2 ovos batidos e farinha de rosca",
   "Óleo para fritar"
  ],
  "steps": [
   "Refogue cebola e alho, junte o frango e o molho branco e deixe esfriar.",
   "Ferva o leite, a água, a margarina e o sal. Junte a farinha de uma vez e mexa sem parar até desgrudar da panela. Deixe amornar.",
   "Abra a massa com rolo (3 mm), corte discos de 8 cm, recheie, feche em meia-lua e passe no ovo e na farinha de rosca.",
   "Frite em óleo médio (170 °C) até dourar bem."
  ],
  "freezing": "Congele cru e já empanado, em bandeja forrada e sem encostar um no outro, por 2 horas; depois passe para saco próprio com a data. Dura até 90 dias. Frite ainda congelado em óleo médio (170 °C) por 8 a 10 minutos, sem descongelar.",
  "storage": "Fritos: melhor no mesmo dia, em recipiente aberto. Sobras: geladeira por até 2 dias e reaqueça no forno ou air fryer para recuperar a crocância.",
  "id": "risole-de-frango",
  "yield": "30 unidades"
 },
 {
  "name": "Risole de carne",
  "category": "Risoles",
  "time": "1 h 30 min",
  "difficulty": "Médio",
  "estimatedCost": 40,
  "suggestedPrice": 5.5,
  "ingredients": [
   "Recheio:",
   "400 g de carne moída refogada",
   "1 cebola",
   "1 tomate",
   "Azeitonas picadas",
   "Sal e temperos",
   "Massa:",
   "500 ml de leite",
   "500 ml de água",
   "2 colheres (sopa) de margarina",
   "1 colher (chá) de sal",
   "2 xícaras (300 g) de farinha de trigo",
   "Para empanar: 2 ovos batidos e farinha de rosca",
   "Óleo para fritar"
  ],
  "steps": [
   "Refogue a carne com cebola e tomate até secar e esfrie.",
   "Ferva o leite, a água, a margarina e o sal. Junte a farinha de uma vez e mexa sem parar até desgrudar da panela. Deixe amornar.",
   "Abra a massa com rolo (3 mm), corte discos de 8 cm, recheie, feche em meia-lua e passe no ovo e na farinha de rosca.",
   "Frite em óleo médio (170 °C) até dourar bem."
  ],
  "freezing": "Congele cru e já empanado, em bandeja forrada e sem encostar um no outro, por 2 horas; depois passe para saco próprio com a data. Dura até 90 dias. Frite ainda congelado em óleo médio (170 °C) por 8 a 10 minutos, sem descongelar.",
  "storage": "Fritos: melhor no mesmo dia, em recipiente aberto. Sobras: geladeira por até 2 dias e reaqueça no forno ou air fryer para recuperar a crocância.",
  "id": "risole-de-carne",
  "yield": "30 unidades"
 },
 {
  "name": "Risole de milho com queijo",
  "category": "Risoles",
  "time": "1 h 30 min",
  "difficulty": "Fácil",
  "estimatedCost": 28,
  "suggestedPrice": 4.5,
  "ingredients": [
   "Recheio:",
   "2 latas de milho escorrido",
   "200 g de muçarela",
   "1 xícara de molho branco grosso",
   "Sal e salsinha",
   "Massa:",
   "500 ml de leite",
   "500 ml de água",
   "2 colheres (sopa) de margarina",
   "1 colher (chá) de sal",
   "2 xícaras (300 g) de farinha de trigo",
   "Para empanar: 2 ovos batidos e farinha de rosca",
   "Óleo para fritar"
  ],
  "steps": [
   "Misture o milho, o queijo ralado e o molho branco.",
   "Ferva o leite, a água, a margarina e o sal. Junte a farinha de uma vez e mexa sem parar até desgrudar da panela. Deixe amornar.",
   "Abra a massa com rolo (3 mm), corte discos de 8 cm, recheie, feche em meia-lua e passe no ovo e na farinha de rosca.",
   "Frite em óleo médio (170 °C) até dourar bem."
  ],
  "freezing": "Congele cru e já empanado, em bandeja forrada e sem encostar um no outro, por 2 horas; depois passe para saco próprio com a data. Dura até 90 dias. Frite ainda congelado em óleo médio (170 °C) por 8 a 10 minutos, sem descongelar.",
  "storage": "Fritos: melhor no mesmo dia, em recipiente aberto. Sobras: geladeira por até 2 dias e reaqueça no forno ou air fryer para recuperar a crocância.",
  "id": "risole-de-milho-com-queijo",
  "yield": "30 unidades"
 },
 {
  "name": "Enroladinho de salsicha",
  "category": "Enroladinhos",
  "time": "2 h 10 min",
  "difficulty": "Fácil",
  "estimatedCost": 30,
  "suggestedPrice": 4.0,
  "ingredients": [
   "Recheio:",
   "15 salsichas cortadas ao meio",
   "Catchup ou mostarda (opcional)",
   "Massa:",
   "500 g de farinha de trigo",
   "1 envelope (10 g) de fermento biológico seco",
   "2 colheres (sopa) de açúcar",
   "1 colher (chá) de sal",
   "1/2 xícara de óleo",
   "1 xícara de leite morno",
   "1 ovo",
   "1 gema + 1 colher (sopa) de leite para pincelar"
  ],
  "steps": [
   "Misture o fermento, o açúcar, o leite e o ovo. Junte o óleo, o sal e a farinha aos poucos e sove até ficar macia.",
   "Deixe crescer coberta por 1 hora. Abra a massa (5 mm) e corte triângulos ou tiras.",
   "Enrole o recheio, coloque em assadeira com espaço, deixe descansar 20 minutos, pincele a gema com leite e asse a 180 °C por 25 a 30 minutos até dourar."
  ],
  "freezing": "Congele cru, já enrolado, em bandeja até firmar e depois em saco por até 90 dias. Pincele a gema e asse sem descongelar, a 180 °C por 35 a 40 minutos. Prontos e frios também congelam por 60 dias.",
  "storage": "Em recipiente fechado, na geladeira, por até 3 dias. Reaqueça no forno antes de servir. Recheios com carne, frango ou queijo não devem ficar fora da geladeira por mais de 2 horas.",
  "id": "enroladinho-de-salsicha",
  "yield": "30 unidades"
 },
 {
  "name": "Enroladinho de presunto e queijo",
  "category": "Enroladinhos",
  "time": "2 h 10 min",
  "difficulty": "Fácil",
  "estimatedCost": 38,
  "suggestedPrice": 5.0,
  "ingredients": [
   "Recheio:",
   "250 g de presunto fatiado",
   "250 g de muçarela fatiada",
   "Massa:",
   "500 g de farinha de trigo",
   "1 envelope (10 g) de fermento biológico seco",
   "2 colheres (sopa) de açúcar",
   "1 colher (chá) de sal",
   "1/2 xícara de óleo",
   "1 xícara de leite morno",
   "1 ovo",
   "1 gema + 1 colher (sopa) de leite para pincelar"
  ],
  "steps": [
   "Misture o fermento, o açúcar, o leite e o ovo. Junte o óleo, o sal e a farinha aos poucos e sove até ficar macia.",
   "Deixe crescer coberta por 1 hora. Abra a massa (5 mm) e corte triângulos ou tiras.",
   "Enrole o recheio, coloque em assadeira com espaço, deixe descansar 20 minutos, pincele a gema com leite e asse a 180 °C por 25 a 30 minutos até dourar."
  ],
  "freezing": "Congele cru, já enrolado, em bandeja até firmar e depois em saco por até 90 dias. Pincele a gema e asse sem descongelar, a 180 °C por 35 a 40 minutos. Prontos e frios também congelam por 60 dias.",
  "storage": "Em recipiente fechado, na geladeira, por até 3 dias. Reaqueça no forno antes de servir. Recheios com carne, frango ou queijo não devem ficar fora da geladeira por mais de 2 horas.",
  "id": "enroladinho-de-presunto-e-queijo",
  "yield": "30 unidades"
 },
 {
  "name": "Enroladinho de calabresa com queijo",
  "category": "Enroladinhos",
  "time": "2 h 10 min",
  "difficulty": "Fácil",
  "estimatedCost": 36,
  "suggestedPrice": 5.0,
  "ingredients": [
   "Recheio:",
   "300 g de calabresa em tirinhas",
   "200 g de muçarela em tiras",
   "Massa:",
   "500 g de farinha de trigo",
   "1 envelope (10 g) de fermento biológico seco",
   "2 colheres (sopa) de açúcar",
   "1 colher (chá) de sal",
   "1/2 xícara de óleo",
   "1 xícara de leite morno",
   "1 ovo",
   "1 gema + 1 colher (sopa) de leite para pincelar"
  ],
  "steps": [
   "Misture o fermento, o açúcar, o leite e o ovo. Junte o óleo, o sal e a farinha aos poucos e sove até ficar macia.",
   "Deixe crescer coberta por 1 hora. Abra a massa (5 mm) e corte triângulos ou tiras.",
   "Enrole o recheio, coloque em assadeira com espaço, deixe descansar 20 minutos, pincele a gema com leite e asse a 180 °C por 25 a 30 minutos até dourar."
  ],
  "freezing": "Congele cru, já enrolado, em bandeja até firmar e depois em saco por até 90 dias. Pincele a gema e asse sem descongelar, a 180 °C por 35 a 40 minutos. Prontos e frios também congelam por 60 dias.",
  "storage": "Em recipiente fechado, na geladeira, por até 3 dias. Reaqueça no forno antes de servir. Recheios com carne, frango ou queijo não devem ficar fora da geladeira por mais de 2 horas.",
  "id": "enroladinho-de-calabresa-com-queijo",
  "yield": "30 unidades"
 },
 {
  "name": "Enroladinho de frango com requeijão",
  "category": "Enroladinhos",
  "time": "2 h 10 min",
  "difficulty": "Fácil",
  "estimatedCost": 38,
  "suggestedPrice": 5.0,
  "ingredients": [
   "Recheio:",
   "400 g de frango desfiado e temperado",
   "150 g de requeijão cremoso firme",
   "Massa:",
   "500 g de farinha de trigo",
   "1 envelope (10 g) de fermento biológico seco",
   "2 colheres (sopa) de açúcar",
   "1 colher (chá) de sal",
   "1/2 xícara de óleo",
   "1 xícara de leite morno",
   "1 ovo",
   "1 gema + 1 colher (sopa) de leite para pincelar"
  ],
  "steps": [
   "Misture o fermento, o açúcar, o leite e o ovo. Junte o óleo, o sal e a farinha aos poucos e sove até ficar macia.",
   "Deixe crescer coberta por 1 hora. Abra a massa (5 mm) e corte triângulos ou tiras.",
   "Enrole o recheio, coloque em assadeira com espaço, deixe descansar 20 minutos, pincele a gema com leite e asse a 180 °C por 25 a 30 minutos até dourar."
  ],
  "freezing": "Congele cru, já enrolado, em bandeja até firmar e depois em saco por até 90 dias. Pincele a gema e asse sem descongelar, a 180 °C por 35 a 40 minutos. Prontos e frios também congelam por 60 dias.",
  "storage": "Em recipiente fechado, na geladeira, por até 3 dias. Reaqueça no forno antes de servir. Recheios com carne, frango ou queijo não devem ficar fora da geladeira por mais de 2 horas.",
  "id": "enroladinho-de-frango-com-requeijao",
  "yield": "30 unidades"
 },
 {
  "name": "Folhado de queijo",
  "category": "Folhados",
  "time": "50 min",
  "difficulty": "Fácil",
  "estimatedCost": 42,
  "suggestedPrice": 5.5,
  "ingredients": [
   "Recheio:",
   "300 g de muçarela em cubos",
   "100 g de parmesão ralado",
   "2 pacotes (500 g cada) de massa folhada pronta",
   "1 gema para pincelar",
   "Farinha de trigo para abrir"
  ],
  "steps": [
   "Descongele a massa folhada na geladeira e abra sobre a bancada enfarinhada (3 mm).",
   "Corte quadrados de 8 cm, coloque o recheio no centro e feche em triângulo apertando as bordas com garfo.",
   "Pincele a gema e asse a 200 °C por 20 a 25 minutos, até dourar e crescer."
  ],
  "freezing": "Congele crus em bandeja e depois em saco por até 60 dias. Pincele a gema e asse sem descongelar, a 200 °C, por 30 minutos.",
  "storage": "Em recipiente fechado, na geladeira, por até 3 dias. Reaqueça no forno antes de servir. Recheios com carne, frango ou queijo não devem ficar fora da geladeira por mais de 2 horas.",
  "id": "folhado-de-queijo",
  "yield": "24 unidades"
 },
 {
  "name": "Folhado de presunto e queijo",
  "category": "Folhados",
  "time": "50 min",
  "difficulty": "Fácil",
  "estimatedCost": 44,
  "suggestedPrice": 6.0,
  "ingredients": [
   "Recheio:",
   "250 g de presunto picado",
   "250 g de muçarela picada",
   "2 pacotes (500 g cada) de massa folhada pronta",
   "1 gema para pincelar",
   "Farinha de trigo para abrir"
  ],
  "steps": [
   "Descongele a massa folhada na geladeira e abra sobre a bancada enfarinhada (3 mm).",
   "Corte quadrados de 8 cm, coloque o recheio no centro e feche em triângulo apertando as bordas com garfo.",
   "Pincele a gema e asse a 200 °C por 20 a 25 minutos, até dourar e crescer."
  ],
  "freezing": "Congele crus em bandeja e depois em saco por até 60 dias. Pincele a gema e asse sem descongelar, a 200 °C, por 30 minutos.",
  "storage": "Em recipiente fechado, na geladeira, por até 3 dias. Reaqueça no forno antes de servir. Recheios com carne, frango ou queijo não devem ficar fora da geladeira por mais de 2 horas.",
  "id": "folhado-de-presunto-e-queijo",
  "yield": "24 unidades"
 },
 {
  "name": "Folhado de frango com requeijão",
  "category": "Folhados",
  "time": "50 min",
  "difficulty": "Fácil",
  "estimatedCost": 46,
  "suggestedPrice": 6.0,
  "ingredients": [
   "Recheio:",
   "400 g de frango desfiado temperado",
   "150 g de requeijão cremoso firme",
   "2 pacotes (500 g cada) de massa folhada pronta",
   "1 gema para pincelar",
   "Farinha de trigo para abrir"
  ],
  "steps": [
   "Descongele a massa folhada na geladeira e abra sobre a bancada enfarinhada (3 mm).",
   "Corte quadrados de 8 cm, coloque o recheio no centro e feche em triângulo apertando as bordas com garfo.",
   "Pincele a gema e asse a 200 °C por 20 a 25 minutos, até dourar e crescer."
  ],
  "freezing": "Congele crus em bandeja e depois em saco por até 60 dias. Pincele a gema e asse sem descongelar, a 200 °C, por 30 minutos.",
  "storage": "Em recipiente fechado, na geladeira, por até 3 dias. Reaqueça no forno antes de servir. Recheios com carne, frango ou queijo não devem ficar fora da geladeira por mais de 2 horas.",
  "id": "folhado-de-frango-com-requeijao",
  "yield": "24 unidades"
 },
 {
  "name": "Folhado de brócolis com ricota",
  "category": "Folhados",
  "time": "50 min",
  "difficulty": "Fácil",
  "estimatedCost": 38,
  "suggestedPrice": 5.5,
  "ingredients": [
   "Recheio:",
   "1 maço de brócolis cozido e picado",
   "250 g de ricota amassada",
   "1 dente de alho",
   "1 colher (sopa) de azeite",
   "Sal e noz-moscada",
   "2 pacotes (500 g cada) de massa folhada pronta",
   "1 gema para pincelar",
   "Farinha de trigo para abrir"
  ],
  "steps": [
   "Descongele a massa folhada na geladeira e abra sobre a bancada enfarinhada (3 mm).",
   "Corte quadrados de 8 cm, coloque o recheio no centro e feche em triângulo apertando as bordas com garfo.",
   "Pincele a gema e asse a 200 °C por 20 a 25 minutos, até dourar e crescer."
  ],
  "freezing": "Congele crus em bandeja e depois em saco por até 60 dias. Pincele a gema e asse sem descongelar, a 200 °C, por 30 minutos.",
  "storage": "Em recipiente fechado, na geladeira, por até 3 dias. Reaqueça no forno antes de servir. Recheios com carne, frango ou queijo não devem ficar fora da geladeira por mais de 2 horas.",
  "id": "folhado-de-brocolis-com-ricota",
  "yield": "24 unidades"
 },
 {
  "name": "Pão de queijo mineiro",
  "category": "Pães e assados",
  "time": "50 min",
  "difficulty": "Fácil",
  "estimatedCost": 22,
  "suggestedPrice": 2.5,
  "ingredients": [
   "500 g de polvilho azedo",
   "1 xícara de leite",
   "1 xícara de óleo",
   "1 colher (chá) de sal",
   "3 ovos",
   "300 g de queijo meia-cura ou parmesão ralado"
  ],
  "steps": [
   "Ferva o leite, o óleo e o sal e escalde o polvilho, mexendo até ficar farelento. Deixe amornar.",
   "Junte os ovos um a um, sovando, e depois o queijo. Se necessário, acrescente 1 colher de leite.",
   "Faça bolinhas de 30 g e asse em forma untada a 200 °C por 25 a 30 minutos."
  ],
  "freezing": "Congele cru, em bolinhas, por até 90 dias e asse sem descongelar a 200 °C por 30 a 35 minutos.",
  "storage": "Em recipiente fechado, na geladeira, por até 3 dias. Reaqueça no forno antes de servir. Recheios com carne, frango ou queijo não devem ficar fora da geladeira por mais de 2 horas.",
  "id": "pao-de-queijo-mineiro",
  "yield": "40 unidades pequenas"
 },
 {
  "name": "Pão de batata recheado",
  "category": "Pães e assados",
  "time": "2 h 30 min",
  "difficulty": "Médio",
  "estimatedCost": 34,
  "suggestedPrice": 4.5,
  "ingredients": [
   "500 g de batata cozida e amassada",
   "500 g de farinha de trigo",
   "10 g de fermento biológico seco",
   "1/2 xícara de óleo",
   "1/2 xícara de leite morno",
   "1 colher (sopa) de açúcar",
   "1 colher (chá) de sal",
   "Presunto e muçarela para rechear",
   "Gema para pincelar"
  ],
  "steps": [
   "Misture o fermento, o açúcar e o leite. Junte a batata, o óleo e o sal e depois a farinha, sovando até soltar das mãos.",
   "Deixe crescer por 1 hora. Faça bolinhas, abra, recheie com presunto e queijo e feche.",
   "Descanse 30 minutos, pincele a gema e asse a 180 °C por 30 minutos."
  ],
  "freezing": "Congele cru, em bandeja, até endurecer (2 horas), e depois guarde em saco próprio por até 90 dias. Asse ainda congelado a 180 °C por 40 minutos.",
  "storage": "Em recipiente fechado, na geladeira, por até 3 dias. Reaqueça no forno antes de servir. Recheios com carne, frango ou queijo não devem ficar fora da geladeira por mais de 2 horas.",
  "id": "pao-de-batata-recheado",
  "yield": "20 unidades"
 },
 {
  "name": "Mini pizza de forno",
  "category": "Pães e assados",
  "time": "1 h 30 min",
  "difficulty": "Fácil",
  "estimatedCost": 30,
  "suggestedPrice": 3.5,
  "ingredients": [
   "500 g de farinha de trigo",
   "10 g de fermento biológico seco",
   "1 colher (sopa) de açúcar",
   "1 colher (chá) de sal",
   "1/2 xícara de óleo",
   "1 xícara de água morna",
   "Molho de tomate",
   "250 g de muçarela",
   "Presunto, orégano e azeitonas"
  ],
  "steps": [
   "Prepare a massa misturando todos os ingredientes secos e depois os líquidos. Sove e deixe crescer 1 hora.",
   "Abra a massa, corte discos de 6 cm, coloque molho, queijo, presunto e orégano.",
   "Asse a 200 °C por 15 a 20 minutos."
  ],
  "freezing": "Depois de assados e frios, congele em saco por até 60 dias. Reaqueça no forno a 180 °C por 10 a 15 minutos, sem tampar, para voltar a ficar crocante.",
  "storage": "Em recipiente fechado, na geladeira, por até 3 dias. Reaqueça no forno antes de servir. Recheios com carne, frango ou queijo não devem ficar fora da geladeira por mais de 2 horas.",
  "id": "mini-pizza-de-forno",
  "yield": "30 unidades"
 },
 {
  "name": "Pão de linguiça",
  "category": "Pães e assados",
  "time": "2 h 30 min",
  "difficulty": "Médio",
  "estimatedCost": 38,
  "suggestedPrice": 6.5,
  "ingredients": [
   "500 g de farinha de trigo",
   "10 g de fermento biológico seco",
   "1 colher (sopa) de açúcar",
   "1 colher (chá) de sal",
   "1/2 xícara de óleo",
   "1 xícara de leite morno",
   "12 linguiças tipo toscana cozidas e frias",
   "Gema para pincelar"
  ],
  "steps": [
   "Faça a massa de pão, sove e deixe crescer por 1 hora.",
   "Divida em 12 porções, abra em retângulos e enrole cada linguiça na massa.",
   "Descanse 20 minutos, pincele gema e asse a 180 °C por 30 minutos."
  ],
  "freezing": "Depois de assado e frio, congele por até 60 dias. Reaqueça a 180 °C por 15 minutos.",
  "storage": "Em recipiente fechado, na geladeira, por até 3 dias. Reaqueça no forno antes de servir. Recheios com carne, frango ou queijo não devem ficar fora da geladeira por mais de 2 horas.",
  "id": "pao-de-linguica",
  "yield": "12 unidades"
 },
 {
  "name": "Biscoito de polvilho salgado assado",
  "category": "Pães e assados",
  "time": "50 min",
  "difficulty": "Fácil",
  "estimatedCost": 14,
  "suggestedPrice": 1.5,
  "ingredients": [
   "2 xícaras de polvilho doce",
   "1 xícara de polvilho azedo",
   "1 colher (chá) de sal",
   "1/2 xícara de óleo",
   "1 xícara de água fervente",
   "1 ovo",
   "100 g de queijo ralado"
  ],
  "steps": [
   "Escalde os polvilhos com água, óleo e sal fervendo e mexa. Deixe amornar.",
   "Junte o ovo e o queijo e sove até dar ponto de enrolar.",
   "Faça rolinhos ou argolas e asse a 180 °C por 25 minutos, até firmar e dourar levemente."
  ],
  "freezing": "Cru, em formato, pode ser congelado por 60 dias e assado sem descongelar a 180 °C por 30 minutos.",
  "storage": "Depois de frio, guarde em pote hermético por até 15 dias.",
  "id": "biscoito-de-polvilho-salgado-assado",
  "yield": "50 unidades"
 },
 {
  "name": "Mini coxinha para festa",
  "category": "Mini salgados",
  "time": "2 h 30 min",
  "difficulty": "Médio",
  "estimatedCost": 75,
  "suggestedPrice": 0.95,
  "ingredients": [
   "Recheio: 700 g de frango cozido e desfiado, 1 cebola, alho, 2 colheres de óleo, cheiro-verde",
   "Massa: 1,2 litro de caldo, 3 colheres (sopa) de margarina, 1 colher (chá) de sal, 600 g de farinha de trigo",
   "3 ovos batidos e farinha de rosca",
   "Óleo para fritar"
  ],
  "steps": [
   "Prepare o recheio como o da coxinha tradicional e esfrie.",
   "Faça a massa cozida, sove e modele bolinhas de 15 g em formato de gota com um pouco de recheio.",
   "Empane e frite em óleo médio (170 °C) por 3 a 4 minutos."
  ],
  "freezing": "Congele cru e já empanado, em bandeja forrada e sem encostar um no outro, por 2 horas; depois passe para saco próprio com a data. Dura até 90 dias. Frite ainda congelado em óleo médio (170 °C) por 4 a 5 minutos, sem descongelar.",
  "storage": "Em recipiente fechado, na geladeira, por até 3 dias. Reaqueça no forno antes de servir. Recheios com carne, frango ou queijo não devem ficar fora da geladeira por mais de 2 horas.",
  "id": "mini-coxinha-para-festa",
  "yield": "100 unidades"
 },
 {
  "name": "Bolinha de queijo",
  "category": "Mini salgados",
  "time": "1 h 30 min",
  "difficulty": "Médio",
  "estimatedCost": 38,
  "suggestedPrice": 0.8,
  "ingredients": [
   "500 g de muçarela em cubos pequenos",
   "500 ml de leite",
   "2 colheres (sopa) de margarina",
   "1 colher (chá) de sal",
   "300 g de farinha de trigo",
   "Ovos e farinha de rosca para empanar",
   "Óleo para fritar"
  ],
  "steps": [
   "Ferva o leite, a margarina e o sal, junte a farinha de uma vez e mexa até soltar do fundo.",
   "Quando amornar, modele bolinhas com um cubo de queijo dentro, empane duas vezes (ovo e farinha de rosca).",
   "Frite em óleo médio (170 °C) até dourar."
  ],
  "freezing": "Congele cru e já empanado, em bandeja forrada e sem encostar um no outro, por 2 horas; depois passe para saco próprio com a data. Dura até 90 dias. Frite ainda congelado em óleo médio (170 °C) por 4 a 5 minutos, sem descongelar.",
  "storage": "Em recipiente fechado, na geladeira, por até 3 dias. Reaqueça no forno antes de servir. Recheios com carne, frango ou queijo não devem ficar fora da geladeira por mais de 2 horas.",
  "id": "bolinha-de-queijo",
  "yield": "60 unidades"
 },
 {
  "name": "Mini quibe",
  "category": "Mini salgados",
  "time": "1 h 20 min + 1 h de repouso",
  "difficulty": "Médio",
  "estimatedCost": 34,
  "suggestedPrice": 0.9,
  "ingredients": [
   "250 g de trigo para quibe",
   "500 g de carne moída",
   "1 cebola ralada",
   "Hortelã",
   "Sal e pimenta",
   "Óleo para fritar"
  ],
  "steps": [
   "Hidrate o trigo por 30 minutos e esprema.",
   "Amasse tudo e gele por 1 hora.",
   "Modele bolinhas pontudas de 20 g e frite em óleo quente (180 °C) por 3 minutos."
  ],
  "freezing": "Congele cru e já empanado, em bandeja forrada e sem encostar um no outro, por 2 horas; depois passe para saco próprio com a data. Dura até 90 dias. Frite ainda congelado em óleo médio (170 °C) por 4 a 5 minutos, sem descongelar.",
  "storage": "Em recipiente fechado, na geladeira, por até 3 dias. Reaqueça no forno antes de servir. Recheios com carne, frango ou queijo não devem ficar fora da geladeira por mais de 2 horas.",
  "id": "mini-quibe",
  "yield": "60 unidades"
 },
 {
  "name": "Mini pastel de festa",
  "category": "Mini salgados",
  "time": "1 h 10 min",
  "difficulty": "Fácil",
  "estimatedCost": 28,
  "suggestedPrice": 0.85,
  "ingredients": [
   "500 g de farinha de trigo",
   "1 ovo",
   "1 colher (sopa) de cachaça",
   "2 colheres (sopa) de óleo",
   "Sal",
   "Água morna",
   "Recheio de queijo, carne ou frango (300 g)"
  ],
  "steps": [
   "Faça a massa de pastel, descanse 30 minutos e abra bem fina.",
   "Corte discos de 6 cm, recheie com pouco recheio e feche com garfo.",
   "Frite em óleo bem quente (180 °C) até dourar."
  ],
  "freezing": "Congele cru e já empanado, em bandeja forrada e sem encostar um no outro, por 2 horas; depois passe para saco próprio com a data. Dura até 90 dias. Frite ainda congelado em óleo médio (170 °C) por 3 a 4 minutos, sem descongelar.",
  "storage": "Em recipiente fechado, na geladeira, por até 3 dias. Reaqueça no forno antes de servir. Recheios com carne, frango ou queijo não devem ficar fora da geladeira por mais de 2 horas.",
  "id": "mini-pastel-de-festa",
  "yield": "60 unidades"
 },
 {
  "name": "Mini risole de presunto e queijo",
  "category": "Mini salgados",
  "time": "1 h 40 min",
  "difficulty": "Médio",
  "estimatedCost": 34,
  "suggestedPrice": 0.8,
  "ingredients": [
   "Massa de risole (500 ml de leite, 500 ml de água, 2 colheres de margarina, sal, 300 g de farinha)",
   "200 g de presunto",
   "200 g de muçarela",
   "Molho branco grosso",
   "Ovos e farinha de rosca"
  ],
  "steps": [
   "Prepare a massa e o recheio como o risole tradicional.",
   "Corte discos de 5 cm, recheie pouco, feche em meia-lua e empane.",
   "Frite em óleo médio (170 °C) por 3 minutos."
  ],
  "freezing": "Congele cru e já empanado, em bandeja forrada e sem encostar um no outro, por 2 horas; depois passe para saco próprio com a data. Dura até 90 dias. Frite ainda congelado em óleo médio (170 °C) por 4 a 5 minutos, sem descongelar.",
  "storage": "Em recipiente fechado, na geladeira, por até 3 dias. Reaqueça no forno antes de servir. Recheios com carne, frango ou queijo não devem ficar fora da geladeira por mais de 2 horas.",
  "id": "mini-risole-de-presunto-e-queijo",
  "yield": "70 unidades"
 },
 {
  "name": "Croquete de carne",
  "category": "Outros",
  "time": "1 h 30 min",
  "difficulty": "Médio",
  "estimatedCost": 38,
  "suggestedPrice": 4.5,
  "ingredients": [
   "500 g de carne moída refogada",
   "2 batatas médias cozidas e amassadas",
   "1 cebola",
   "2 dentes de alho",
   "1 xícara de molho branco grosso",
   "Salsinha",
   "Ovos e farinha de rosca",
   "Óleo para fritar"
  ],
  "steps": [
   "Refogue a carne com cebola e alho, misture com a batata e o molho branco e deixe esfriar por 1 hora.",
   "Modele cilindros, passe no ovo e na farinha de rosca.",
   "Frite em óleo médio (170 °C) até dourar."
  ],
  "freezing": "Congele cru e já empanado, em bandeja forrada e sem encostar um no outro, por 2 horas; depois passe para saco próprio com a data. Dura até 90 dias. Frite ainda congelado em óleo médio (170 °C) por 8 a 10 minutos, sem descongelar.",
  "storage": "Fritos: melhor no mesmo dia, em recipiente aberto. Sobras: geladeira por até 2 dias e reaqueça no forno ou air fryer para recuperar a crocância.",
  "id": "croquete-de-carne",
  "yield": "30 unidades"
 },
 {
  "name": "Bolinho de arroz",
  "category": "Outros",
  "time": "50 min",
  "difficulty": "Fácil",
  "estimatedCost": 16,
  "suggestedPrice": 2.5,
  "ingredients": [
   "3 xícaras de arroz cozido",
   "3 ovos",
   "1/2 xícara de queijo ralado",
   "1/2 xícara de farinha de trigo",
   "1 cebola ralada",
   "Salsinha e sal",
   "Óleo para fritar"
  ],
  "steps": [
   "Misture o arroz, os ovos, o queijo, a cebola e o sal.",
   "Junte a farinha até dar ponto de modelar com colher.",
   "Frite colheradas em óleo médio até dourar."
  ],
  "freezing": "Congele depois de fritos e frios, por até 60 dias. Reaqueça no forno a 180 °C por 12 minutos.",
  "storage": "Fritos: melhor no mesmo dia, em recipiente aberto. Sobras: geladeira por até 2 dias e reaqueça no forno ou air fryer para recuperar a crocância.",
  "id": "bolinho-de-arroz",
  "yield": "30 unidades"
 },
 {
  "name": "Bolinho de mandioca com carne seca",
  "category": "Outros",
  "time": "1 h 30 min",
  "difficulty": "Médio",
  "estimatedCost": 48,
  "suggestedPrice": 5.0,
  "ingredients": [
   "800 g de mandioca cozida e espremida",
   "300 g de carne seca desfiada",
   "1 cebola",
   "2 dentes de alho",
   "1 colher (sopa) de manteiga",
   "Sal",
   "Farinha de trigo e ovo para empanar",
   "Óleo para fritar"
  ],
  "steps": [
   "Refogue a carne seca com cebola e alho.",
   "Misture a mandioca espremida com a manteiga e o sal. Abra uma porção, coloque o recheio e feche em formato de bolinha.",
   "Empane em farinha, ovo e novamente farinha e frite em óleo médio até dourar."
  ],
  "freezing": "Congele cru e já empanado, em bandeja forrada e sem encostar um no outro, por 2 horas; depois passe para saco próprio com a data. Dura até 90 dias. Frite ainda congelado em óleo médio (170 °C) por 8 a 10 minutos, sem descongelar.",
  "storage": "Fritos: melhor no mesmo dia, em recipiente aberto. Sobras: geladeira por até 2 dias e reaqueça no forno ou air fryer para recuperar a crocância.",
  "id": "bolinho-de-mandioca-com-carne-seca",
  "yield": "30 unidades"
 }
].map((r) => Object.assign({}, r, { photo: 'img/receitas/' + r.id + '.jpg' }, { art: SL.artForCategory ? SL.artForCategory(r.category) : 'mix' }));
})(typeof globalThis !== 'undefined' ? globalThis : window);
