# Technical Specification - Fixing Workspace Typecheck Errors

## Difficulty Assessment
- **Difficulty**: easy (straightforward TypeScript compilation and typing fixes)

## Technical Context
- **Language**: TypeScript (using TS ~5.9.3)
- **Runtime Environment**: Node.js 24.x / 26.x
- **Package Manager**: pnpm (monorepo structure)
- **Workspaces Affected**: `.\artifacts\api-server`

## Implementation Approach

To resolve the 6 compilation/typecheck errors identified in `.\artifacts\api-server`, we will implement the following changes:

### 1. Object Storage Client (`.\artifacts\api-server\src\lib\objectStorage.ts`)
- **Issue**: Modern `fetch` types return `unknown` from `response.json()`, preventing direct destructuring of `signed_url`.
- **Solution**: Cast the JSON response object to `{ signed_url: string }` before destructuring.

### 2. Admin Router (`.\artifacts\api-server\src\routes\admin.ts`)
- **Issue 1**: In request handlers (`/messages`, `/messages/:id` for PATCH/DELETE), some paths end without returning a value, which violates the `noImplicitReturns` compile option.
- **Solution 1**: Explicitly return the response objects (e.g. `return res.status(...).json(...)` or `return res.json(...)` or `return res.status(204).send()`) across all control paths in the handlers.
- **Issue 2**: The URL parameter `id` from `req.params` is inferred as `string | string[]`, but functions like `updateMessage` and `deleteMessage` expect a strict `string`.
- **Solution 2**: Add a type guard check `if (typeof id !== "string") { return res.status(400).json({ error: "Invalid ID" }); }` to safely narrow the type to `string`.

## Source Code Structure Changes
No new files will be created or deleted. The following existing files will be modified:
- `.\artifacts\api-server\src\lib\objectStorage.ts`
- `.\artifacts\api-server\src\routes\admin.ts`

## Data Model / API / Interface Changes
- No API behavior changes or external interface signature modifications.
- Handlers will perform extra defensive runtime type check against non-string `id` parameters.

## Verification Approach
- Run the full workspace typechecking suite:
  ```bash
  npx pnpm run typecheck
  ```
- Run the workspace build process to ensure clean bundling:
  ```bash
  npx pnpm run build
  ```
