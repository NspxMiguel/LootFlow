# Pedidos — LootFlow

## Em aberto

- **Restringir a chave de navegador do Firebase a `nspx.dev`.** Achado em
  20/08/2026 varrendo os repositórios públicos. A chave web do Firebase é
  pública por definição — ela viaja dentro do pacote servido em
  `www.nspx.dev/LootFlow/app/`, e isso está certo. O que não está: ela não tem
  restrição de origem nenhuma. Lido direto da API de chaves do Google:
  `browserKeyRestrictions: {}`, vazio. Na prática ela funciona de qualquer site,
  de qualquer script, de qualquer lugar.

  O caminho: console do Google Cloud → APIs e serviços → Credenciais → "Browser
  key (auto created by Firebase)" → Restrições de aplicativo → Sites → incluir
  `https://www.nspx.dev/*`, `https://nspx.dev/*`,
  `https://nspxmiguel.github.io/*`, `https://lootflow-92afd.firebaseapp.com/*` e
  `http://localhost:*` para o desenvolvimento. A lista de APIs permitidas já
  está restrita e não precisa mexer.

  Não fiz sozinho: é ajuste de conta dele no Google Cloud, e uma lista de
  origens escrita errado derruba o login do app inteiro enquanto ele está fora.

- **Desligar o login anônimo.** Ele está ligado no projeto
  (`signIn.anonymous.enabled: true`) e o LootFlow não usa: `signInAnonymously`
  não aparece nem no código-fonte nem nos 22 arquivos do pacote publicado.
  Somado à chave sem restrição, qualquer pessoa cria contas no projeto dele à
  vontade — provei sem querer ao sondar a chave, criei três e apaguei as três
  (a conta voltou aos 4 usuários de verdade).

  O caminho: console do Firebase → Authentication → Sign-in method → Anônimo →
  desativar. Também é ajuste de conta, então fica com ele.

## Entregues

- **20/08/2026 — O `firestore.rules` do repositório estava atrás do que está no
  ar, na regra mais perigosa do projeto.** O arquivo versionado ainda trazia
  `allow read: if true` em `device_codes`, enquanto o projeto no ar já usava
  `allow get: if true; allow list: if false`. Como `read` cobre `list`, a versão
  do repositório deixa qualquer pessoa sem login fazer
  `getDocs(collection('device_codes'))` e receber a coleção inteira — inclusive
  os documentos já autenticados, que carregam o `idToken` e o `accessToken` do
  Google de quem estava pareando o aplicativo de computador. Isso é sessão da
  conta Google na mão de quem listou.

  Não era exploração ativa: em produção a regra correta está publicada desde
  31/07/2026. O perigo era o próximo `firebase deploy --only firestore:rules`
  feito a partir do repositório, que reabriria o buraco sem ninguém notar.

  → O arquivo foi alinhado com o que está no ar (e o comentário do bloco, que
  ainda dizia "Anyone can read", passou a descrever a regra de verdade).
  Conferido em produção depois de publicar: `get` pelo nome exato responde 200,
  que é o que o Electron precisa para ouvir o próprio código, e `list` da
  coleção responde 403.

- **18/08/2026 — Corrigir 21 vulnerabilidades apontadas pelo scanner de pacotes (SCA).**
  Ele colou a tela do scanner: 1 crítico, 9 altos, 8 médios, 3 baixos, todos
  "Vulnerabilidades em Pacotes (SCA)" no repositório LootFlow. Pacotes citados:
  `websocket-driver` (crítico + médio), `undici` (11 achados), `@grpc/grpc-js` (2),
  `protobufjs` (3), `xlsx`/SheetJS (Prototype Pollution + ReDoS).
  → Entregue em v2.0.2 (firebase 12.17, xlsx 0.20.3, vite 8; `npm audit` = 0).
