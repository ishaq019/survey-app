# Development Guidelines

## Code Quality

### Before Committing

```bash
cd frontend

# Fix code style issues
npm run lint:fix

# Format code
npm run format

# Run linter to verify
npm run lint
```

### ESLint Configuration

The project uses ESLint with React plugins to catch:
- Unused variables
- Missing dependencies in hooks
- React best practices
- Accessibility issues

### Prettier Configuration

Automatic code formatting for:
- Consistent indentation
- Quote style
- Line length
- Trailing commas

## Git Workflow

### Feature Development

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and test locally
npm run dev

# Commit changes
git add .
git commit -m "feat: description of changes"

# Push to GitHub
git push origin feature/your-feature-name

# Create Pull Request on GitHub
```

### Commit Message Format

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructure
- `test:` Test updates
- `ci:` CI/CD changes

Example:
```
feat: add survey response validation
fix: correct chart data calculation
docs: update deployment guide
```

## Testing

### Local Build Test

```bash
cd frontend
npm run build
npm run preview
```

Then open: http://localhost:4173

### Production Preview

The `preview` command shows exactly how the app will look on:
- syedishaq.me (production)
- With production environment variables
- With production build optimizations

## Performance Optimization

### Bundle Analysis

To check bundle size:

```bash
cd frontend
npm run build
# Check dist/ folder size
```

Vite already includes:
- Code splitting
- Tree shaking
- Minification
- Lazy loading support

## Environment Setup

### Required Node Version

- Node.js 18 or higher
- npm 9 or higher

Check your version:
```bash
node --version
npm --version
```

### Install Node Version Manager (Optional)

**NVM for Windows:**
```powershell
# Install from: https://github.com/coreybutler/nvm-windows
nvm install 18
nvm use 18
```

## Troubleshooting Development Issues

### Port Already in Use

If port 5174 is occupied:

```bash
# Kill process on port 5174 (Windows)
netstat -ano | findstr :5174
taskkill /PID <PID> /F

# Or use different port
npm run dev -- --port 5175
```

### Dependency Issues

```bash
# Clear node_modules and reinstall
rm -r node_modules package-lock.json
npm install
```

### Build Failures

```bash
# Clear vite cache
rm -r node_modules/.vite
npm run build
```

## IDE Setup (VS Code)

### Recommended Extensions

- ESLint
- Prettier - Code formatter
- Vite
- ES7+ React/Redux/React-Native snippets

### VS Code Settings

Add to `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Documentation

- [React Docs](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [ESLint Rules](https://eslint.org/docs/latest/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)

## Common Issues

| Issue | Solution |
|-------|----------|
| Component not rendering | Check import paths and JSX syntax |
| Styling not applied | Verify CSS file is imported in component |
| API calls failing | Check `.env` file for correct API URL |
| Build fails | Run `npm run lint` to find issues |
| Port conflicts | Use different port or kill existing process |

---

**Last Updated:** 2026-05-30
