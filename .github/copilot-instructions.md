# CardWise - AI Coding Agent Instructions

## Project Overview
CardWise is a Next.js 16 credit card rewards optimization app. Users add cards with merchant-specific offers, and the app helps maximize rewards by suggesting the best card for purchases. Built with Next.js App Router, TypeScript, Prisma (PostgreSQL), and Firebase Auth.

## Architecture

### Authentication Flow
- **Client-side**: Firebase Auth (`src/lib/firebase.ts`) with `AuthProvider` context (`src/lib/auth.tsx`)
- **Server-side**: Firebase Admin SDK (`src/lib/firebase-admin.ts`) verifies JWT tokens in API routes
- **Pattern**: All API routes expect `Authorization: Bearer <token>` header. Use `fetchWithAuth()` from `src/lib/useAuthToken.ts` for authenticated requests
- **Middleware**: `src/middleware.ts` protects `/cards`, `/search`, `/insights`, `/profile` routes using cookie-based auth

### Database Layer (Prisma)
- Schema: `prisma/schema.prisma` defines `User`, `Card`, `Merchant`, `CardOffer`, `Transaction` models
- **Key relationships**: 
  - `Card` belongs to `User`, has many `CardOffer`s
  - `CardOffer` links `Card` ↔ `Merchant` with offer metadata (percentage, conditions, validity)
- **Enums**: `CardNetwork` (VISA, MASTERCARD, AMEX, RUPAY, DINERS, DISCOVER), `CardType` (CREDIT, DEBIT)
- Access via singleton: `import { prisma } from "@/lib/prisma"`

### API Route Pattern
All routes in `src/app/api/` follow this structure:
```typescript
// 1. Extract and verify Firebase token
const token = request.headers.get("Authorization")?.split("Bearer ")[1];
const decodedToken = await adminAuth.verifyIdToken(token);
const userId = decodedToken.uid;

// 2. Validate input using src/lib/validation.ts
const validationErrors = validateCardData(data);
if (validationErrors.length > 0) {
  return NextResponse.json({ error: "Validation failed", errors }, { status: 400 });
}

// 3. Query Prisma with userId scoping
const card = await prisma.card.findFirst({ where: { id, userId } });
```

### Validation System
Two-layer validation in `src/lib/`:
- **`card-validation.ts`**: Card number Luhn validation, network detection (regex patterns), expiry checks
- **`validation.ts`**: Request data validation returning `ValidationError[]` array with `{field, message}` objects
- Always call `validateCardData()` before persisting card data

### Client-Side Data Fetching
- Use `fetchWithAuth()` helper (auto-adds Firebase JWT token)
- Example: `const res = await fetchWithAuth("/api/cards", { method: "POST", body: JSON.stringify(data) })`
- Components use `useAuth()` hook to access current user state

## Development Conventions

### TypeScript & Paths
- Path alias `@/` maps to `src/` (configured in `tsconfig.json`)
- All imports use absolute paths: `import { prisma } from "@/lib/prisma"`
- Strict mode enabled - handle null/undefined explicitly

### Component Structure
- Client components (forms, interactive UI) marked with `"use client"`
- Forms in `src/components/` use controlled state + inline validation
- UI built with Tailwind CSS v4 + Headless UI + Heroicons

### Error Handling
- API routes return structured errors: `{ error: string, errors?: ValidationError[] }`
- Status codes: 401 (unauthorized), 400 (validation), 404 (not found), 500 (server error)
- Client components store errors in state and display inline

## Key Commands
```bash
npm run dev        # Start dev server (localhost:3000)
npm run build      # Production build
npx prisma studio  # Browse database
npx prisma migrate dev --name <name>  # Create migration
```

## Environment Variables
Required vars (not in repo):
- `NEXT_PUBLIC_FIREBASE_*`: Client-side Firebase config (7 vars)
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`: Admin SDK credentials
- `DATABASE_URL`: PostgreSQL connection string

## Common Patterns

### Adding a new API endpoint
1. Create route in `src/app/api/[resource]/route.ts`
2. Verify token with `adminAuth.verifyIdToken()`
3. Validate input with `src/lib/validation.ts` function
4. Use Prisma with `userId` scoping to prevent unauthorized access
5. Return JSON with appropriate status codes

### Creating protected pages
1. Add path to `middleware.ts` protected paths
2. Use `"use client"` directive
3. Call `useAuth()` hook to access user
4. Use `fetchWithAuth()` for API calls

### Working with card offers
- Offers stored in `CardOffer` model with `Merchant` relation
- Use nested creates: `card.create({ data: { offers: { create: [...] } } })`
- Always include `merchant` in Prisma includes when fetching offers

## Testing Strategy

### Current State
- **No test framework currently configured** - project uses inline validation during development
- Validation logic split between client (`CardForm.tsx`) and server (`src/lib/validation.ts`)
- Manual testing via dev server and Prisma Studio for database inspection

### Recommended Testing Approach
When adding tests, consider:
- **Unit tests**: Test `src/lib/card-validation.ts` (Luhn algorithm, network detection) and `src/lib/validation.ts` (field validation)
- **Integration tests**: Test API routes with mocked Firebase Admin SDK (`adminAuth.verifyIdToken`)
- **E2E tests**: Test auth flows and card CRUD operations
- **Database testing**: Use separate test database or in-memory SQLite with Prisma

### Manual Testing Workflow
```bash
npm run dev                    # Start dev server
npx prisma studio              # Inspect database state
# Test Firebase auth in browser console:
# firebase.auth().currentUser.getIdToken()
```

## Deployment

### Vercel (Recommended)
CardWise is optimized for Vercel deployment (Next.js native platform):

1. **Database Setup**: Deploy PostgreSQL (e.g., Vercel Postgres, Supabase, Neon)
2. **Environment Variables**: Add all required env vars to Vercel project settings
3. **Build Configuration**: 
   - Build command: `npm run build` (auto-detected)
   - Prisma generates client automatically during build
4. **Post-deploy**: Run `npx prisma migrate deploy` via Vercel CLI or GitHub Actions

### Environment Variable Checklist
```bash
# Firebase Client (7 vars - all NEXT_PUBLIC_*)
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID

# Firebase Admin (3 vars - server-side only)
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY              # Escape newlines: "-----BEGIN PRIVATE KEY-----\n..."

# Database
DATABASE_URL                      # PostgreSQL connection string
```

### Database Migrations
- **Development**: `npx prisma migrate dev --name <description>`
- **Production**: `npx prisma migrate deploy` (applies pending migrations)
- **Schema changes**: Always create migrations, never use `prisma db push` in production

### Critical Deployment Notes
- Prisma client singleton (`src/lib/prisma.ts`) prevents connection pooling issues
- `FIREBASE_PRIVATE_KEY` must have escaped newlines (`\n`) in environment variables
- Next.js middleware runs on Edge Runtime - ensure Firebase Admin SDK compatibility
- All `NEXT_PUBLIC_*` vars are exposed to browser - keep secrets server-side only
