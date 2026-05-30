# Survey App

A modern survey application built with React and Vite, ready for deployment to GitHub Pages with custom domain support.

## 🚀 Quick Start

### Development
```bash
cd frontend
npm install
npm run dev
```

Server runs on: **http://localhost:5174**

### Production Build
```bash
cd frontend
npm run build
```

## 📋 Features

- React 18.3.1 with Vite
- Beautiful UI with responsive design
- Rich text editor with TipTap
- Survey management and reporting
- Charts and analytics with Recharts
- Drag-and-drop support (React Beautiful DND)
- Toast notifications
- ESLint and Prettier integration

## 🌐 Deployment

The app is configured for **GitHub Pages** deployment at the subdirectory `syedishaq.me/survey-app`.

### Automatic Deployment
- Push to `main` branch → GitHub Actions automatically builds and deploys
- All changes are live at: **https://syedishaq.me/survey-app**

### Deployment Steps
See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup instructions including:
- DNS configuration
- GitHub Pages settings
- Local development workflow
- Environment variables

## 📁 Project Structure

```
survey-app/
├── frontend/                 # React + Vite app
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── styles/          # CSS stylesheets
│   │   ├── utils/           # Utility functions
│   │   ├── context/         # React context
│   │   ├── config/          # Configuration
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env.production
├── .github/
│   └── workflows/
│       └── deploy.yml       # CI/CD workflow
├── DEPLOYMENT.md            # Deployment guide
├── package.json             # Root package.json
└── .gitignore
```

## 🛠️ Available Scripts

In the `frontend` directory:

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Check code style |
| `npm run lint:fix` | Auto-fix code issues |
| `npm run format` | Format code with Prettier |

## 🔧 Configuration

### Environment Variables

**Development** (`.env`):
```
VITE_API_URL=http://localhost:5001/api
VITE_QUIZ_APP_URL=http://localhost:5173
```

**Production** (`.env.production`):
```
VITE_API_URL=https://api.syedishaq.me/api
VITE_QUIZ_APP_URL=https://quiz.syedishaq.me
```

## 📚 Dependencies

**Core:**
- React 18.3.1
- React Router DOM 6.30.3
- Vite 6.4.2

**UI & Styling:**
- TipTap (rich text editor)
- Recharts (charts & analytics)
- React Toastify (notifications)
- React Beautiful DND (drag & drop)

**Development:**
- ESLint with React plugins
- Prettier (code formatter)

## 🚦 GitHub Actions Workflow

The CI/CD pipeline:
1. Triggers on push to `main`/`master`
2. Installs dependencies
3. Builds the application
4. Creates CNAME for custom domain
5. Deploys to GitHub Pages

View logs: https://github.com/ishaq019/survey-app/actions

## 🔒 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📖 Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Complete deployment instructions
- [Vite Documentation](https://vitejs.dev/) - Vite configuration
- [React Documentation](https://react.dev/) - React basics
- [GitHub Pages Docs](https://docs.github.com/en/pages) - GitHub Pages setup

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run `npm run lint:fix` and `npm run format`
4. Commit and push
5. GitHub Actions will automatically deploy on merge to main

## 📞 Support

For issues or questions:
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for common issues
- GitHub Issues: https://github.com/ishaq019/survey-app/issues

## 📄 License

MIT License - see LICENSE file for details

---

**Live Site:** https://syedishaq.me/survey-app  
**Repository:** https://github.com/ishaq019/survey-app  
**Last Updated:** 2026-05-30

Open survey manager from Quiz app:

```txt
http://localhost:5174/admin/exams/<examId>/survey-templates?returnUrl=http://localhost:5173/admin/exams
```

Open pre-exam survey:

```txt
http://localhost:5174/student/exams/<examId>/before-survey?returnUrl=http://localhost:5173/student/exams/<examId>/attempt&participantId=<studentId>
```

Open post-exam survey:

```txt
http://localhost:5174/student/exams/<examId>/after-survey?returnUrl=http://localhost:5173/result&participantId=<studentId>
```

`participantId` is optional. If Quiz app does not pass it, Survey frontend creates one locally.
"# survey-app" 
