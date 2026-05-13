# Watermark Remover - Subscription SaaS

A modern, subscription-based watermark removal service built with Next.js 14, Supabase, and Stripe. Remove watermarks from social media images with AI-powered processing.

## Features

- 🔐 **Authentication** - Secure user authentication with Supabase (email/password and OAuth)
- 💳 **Subscriptions** - Stripe-powered subscription management
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- ⚡ **Fast Processing** - Quick watermark removal (placeholder for AI integration)
- 🔒 **Secure** - Row-level security with Supabase
- 📊 **Dashboard** - User dashboard to track watermark removal jobs

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Stripe account

### 1. Clone and Install

```bash
cd SocialMediaWaterMarkRemover
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API to get your credentials
3. Run the SQL schema in `supabase/schema.sql` in the Supabase SQL Editor

### 3. Set Up Stripe

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Create products and prices in Stripe Dashboard:
   - Go to Products → Add Product
   - Create at least one subscription product with a recurring price
4. Set up webhook endpoint:
   - Go to Developers → Webhooks
   - Add endpoint: `https://your-domain.com/api/webhooks`
   - Select events: `product.*`, `price.*`, `customer.subscription.*`, `checkout.session.completed`
5. Copy the webhook signing secret

### 4. Configure Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Fill in your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── create-checkout-session/  # Stripe checkout
│   │   ├── create-portal-session/    # Stripe customer portal
│   │   └── webhooks/                 # Stripe webhooks
│   ├── auth/
│   │   └── callback/                 # OAuth callback
│   ├── account/                      # Account settings page
│   ├── dashboard/                    # User dashboard
│   ├── pricing/                      # Pricing page
│   ├── signin/                       # Sign in page
│   ├── signup/                       # Sign up page
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Home page
├── components/                       # Reusable components (future)
├── supabase/
│   └── schema.sql                    # Database schema
├── types/
│   ├── stripe.ts                     # Stripe type definitions
│   └── supabase.ts                   # Supabase type definitions
├── utils/
│   ├── stripe/                       # Stripe utilities
│   └── supabase/                     # Supabase clients
└── package.json
```

## Key Features Implementation

### Authentication

- Email/password authentication
- Google OAuth (configurable in Supabase)
- Protected routes with middleware
- Automatic user profile creation

### Subscription Management

- Multiple pricing tiers
- Stripe Checkout integration
- Customer portal for subscription management
- Automatic subscription syncing via webhooks

### Watermark Removal

The watermark removal feature is currently a placeholder. To implement actual watermark removal:

1. Add an image upload component in the dashboard
2. Integrate with an AI service (e.g., Replicate, HuggingFace, or custom ML model)
3. Store original and processed images in Supabase Storage
4. Update job status in the `watermark_jobs` table

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel project settings
4. Deploy

### Post-Deployment

1. Update Stripe webhook endpoint to your production URL
2. Update `NEXT_PUBLIC_SITE_URL` in environment variables
3. Configure authentication redirect URLs in Supabase

## Stripe Webhook Testing

For local development, use Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/webhooks
```

## Database Management

### Viewing Data

Use Supabase Table Editor or connect with any PostgreSQL client:

- Host: `db.your-project.supabase.co`
- Database: `postgres`
- Port: `5432`

### Migrations

For production, use Supabase migrations:

```bash
supabase db diff -f migration_name
supabase db push
```

## Security Considerations

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Service role key only used server-side
- ✅ Webhook signature verification
- ✅ Environment variables for secrets
- ⚠️ Add rate limiting for production
- ⚠️ Implement file upload validation
- ⚠️ Add CORS configuration for API routes

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues or questions:
- Open an issue on GitHub
- Check Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
- Check Stripe documentation: [stripe.com/docs](https://stripe.com/docs)

## Next Steps

- [ ] Implement actual watermark removal AI
- [ ] Add Supabase Storage for images
- [ ] Add usage limits per subscription tier
- [ ] Add email notifications
- [ ] Add analytics dashboard
- [ ] Add admin panel
- [ ] Implement batch processing
- [ ] Add API rate limiting
- [ ] Add tests

## Acknowledgments

Based on the [Vercel Subscription Starter](https://vercel.com/templates/ecommerce/subscription-starter) template, adapted for watermark removal use case.
