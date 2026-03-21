# Lation Interviews Platform

A modern, full-featured interview scheduling and management platform built for technical recruiting. Lation enables companies to schedule, conduct, and evaluate technical interviews with ease, featuring AI-powered evaluations and comprehensive reporting.

## 🌟 Features

### For Interviewers
- **Comprehensive Dashboard**: Manage all your interviews from a centralized dashboard
- **Interview Scheduling**: Easy-to-use scheduling interface with calendar integration
- **Candidate Evaluation**: Structured evaluation forms with customizable criteria
- **Performance Tracking**: Track your interview history and statistics
- **Real-time Updates**: Get instant notifications for new interviews and updates

### For Companies
- **Candidate Management**: Track candidates through the entire interview process
- **Team Collaboration**: Coordinate with multiple interviewers
- **Detailed Reports**: AI-powered evaluation reports with insights
- **Credit System**: Flexible credit-based pricing model
- **Analytics**: Comprehensive hiring analytics and metrics

### General Features
- **Responsive Design**: Beautiful UI that works on desktop, tablet, and mobile
- **Dark Mode**: Built-in theme switching for comfortable viewing
- **Secure Authentication**: Robust login and registration system
- **Real-time Data**: Powered by React Query for optimal data synchronization
- **Accessible**: WCAG-compliant components for inclusive user experience

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lation-interviews-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## Contact Form — Local Setup

Lead storage is selected server-side with `LEADS_TARGET_TABLE`:
- `leads` for production/default
- `leads_demo` for demo environments
- `leads_dev` for the `DEV` branch and its preview environments

Steps to run locally:

1. Create a `.env` file at project root (or set environment variables). Example values are in `.env.example`.

2. Set required frontend and server variables:

```
VITE_TURNSTILE_SITE_KEY=0x4AAAAAAAxxxxxxxxxxxxxx
CF_TURNSTILE_SECRET=0x4AAAAAAAxxxxxxxxxxxxxx-secret
CF_TURNSTILE_EXPECTED_ACTION=contact_form
CF_TURNSTILE_ALLOWED_HOSTNAMES=localhost,127.0.0.1,lation.com.mx,www.lation.com.mx
CF_TURNSTILE_VERIFY_TIMEOUT_MS=5000
SUPABASE_URL=https://ymsjdxihduwlywcuwrld.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
LEADS_TARGET_TABLE=leads_dev
UPSTASH_REDIS_REST_URL=https://your-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-rest-token
ALLOWED_ORIGINS=http://localhost:5173
INTERNAL_CRAWL_API_KEY=change-me
CF_BROWSER_RENDERING_ACCOUNT_ID=your-cloudflare-account-id
CF_BROWSER_RENDERING_API_TOKEN=your-cloudflare-browser-rendering-api-token
```

3. Start the frontend as normal (`npm run dev` from repo root) and submit the contact form. If Turnstile config is missing, the app keeps rendering and disables only contact submission.

### DEV Branch Setup

For the `DEV` branch and Vercel Preview deployments:

```bash
VITE_SUPABASE_URL=https://ymsjdxihduwlywcuwrld.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_xxx
VITE_TURNSTILE_SITE_KEY=0x4AAAAAAAxxxxxxxxxxxxxx
SUPABASE_URL=https://ymsjdxihduwlywcuwrld.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
LEADS_TARGET_TABLE=leads_dev
CF_TURNSTILE_SECRET=0x4AAAAAAAxxxxxxxxxxxxxx-secret
CF_TURNSTILE_EXPECTED_ACTION=contact_form
CF_TURNSTILE_ALLOWED_HOSTNAMES=localhost,127.0.0.1,<your-dev-preview-host>
CF_TURNSTILE_VERIFY_TIMEOUT_MS=5000
UPSTASH_REDIS_REST_URL=https://your-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-rest-token
```

Notes:
- `https://ymsjdxihduwlywcuwrld.supabase.co/leads_dev` is not an API key and not a direct table endpoint for this app.
- The correct split is `SUPABASE_URL=https://ymsjdxihduwlywcuwrld.supabase.co` plus `LEADS_TARGET_TABLE=leads_dev`.
- Hosted builds now fail if `VITE_TURNSTILE_SITE_KEY` is missing. When `VITE_API_URL` is unset and `/api/lead` is active, hosted builds also require the server-side lead env vars.

