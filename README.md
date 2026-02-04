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

This project can be deployed to various platforms:

- **Vercel** - Recommended for Vite projects ([Deploy Guide](https://vercel.com/docs))
- **Netlify** - Easy deployment with continuous integration ([Deploy Guide](https://docs.netlify.com/))
- **GitHub Pages** - Free hosting for static sites
- **AWS S3 + CloudFront** - Scalable cloud hosting
- **Any static hosting service** that supports SPA routing

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

