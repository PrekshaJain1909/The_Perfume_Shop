# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Backend API

The frontend calls a backend API for products, orders, wishlist, and authentication. By default the app will use the local API URL `http://localhost:5000/api` unless you provide an environment variable.

- To point the frontend to the deployed backend (Render), set the Vite env var `VITE_API_BASE_URL` to your API base, for example:

```
VITE_API_BASE_URL=https://the-perfume-shop.onrender.com/api
```

- We added a `.env` file in the `client/` folder in this project that contains the Render URL. If you run the dev server you may need to restart it to pick up changes.

Notes:
- The API URL should include the `/api` path segment because client code appends resource paths like `/orders` and `/products` to the base URL.
- If deploying the frontend separately, set the same `VITE_API_BASE_URL` in your host environment (Netlify, Vercel, etc.) so the built client targets the correct backend.

Favicon / Logo
- The navbar uses the image at `src/assets/react.svg` by default. To change the site logo, replace that file or update `src/components/Navbar.jsx` to point to a different asset.
- The favicon referenced in `client/index.html` can be replaced by placing `logo.png` (or your preferred file) into `client/public/` or by updating the `<link rel="icon">` path in `index.html`.
