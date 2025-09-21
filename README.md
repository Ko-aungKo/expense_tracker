# Expense Tracker Frontend 🖥️📊

A **React + Vite** frontend for the Expense Tracker platform. It connects to a Laravel API to manage **expenses** and **categories**, with filters, sorting, charts, and a clean UI.

---

## ✨ Features
- Dashboard with summary cards & charts
- CRUD for **Expenses** and **Categories**
- Filter by date range, category, and keyword
- Sort & paginate expense lists
- Responsive UI (Tailwind CSS)
- Centralized API layer with Axios + interceptors
- Context-based state management

---

## 🧱 Tech Stack
- **React 19 + Vite 7**
- **Tailwind CSS 3**
- **Axios** for HTTP
- **React Router** for routing
- **Recharts** for charts

> **Node version:** Vite 7 requires **Node `^20.19.0` or `>=22.12.0`**. Use `nvm` to switch if needed.

```bash
nvm install 22
nvm use 22
```

---

## 📂 Project Structure (key paths)

```
src/
  components/
    Categories/      # CategoryList, CategoryForm
    Expenses/        # ExpenseList, ExpenseForm, ExpenseFilters
    Layout/          # AppShell, Header, Sidebar
    UI/              # Button, Modal, Spinner, EmptyState
    ErrorBoundary.jsx
  pages/             # Dashboard.jsx, Expenses.jsx, Categories.jsx
  context/           # AppProvider, hooks, core
  services/          # api.js (Axios instance, endpoints, helpers)
  hooks/             # useApi
  utils/             # helpers.js (formatters, date utils)
  main.jsx           # Router + Providers
  App.jsx            # Routes
```

---

## ⚙️ Configuration

Create a `.env` file (copy from `.env.example`) and set your API URL:

```bash
cp .env.example .env
```

`.env` values:

```env
# Base URL of your Laravel API (must end with /api)
VITE_API_URL=http://127.0.0.1:8000/api

# Optional brand info
VITE_APP_NAME=Expense Tracker
VITE_APP_VERSION=1.0.0
```

> The app reads `import.meta.env.VITE_API_URL` in **src/services/api.js**. Default is `http://127.0.0.1:8000/api` if not set.

---

## 🛠️ Local Development

```bash
# Install deps
npm install

# Start dev server
npm run dev

# Lint (optional)
npm run lint
```

Open **http://localhost:5173**

---

## 🧪 API Assumptions

The frontend expects these endpoints to exist on the backend:

- `GET   /api/dashboard` (with optional query params)  
- `GET   /api/categories`
- `POST  /api/categories`
- `PUT   /api/categories/:id`
- `DELETE /api/categories/:id`
- `GET   /api/expenses`
- `POST  /api/expenses`
- `PUT   /api/expenses/:id`
- `DELETE /api/expenses/:id`

If you’re using a different backend URL in production, update **Vercel → Project Settings → Environment Variables** with `VITE_API_URL`.

---

## 🚀 Build & Deploy (Vercel/Netlify)

```bash
# Build for production
npm run build

# Preview locally (optional)
npm run preview
```

**Vercel config:**
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variables:** `VITE_API_URL=https://your-backend.example.com/api`
- **Node Version:** 22 (recommended) or 20.19+

**CORS reminder:** Add your deployed frontend origin (e.g. `https://your-app.vercel.app`) to the Laravel **config/cors.php → allowed_origins** list.

---

## 🧰 Troubleshooting

- **EBADENGINE / unsupported engine (vite / @vitejs/plugin-react)**  
  Install Node **22** or **20.19+** via `nvm`.

- **Network/CORS errors**  
  Confirm `VITE_API_URL` is correct and your backend **CORS** allows the frontend origin.

- **Blank page after deploy**  
  Make sure your host serves the **`dist/`** folder and you built with the right **VITE_API_URL**.

---

## 📜 Scripts

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint ."
}
```

---

## 📄 License

MIT © 2025
