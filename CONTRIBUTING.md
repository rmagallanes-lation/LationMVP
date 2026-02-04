# Contributing to Lation Interviews

Thank you for your interest in contributing to Lation! This document provides guidelines and instructions for contributing to this project.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager
- Git

### Development Setup

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

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Run linting**
   ```bash
   npm run lint
   ```

## Development Workflow

### Branch Naming Convention

- `feature/` - New features (e.g., `feature/add-video-interviews`)
- `fix/` - Bug fixes (e.g., `fix/login-validation`)
- `refactor/` - Code refactoring (e.g., `refactor/dashboard-components`)
- `docs/` - Documentation updates (e.g., `docs/update-readme`)

### Commit Message Convention

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Example:**
```
feat(dashboard): add interview scheduling calendar

- Implemented calendar view for interview scheduling
- Added date picker with time slot selection
- Integrated with existing scheduling API

Closes #123
```

## Code Style

### TypeScript/React

- Use TypeScript for all new code
- Follow the existing code structure and patterns
- Use functional components with hooks
- Keep components focused and reusable
- Use proper typing; avoid `any` types

### Styling

- Use Tailwind CSS for styling
- Follow the existing design system
- Ensure responsive design for mobile and desktop
- Use shadcn-ui components when possible

### File Organization

- Place components in `src/components/`
- Place pages in `src/pages/`
- Place utilities in `src/lib/`
- Place hooks in `src/hooks/`

## Pull Request Process

1. **Create a feature branch** from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the code style guidelines

3. **Test your changes** thoroughly
   - Run the development server and test manually
   - Ensure the build completes successfully
   - Run linting and fix any issues

4. **Commit your changes** using conventional commit messages

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Provide a clear title and description
   - Reference any related issues
   - Include screenshots for UI changes
   - Ensure all checks pass

7. **Address review feedback**
   - Make requested changes promptly
   - Push additional commits to the same branch
   - Request re-review when ready

## Code Review Guidelines

### For Contributors

- Be open to feedback and suggestions
- Respond to comments in a timely manner
- Ask questions if requirements are unclear

### For Reviewers

- Be respectful and constructive
- Focus on code quality and maintainability
- Suggest improvements clearly
- Approve when ready to merge

## Reporting Issues

When reporting bugs or issues:

1. **Check existing issues** to avoid duplicates
2. **Use a clear title** that describes the problem
3. **Provide detailed description** including:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots if applicable
   - Environment details (browser, OS, etc.)

## Questions or Need Help?

- Open a GitHub issue with the `question` label
- Discuss in pull request comments
- Check existing documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
