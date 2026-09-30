# P.R.I.N.C. / LIMBO — Phaser 3 + TypeScript intro

Это отдельная реализация `intro.html` на Phaser 3 + TypeScript + Vite.

## Структура

- `intro.html` — точка входа игровой сцены; не меняет `index.html` или `terminal.html`.
- `src/main.ts` — создание Phaser Game.
- `src/scenes/IntroScene.ts` — карта, игрок-кот, вирус, фрагменты данных, firewall, UI, управление и переход в `terminal.html`.
- `package.json` — зависимости.

## Запуск

```bash
npm install
npm run dev
```

После запуска открой адрес Vite, обычно `http://localhost:5173/intro.html`.

## Сборка

```bash
npm run build
```

Для интеграции в существующий LIMBO-проект оставь существующие `index.html` и `terminal.html`, а игровой вход используй как `intro.html`.
