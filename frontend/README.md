# frontend

The Angular app shell of the team todo demo, themed from the tokens in `../context/DESIGN.md`.

```
npm start           # http://localhost:4200, proxies /api and /actuator to the backend on 8080
npm run test:ci     # Vitest with coverage
npm run lint        # ESLint (angular-eslint)
npm run format      # Prettier
npm run build       # production build into dist/frontend
```

Single specs for the factory's TDD rounds run through `../scripts/lore-vitest-run.sh`, as
declared in `../.lore/test-commands.yml`.
