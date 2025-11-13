# CardWise 💳

A modern credit card rewards optimization app that helps you maximize cashback and rewards by tracking merchant-specific offers and suggesting the best card to use for each purchase.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)
![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748)

## ✨ Features

- 💳 **Card Management**: Add and manage multiple credit/debit cards with network detection
- 🏪 **Merchant Offers**: Track category-specific rewards and cashback percentages
- 🎴 **3D Card View**: Interactive flip cards showing details and offers
- 🔐 **Secure Authentication**: Firebase Authentication with JWT-based API security
- 📊 **Smart Recommendations**: Get suggestions on which card to use for maximum rewards (coming soon)
- 🎨 **Modern UI**: Beautiful gradient design with glassmorphic effects
- 📱 **Responsive**: Works seamlessly on desktop and mobile devices

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, React Server Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [Firebase Auth](https://firebase.google.com/products/auth) + Firebase Admin SDK
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: Custom components with Heroicons
- **Logging**: [Pino](https://getpino.io/) for structured logging

## 📋 Prerequisites

- **Node.js** 18+ 
- **PostgreSQL** database (local or cloud)
- **Firebase** project for authentication

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/vaidyasen/cardWise.git
cd cardWise
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable **Email/Password** authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password provider

#### Get Firebase Client Config:
- Go to Project Settings > General
- Scroll to "Your apps" > Web app
- Copy the config values

#### Get Firebase Admin SDK Credentials:
- Go to Project Settings > Service Accounts
- Click "Generate new private key"
- Download the JSON file

### 4. Set Up PostgreSQL Database

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL (macOS)
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb cardwise
```

**Option B: Cloud Database** (Recommended for quick setup)
- [Neon](https://neon.tech) - Free tier, instant setup
- [Supabase](https://supabase.com) - Free tier with UI
- [Vercel Postgres](https://vercel.com/storage/postgres) - Integrates with Vercel

### 5. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Firebase Client Config (public)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Firebase Admin SDK (server-side only)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"

# Database Connection
DATABASE_URL="postgresql://username:password@localhost:5432/cardwise?schema=public"
```

⚠️ **Important**: When adding `FIREBASE_PRIVATE_KEY`, ensure newlines are escaped as `\n`

### 6. Set Up the Database

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### 7. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 📁 Project Structure

```
cardWise/
├── prisma/
│   ├── schema.prisma              # Database schema & models
│   └── migrations/                # Database migration history
├── src/
│   ├── app/
│   │   ├── api/                   # API routes (server-side)
│   │   │   ├── cards/             # Card CRUD endpoints
│   │   │   └── users/             # User management
│   │   ├── cards/                 # Card management page
│   │   ├── signin/                # Sign in page
│   │   ├── signup/                # Sign up page
│   │   ├── globals.css            # Global styles & animations
│   │   ├── layout.tsx             # Root layout with providers
│   │   └── page.tsx               # Landing page
│   ├── components/
│   │   ├── CardDetails.tsx        # 3D flip card component
│   │   ├── CardForm.tsx           # Add/edit card form
│   │   ├── Header.tsx             # Navigation header
│   │   └── ClientLayout.tsx       # Client-side layout wrapper
│   ├── lib/
│   │   ├── auth.tsx               # Auth context & hooks
│   │   ├── firebase.ts            # Firebase client config
│   │   ├── firebase-admin.ts      # Firebase Admin SDK
│   │   ├── prisma.ts              # Prisma client singleton
│   │   ├── logger.ts              # Pino logger instance
│   │   ├── validation.ts          # Server-side validation
│   │   ├── card-validation.ts     # Card number validation & Luhn
│   │   └── useAuthToken.ts        # Auth token helper
│   └── middleware.ts              # Route protection middleware
├── .github/
│   └── copilot-instructions.md    # AI coding agent guidelines
└── package.json
```

## 🎨 UI/UX Features

- **Gradient Theme**: Purple-to-pink gradients throughout
- **Glassmorphism**: Frosted glass effects with backdrop blur
- **3D Card Flips**: Interactive card animations showing front/back
- **Network Colors**: Card-specific gradients (Visa blue, Mastercard orange, etc.)
- **Responsive Design**: Mobile-first approach
- **Loading States**: Smooth spinners and transitions
- **Empty States**: Helpful prompts when no data exists

## 🔐 Authentication Flow

1. **Client**: Firebase Auth SDK handles sign in/sign up
2. **Token Generation**: Firebase creates JWT token
3. **Cookie Storage**: Token stored in secure cookie
4. **API Verification**: Firebase Admin SDK verifies tokens
5. **Database Sync**: User automatically created/synced to PostgreSQL
6. **Middleware Protection**: Routes protected by auth middleware

### Using Authenticated API Calls

```typescript
import { fetchWithAuth } from "@/lib/useAuthToken";

// Automatically includes Bearer token
const response = await fetchWithAuth("/api/cards", {
  method: "POST",
  body: JSON.stringify(cardData),
});
```

## 🌐 API Routes

All routes require `Authorization: Bearer <token>` header:

### Cards
- `POST /api/cards` - Create new card
- `GET /api/cards` - List user's cards
- `GET /api/cards/[id]` - Get card details
- `PUT /api/cards/[id]` - Update card
- `DELETE /api/cards/[id]` - Delete card

### Users
- `POST /api/users` - Create/sync user in database

All routes auto-scope data to authenticated user for security.

## 📊 Database Models

### Core Models

**User**
- Linked to Firebase Auth UID
- Stores email and metadata

**Card**
- Card details (name, bank, last 4 digits)
- Network type (Visa, Mastercard, etc.)
- Card type (Credit/Debit)
- Expiry date
- Linked offers

**Merchant**
- Merchant name and category
- Shared across users (reused)

**CardOffer**
- Links Card ↔ Merchant
- Cashback percentage
- Offer conditions
- Validity period
- Offer type (Cashback, Points, Miles, Discount)

**Transaction** (Future)
- Purchase history
- Actual cashback earned

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint

# Database
npx prisma studio                    # Open database GUI
npx prisma migrate dev --name <name> # Create new migration
npx prisma migrate deploy            # Apply migrations (production)
npx prisma generate                  # Regenerate Prisma client
npx prisma db push                   # Sync schema without migrations

# Logging (development)
npm run dev | npx pino-pretty        # Pretty-print logs
```

## 🚢 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Vercel auto-detects Next.js

3. **Add Environment Variables**
   - Add all vars from `.env.local` to Vercel project settings
   - Ensure `FIREBASE_PRIVATE_KEY` has proper escaped newlines

4. **Deploy Database Migrations**
   ```bash
   npx prisma migrate deploy
   ```

5. **Auto-Deploy**: Every push to `main` triggers deployment

### Environment Variables Checklist

- [ ] All `NEXT_PUBLIC_FIREBASE_*` variables (7 vars)
- [ ] `FIREBASE_PROJECT_ID`
- [ ] `FIREBASE_CLIENT_EMAIL`
- [ ] `FIREBASE_PRIVATE_KEY` (with escaped `\n`)
- [ ] `DATABASE_URL` (PostgreSQL connection string)

## 🧪 Testing

### Manual Testing Flow

1. **Sign Up**: Create account at `/signup`
2. **Add Card**: Navigate to `/cards` and add a card with offers
3. **View Card**: Click card to flip and see offers
4. **Edit Card**: Update card details and offers
5. **Delete Card**: Remove cards you no longer need

### Database Inspection

```bash
npx prisma studio
```

Opens GUI at `http://localhost:5555` to view/edit data.

## 🐛 Troubleshooting

### "User not found" error when creating cards
- **Solution**: Sign out and sign back in to sync user to database

### Firebase Admin SDK errors
- **Check**: `FIREBASE_PRIVATE_KEY` has proper newlines (`\n`)
- **Format**: Should be in quotes with escaped newlines

### Database connection issues
- **Verify**: PostgreSQL is running (`brew services list`)
- **Check**: `DATABASE_URL` format is correct
- **Test**: Run `npx prisma db pull` to verify connection

### Build errors
- **Run**: `npx prisma generate` to regenerate client
- **Clear**: Delete `.next` folder and rebuild

## 🎯 Roadmap

- [ ] Search page for finding best card by merchant
- [ ] Transaction tracking
- [ ] Analytics dashboard
- [ ] Recurring offer management (monthly/weekly deals)
- [ ] Multi-currency support
- [ ] Card sharing with family members
- [ ] Mobile app (React Native)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Style

- Follow existing TypeScript patterns
- Use ESLint for linting
- Write meaningful commit messages
- Update README for new features

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Firebase for authentication
- Vercel for hosting
- Prisma for database ORM
- Next.js team for amazing framework

## 📞 Support

For issues or questions:
- Open an [issue on GitHub](https://github.com/vaidyasen/cardWise/issues)
- Contact: [Your Email]

---

Built with ❤️ using Next.js and TypeScript