### Vercel Resend Notifications (Optional)

When deployed on Vercel, `/api/lead` can send a notification email after a lead is saved.

Required Vercel environment variables:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=Lation Leads <leads@lation.com.mx>
RESEND_NOTIFICATION_TO=ops@lation.com.mx,founder@lation.com.mx
```

Behavior:
- Lead save to Supabase is the source of truth for success.
- Email notification is non-blocking (if it fails, user still sees success and only operational metadata is logged).
- Subject prefixes are environment-aware: `[DEV]` for `leads_dev`, `[DEMO]` for `leads_demo`, and no prefix for `leads`.
- `/api/send-notification` is retired and now returns `410`.

### Internal Crawl API (Ops)

Start a crawl job:

```bash
curl -X POST https://your-domain.com/api/crawl \
  -H "Content-Type: application/json" \
  -H "x-internal-api-key: $INTERNAL_CRAWL_API_KEY" \
  -d '{
    "url":"https://blog.cloudflare.com/",
    "limit":25,
    "maxDepth":2,
    "outputFormat":"markdown"
  }'
```

Expected response: `202` with `jobId` and `pollUrl`.

Poll a crawl job:

```bash
curl "https://your-domain.com/api/crawl?jobId=<job-id>" \
  -H "x-internal-api-key: $INTERNAL_CRAWL_API_KEY"
```

Expected response: `200` with normalized status and records summary.

Security & production notes

- Keep `SUPABASE_SERVICE_ROLE_KEY`, `CF_TURNSTILE_SECRET`, `UPSTASH_REDIS_REST_TOKEN`, `RESEND_API_KEY`, `INTERNAL_CRAWL_API_KEY`, and `CF_BROWSER_RENDERING_API_TOKEN` server-side only.
- Rotate sensitive secrets every 90 days.
- Apply the migrations in `supabase/migrations/20260309120000_harden_leads_rls.sql` and `supabase/migrations/20260313213000_align_leads_tables_rls.sql` to enforce RLS and column constraints for `public.leads`, `public.leads_demo`, and `public.leads_dev`.


## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot-reload |
| `npm run validate:contact-env` | Validate hosted contact-form env requirements |
| `npm run build` | Build production bundle |
| `npm run build:dev` | Build development bundle |
| `npm run lint` | Run ESLint to check code quality |
| `npm run preview` | Preview production build locally |

## 🛠️ Technology Stack

### Core Framework
- **React 18** - Modern UI library with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Next-generation frontend build tool for fast development

### UI/Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components built with Radix UI
- **Radix UI** - Unstyled, accessible component primitives
- **Framer Motion** - Production-ready animation library
- **Lucide React** - Beautiful, consistent icon set

### State & Data Management
- **React Router** - Client-side routing
- **React Query (TanStack Query)** - Powerful asynchronous state management
- **React Hook Form** - Performant form validation and handling
- **Zod** - TypeScript-first schema validation

### Additional Libraries
- **date-fns** - Modern date utility library
- **recharts** - Composable charting library for React
- **Sonner** - Elegant toast notifications
- **next-themes** - Perfect dark mode support

### Internationalization
- **react-i18next** - React integration for i18next
- **i18next** - Internationalization framework
- **i18next-browser-languagedetector** - Automatic language detection

## 🌍 Internationalization (i18n)

The application supports multiple languages with automatic detection and persistence:

### Supported Languages
- 🇺🇸 **English** (default)
- 🇪🇸 **Español** (Spanish)
- 🇧🇷 **Português** (Portuguese)

### Language Switcher
A language toggle appears in the top-right corner of the application, featuring:
- Flag emoji + language code display
- Dropdown menu with all available languages
- Active language indicator
- Persistent language preference (localStorage)

### For Developers

#### Using Translations
```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('dashboard.title')}</h1>;
}
```

#### Adding New Languages
1. Create translation file: `src/i18n/locales/[code]/common.json`
2. Add language to config: `src/i18n/config.ts`
3. Update LanguageToggle component with flag emoji

#### Translation Files Location
```
src/i18n/
├── config.ts
└── locales/
    ├── en/common.json
    ├── es/common.json
    └── pt/common.json
