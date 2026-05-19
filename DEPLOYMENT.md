# WambuXtore Deployment

Deploy the backend first, then the frontend. The frontend needs the final Render API URL at build time.

## 1. Push to GitHub

Commit and push the repo after confirming these generated/local files are not committed:

- `wambuxtore_backend_fixed/.env`
- `wambuxtore_backend_fixed/db.sqlite3`
- `wambuxtore_backend_fixed/staticfiles/`
- `wambuxtore_react/node_modules/`
- `wambuxtore_react/build/`
- `*.log`

## 2. Backend on Render

Use the root `render.yaml` as a Render Blueprint, or create a Web Service manually.

Manual settings:

- Root Directory: `wambuxtore_backend_fixed`
- Runtime: `Python`
- Build Command: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
- Start Command: `gunicorn wambuxtore_backend.wsgi:application`

Environment variables:

```text
DEBUG=False
SECRET_KEY=<generate a long random value>
ALLOWED_HOSTS=wambuxtore-backend-mfml.onrender.com
CORS_ALLOWED_ORIGINS=https://<your-vercel-app>.vercel.app
CSRF_TRUSTED_ORIGINS=https://<your-vercel-app>.vercel.app
DATABASE_URL=<your Render/Postgres internal database URL, recommended for persistent login users>
MONGO_URI=<your MongoDB connection string>
MONGO_DB_NAME=wambuxtore
CLOUDINARY_CLOUD_NAME=<your value>
CLOUDINARY_API_KEY=<your value>
CLOUDINARY_API_SECRET=<your value>
EMAIL_HOST_USER=<your Gmail address>
EMAIL_HOST_PASSWORD=<your Gmail app password>
```

After Render deploys, your API base URL will be:

```text
https://wambuxtore-backend-mfml.onrender.com/api
```

If you do not set `DATABASE_URL`, the backend falls back to SQLite. That is okay for a quick demo, but accounts stored through Django auth may not persist reliably on Render.

## 3. Frontend on Vercel

Create a Vercel project from the same GitHub repo.

Settings:

- Framework Preset: `Create React App`
- Root Directory: `wambuxtore_react`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `build`

Environment variable:

```text
REACT_APP_API_BASE_URL=https://wambuxtore-backend-mfml.onrender.com/api
```

Redeploy the frontend after adding/changing this variable, because Create React App embeds `REACT_APP_*` variables during the build.

## 4. Final Render Update

Once Vercel gives you the production URL, return to Render and set:

```text
CORS_ALLOWED_ORIGINS=https://<your-vercel-app>.vercel.app
CSRF_TRUSTED_ORIGINS=https://<your-vercel-app>.vercel.app
```

Then redeploy the backend.

## 5. Smoke Test

Open these URLs:

```text
https://wambuxtore-backend-mfml.onrender.com/api/products/
https://<your-vercel-app>.vercel.app
```

Then test login/register, product listing, contact form, checkout, and wishlist.
