# MedSync Frontend

Medical clinic admin system. React 19 + TypeScript 6 + Vite 8. Currently mock-only (no backend); services delegate to per-feature mock data.

## Commands

- `npm run dev` — start dev server
- `npm run build` — `tsc -b && vite build` (typecheck then build; `tsc -b` uses project-references mode)
- `npm run lint` — `eslint .`
- Prettier is installed but has no npm script; run `npx prettier --write .` if needed

## Verification order

`npm run lint` then `npm run build` (build includes typecheck). There are no tests yet — vitest is a dev dependency but no vitest config or test files exist.

## TypeScript constraints

- `verbatimModuleSyntax: true` — **always use `import type` for type-only imports**; the build will fail otherwise.
- `erasableSyntaxOnly: true` — no `enum` declarations (use `const` objects or union types instead).
- `noUnusedLocals` and `noUnusedParameters` are enabled.

## Path alias

`@/*` maps to `./src/*`. Requires both `tsconfig.app.json` paths and the `vite-tsconfig-paths` plugin (already configured).

## Architecture

```
src/
  features/          # domain modules: auth, appointments, dashboard, doctors,
                     # medical-records, patients, users
    <feature>/
      pages/         # route-level page components
      components/    # feature-specific components
      mock.ts        # mock data for this feature
      schemas.ts     # Zod validation schemas
      types.ts       # feature domain types
  components/        # shared UI: common/, crud/, layout/
  services/          # thin API layer (currently calls mocks, will call REST later)
  store/             # React Context auth state (AuthContext + AuthProvider)
  hooks/             # shared hooks (useAuth)
  lib/               # utilities: cn.ts, cpf.ts, date.ts, formatters.ts
  types/             # shared types: role.ts (UserRole, permissions, canAccess)
  routes.tsx         # all route definitions (ProtectedRoute, PublicRoute, AppRoutes)
```

## Styling

Tailwind CSS 4 via `@tailwindcss/vite` plugin, but most existing components use **plain CSS with custom properties** defined in `src/index.css`. Follow whatever pattern the file you are editing uses.

## Conventions

- Feature-based folder structure — keep feature logic inside `src/features/<name>/`.
- Mock data lives in each feature's `mock.ts`; services consume mocks via `src/services/`.
- Three user roles: `admin`, `doctor`, `receptionist`. Permissions map is in `src/types/role.ts`.
- Use Zod schemas for form validation (react-hook-form + zod).
- No `any` — use `unknown` with narrowing if type is uncertain.
- Component props must always be explicitly typed (no `any`).
- Use `import type` for type-only imports.
- Use function components with named exports (not default exports for most files).