```


## 📁 Project Structure

```
lation-interviews-main/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components and routes
│   │   ├── Dashboard.tsx
│   │   ├── InterviewerDashboard.tsx
│   │   ├── ScheduleInterview.tsx
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities and helpers
│   ├── assets/          # Static assets
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── public/              # Public static files
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
└── tailwind.config.ts   # Tailwind configuration
```

## 🎨 Key Pages

- **`/`** - Landing page
- **`/login`** - User authentication
- **`/register`** - New user registration
- **`/dashboard`** - Main user dashboard
- **`/interviewer-dashboard`** - Interviewer-specific dashboard
- **`/schedule`** - Interview scheduling interface
- **`/credits`** - Credit management and pricing

## 🔧 Configuration

### Tailwind CSS

The project uses a custom Tailwind configuration with:
- Custom color schemes for light and dark modes
- Extended spacing and sizing utilities
- Custom animations and keyframes
- Typography plugin for rich text content

### ESLint

Code quality is maintained through ESLint with:
- React Hooks plugin for hooks validation
- React Refresh plugin for fast refresh support
- TypeScript ESLint for type-aware linting

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Deployment Options

**Frontend:** Vercel or Cloudflare Pages (auto-deploys from GitHub)

**Other platforms:** Netlify, GitHub Pages, AWS S3+CloudFront also supported

### Cloudflare Pages Deployment

Cloudflare Pages is a great option for deploying this project. Follow the steps below to set up and deploy:

#### 1. Create a New Project
- Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
- Navigate to **Pages** and click **Create a project**.
- Connect your Git repository and select the branch to deploy.

#### 2. Configure Build Settings
- **Build command**: `bun install --save-text-lockfile && npm run build`
- **Output directory**: `dist`

#### 3. Environment Variables (Required for Contact Form)
Add these in Cloudflare Pages **Environment Variables** for both Preview and Production:

```bash
VITE_SUPABASE_URL=https://ymsjdxihduwlywcuwrld.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-or-publishable-key
VITE_TURNSTILE_SITE_KEY=0x4AAAAAAAxxxxxxxxxxxxxx
```

If you deploy through GitHub Actions, add the same keys to repository secrets as well.

#### 4. Deploy
- Save the settings and trigger a deployment.
- Cloudflare Pages will build and deploy your project automatically.

#### 5. Troubleshooting
- **Build command errors**: Ensure `bun` is installed and accessible in your environment.
- **Missing dependencies**: Verify that all dependencies are correctly listed in `package.json`.
- **Output directory issues**: Ensure the `dist` folder is generated during the build process.

For more details, refer to the [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/).

### Contact Form Quick Check (All Platforms)

If Contact appears as `Temporarily Unavailable`:

1. Ensure `VITE_TURNSTILE_SITE_KEY` is set in the active deploy platform (Vercel/Cloudflare).
2. Ensure the same key is set in GitHub Actions secrets when using workflow-based deploys.
3. Redeploy after changing variables.
4. Recheck the live page: submit button should return to `Send Message`.
5. Optional: enable technical hint in non-production by setting `VITE_SHOW_CONTACT_CONFIG_HINT=true`.
6. For Vercel lead ingestion, verify server-side secrets are set: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `LEADS_TARGET_TABLE`, `CF_TURNSTILE_SECRET`, `CF_TURNSTILE_EXPECTED_ACTION`, `CF_TURNSTILE_ALLOWED_HOSTNAMES`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.
7. For Vercel email notifications, verify `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `RESEND_NOTIFICATION_TO` are set, then redeploy.
8. For internal crawl jobs, verify `INTERNAL_CRAWL_API_KEY`, `CF_BROWSER_RENDERING_ACCOUNT_ID`, and `CF_BROWSER_RENDERING_API_TOKEN` are set.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on:
- Development setup
- Code style and conventions
- Pull request process
- Commit message format

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill the process using port 5173
lsof -ti:5173 | xargs kill -9
```

**Dependencies not installing**
```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**Build errors**
```bash
# Clean build and try again
rm -rf dist
npm run build
```

## 📞 Support

For questions, bug reports, or feature requests, please open an issue on GitHub.

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
