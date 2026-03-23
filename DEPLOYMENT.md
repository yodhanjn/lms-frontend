# Deployment: Vercel (frontend) + Render (backend)

If the deployed app shows no data or "Signup/Login failed", the frontend is not talking to the backend. Follow this checklist **in order**.

---

## 1. Backend on Render

In your **lms-backend** service on Render → **Environment**, set:

- `MONGODB_URI` — full Atlas URI including `/lms?retryWrites=true&w=majority`
- `JWT_SECRET` — long random string
- `FRONTEND_URL` — your exact Vercel app URL (e.g. `https://your-app.vercel.app`), no trailing slash

Save (Render redeploys automatically).

---

## 2. Frontend on Vercel (critical)

The app is built at deploy time. If `VITE_API_URL` is **not set** before the build, the app will call `/api` on the Vercel domain and get 404.

1. Vercel → your **frontend project** → **Settings** → **Environment Variables**.
2. Add **`VITE_API_URL`** = `https://YOUR-RENDER-URL.onrender.com/api`  
   (use your real Render URL; must **end with `/api`**; no trailing slash after `api`).
3. **Save**, then **Deployments** → **⋯** on latest → **Redeploy** (env is applied at build time).

---

## 3. Verify

Open your Vercel app → DevTools → **Network** → reload. You should see requests to `https://....onrender.com/api/...`. If you see requests to `....vercel.app/api/...`, set `VITE_API_URL` in Vercel and redeploy again.
