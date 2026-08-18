# Pedidos — LootFlow

## Em aberto

_(nenhum)_

## Entregues

- **18/08/2026 — Corrigir 21 vulnerabilidades apontadas pelo scanner de pacotes (SCA).**
  Ele colou a tela do scanner: 1 crítico, 9 altos, 8 médios, 3 baixos, todos
  "Vulnerabilidades em Pacotes (SCA)" no repositório LootFlow. Pacotes citados:
  `websocket-driver` (crítico + médio), `undici` (11 achados), `@grpc/grpc-js` (2),
  `protobufjs` (3), `xlsx`/SheetJS (Prototype Pollution + ReDoS).
  → Entregue em v2.0.2 (firebase 12.17, xlsx 0.20.3, vite 8; `npm audit` = 0).
