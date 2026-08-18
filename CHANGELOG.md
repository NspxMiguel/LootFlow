# Changelog

## 2.0.2

### Security

- Dependencias atualizadas para fechar 21 CVEs apontados por analise SCA:
  `firebase` 10.14 -> 12.17 (remove `undici`, sobe `@grpc/grpc-js`,
  `protobufjs` e `websocket-driver`) e `xlsx` 0.18.5 -> 0.20.3 (build oficial
  do SheetJS; corrige Prototype Pollution e ReDoS).
- `npm audit` zerado: `vite` 5 -> 8, `@vitejs/plugin-react` 5,
  `vite-plugin-electron` 1.x e correcoes transitivas de dev (`tar`,
  `brace-expansion`, `electron-builder`, `postcss`, `nanoid`, `js-yaml`).

### Technical

- `vite.config.ts`: `manualChunks` em forma de funcao (exigido pelo Rolldown)
  e `import.meta.dirname` no lugar de `__dirname`.

## 2.0.0

### Added

- Perfect Weeks
- XP
- Levels
- Titles
- Friends
- Rankings
- Profiles
- Collection System
- Case Opening Tracker
- Lite Mode
- Achievements
- Goal Forecasting

### Improved

- Dashboard
- Analytics
- UX
- Mobile
- Privacy

### Technical

- Firestore/storage improvements
- Caching improvements
- Type safety
