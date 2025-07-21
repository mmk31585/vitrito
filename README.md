# Vitrito

Vitrito is a modern electronic showcase builder for all types of professionals and small business owners.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Next.js** (App Router)
- **Tailwind CSS**
- **shadcn/ui**
- **Supabase**
- **Resend**
- **next-intl**
- **Cypress**

## Features

- Authentication (sign up, login, sign out)
- User profile page
- Dashboard for profile editing
- Showcase items
- Contact form
- Dark/light theme support
- Real-time messaging
- Digital products
- Push notifications
- SEO optimization
- Admin dashboard

## Supabase

You will need to create a Supabase project and set up the following tables:

- `profiles`
- `showcase_items`
- `showcase_item_images`
- `messages`
- `analytics`
- `push_subscriptions`

You will also need to create a `.env.local` file with the following environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
```

## Resend

You will need to create a Resend account and add your API key to the `send-email` edge function.

## VAPID Keys

You will need to generate VAPID keys and add your public key to the dashboard page.
