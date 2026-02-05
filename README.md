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

## Backend Integration (n8n) — Contact Form

This project includes a minimal backend in `server/` that forwards contact form submissions to an n8n webhook. Use this when you want the frontend contact form to be processed by your n8n workflows (for example, to save to Google Sheets, send emails, or push to a CRM).

Steps to run locally:

1. Create a `.env` file at project root (or set environment variables). Example values are in `.env.example`.

2. Start the backend in dev mode:

```bash
cd server
npm install
npm run dev
```

3. Ensure `VITE_API_URL` is set in your frontend environment (for example, in `.env.local`) to point to the backend, e.g.:

```
VITE_API_URL=http://localhost:3001
```

4. Start the frontend as normal (`npm run dev` from repo root) and submit the contact form. The frontend will POST to `${VITE_API_URL}/api/contact`.

Docker (optional):

```
# Ensure .env has N8N_WEBHOOK_URL configured (see .env.example)
docker compose up --build
```

Notes:
- The backend will forward validated JSON to the `N8N_WEBHOOK_URL` environment variable (defaults to `http://localhost:5678`).
- If n8n runs on your host and the backend runs in Docker, set `N8N_WEBHOOK_URL=http://host.docker.internal:5678` so the container can reach host n8n.
- The backend performs schema validation (Zod) and a simple in-memory rate limiter (5 requests per 10 minutes per IP). Adjust in `server/src/contact.ts` as needed.

Integration test & curl examples

Quick curl test (replace values as needed):

```bash
curl -X POST http://localhost:3001/api/contact \
   -H "Content-Type: application/json" \
   -d '{"name":"Acme Corp","email":"hello@acme.test","company":"Acme","message":"Hello from curl"}'
```

Expected responses:
- `200 {"ok":true}` — forwarded to n8n successfully
- `400` — validation error (invalid or missing fields)
- `429` — rate limited
- `502` — n8n forwarding error

If you prefer a small Node-based smoke test, run this from the repo root (requires Node >=18):

```bash
# from repo root
node -e "(async()=>{const res=await fetch('http://localhost:3001/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'Test',email:'test@example.com',company:'Acme',message:'Hello'})});console.log(await res.text());})()"
```

Security & production notes

- Use a persistent datastore and proper rate limiting for production (the current in-memory limiter is temporary).
- Protect the backend with a secret or token before exposing `N8N_WEBHOOK_URL` in production; you can add a shared secret header that n8n checks.
- Consider adding CAPTCHA on the frontend or verifying an HMAC signature from the frontend for stronger spam protection.


## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot-reload |
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

**For lation.com.mx: Cloudflare Pages + Backend + n8n Tunnel**

- **Frontend:** Cloudflare Pages (auto-deploys from GitHub)
- **Backend:** Node.js/Express on same server (Docker)
- **n8n:** Exposed via Cloudflare Tunnel (local workflow automation, publicly accessible)
- **SSL/TLS:** Auto-issued by Cloudflare

📖 **[See DEPLOYMENT.md for Complete Setup Guide →](./DEPLOYMENT.md)**

This includes:
- 7-step deployment walkthrough
- Architecture diagram
- Environment variable configuration
- Cloudflare Tunnel setup for n8n
- GitHub Actions CI/CD template
- Troubleshooting and production checklist

**Other platforms:** Vercel, Netlify, GitHub Pages, AWS S3+CloudFront also supported

### Cloudflare Pages Deployment

Cloudflare Pages is a great option for deploying this project. Follow the steps below to set up and deploy:

#### 1. Create a New Project
- Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
- Navigate to **Pages** and click **Create a project**.
- Connect your Git repository and select the branch to deploy.

#### 2. Configure Build Settings
- **Build command**: `bun install --save-text-lockfile && npm run build`
- **Output directory**: `dist`

#### 3. Environment Variables (Optional)
If your project requires environment variables, add them in the **Environment Variables** section of the Cloudflare Pages settings.

#### 4. Deploy
- Save the settings and trigger a deployment.
- Cloudflare Pages will build and deploy your project automatically.

#### 5. Troubleshooting
- **Build command errors**: Ensure `bun` is installed and accessible in your environment.
- **Missing dependencies**: Verify that all dependencies are correctly listed in `package.json`.
- **Output directory issues**: Ensure the `dist` folder is generated during the build process.

For more details, refer to the [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/).

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

