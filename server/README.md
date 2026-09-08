# Johi Mobile Mart — Backend API

Node.js + Express + MongoDB (Mongoose) API for Johi Mobile Mart. Handles real
accounts, listings, image uploads, buyer/seller messaging, favorites, reports
and a fully functional admin panel.

## 1. Get a MongoDB database

You need a running MongoDB instance. Pick one:

**Option A — MongoDB Atlas (free, no install, recommended)**
1. Create a free cluster at https://www.mongodb.com/cloud/atlas/register
2. Click "Connect" → "Drivers" and copy the connection string, e.g.
   `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/johi-mobile-mart`
3. Paste it into `MONGO_URI` in `.env` (see step 2 below).

**Option B — Local MongoDB**
1. Install MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Start it (`mongod` or via your OS service manager).
3. Keep the default `MONGO_URI=mongodb://127.0.0.1:27017/johi-mobile-mart` in `.env`.

## 2. Configure environment variables

```
cp .env.example .env
```

Edit `.env`:
```
MONGO_URI=mongodb://127.0.0.1:27017/johi-mobile-mart
JWT_SECRET=replace_with_a_long_random_string
PORT=5000
CLIENT_URL=http://localhost:5173
```

## 3. Install and run

```
npm install
npm run seed     # populates demo admin, sellers, buyers, listings, wanted requests
npm run dev      # starts the API on http://localhost:5000 (auto-restarts on changes)
```

Or `npm start` for a plain run without file-watching.

### Demo accounts created by the seed script
| Role   | Phone         | Password     |
|--------|---------------|--------------|
| Admin  | 0300-0000000  | admin123     |
| Seller | 0300-1234567  | password123  |
| Buyer  | 0321-1112233  | password123  |

## 4. API overview

All routes are prefixed with `/api`. Protected routes require
`Authorization: Bearer <token>`.

- `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `PUT /auth/me`
- `GET /listings` (filters: q, brand, condition, pta, storage, ram, location,
  minPrice, maxPrice, sort, page, limit)
- `GET /listings/:id`, `GET /listings/:id/contact` (protected — reveals seller
  phone/WhatsApp), `GET /listings/mine`
- `POST /listings` (protected, multipart form with `images` field, min 2 files)
- `PUT /listings/:id`, `PATCH /listings/:id/sold`, `PATCH /listings/:id/renew`,
  `DELETE /listings/:id`
- `POST /listings/:id/favorite`, `GET /listings/user/favorites`
- `GET /wanted`, `GET /wanted/mine`, `POST /wanted`, `DELETE /wanted/:id`
- `POST /messages/start`, `GET /messages/conversations`,
  `GET /messages/conversations/:id`, `POST /messages/conversations/:id`
- `POST /reports`
- `GET /admin/stats`, `GET /admin/listings`, `PATCH /admin/listings/:id/approve`,
  `PATCH /admin/listings/:id/reject`, `DELETE /admin/listings/:id`,
  `GET /admin/users`, `PATCH /admin/users/:id/suspend`, `GET /admin/reports`,
  `DELETE /admin/reports/:id` (resolves it), `GET /admin/wanted`

Uploaded images are served statically from `/uploads/<filename>`.

## 5. How moderation works

New listings posted by regular users are created with `approvalStatus: "pending"`
and only appear in public search once an admin approves them from the
**Pending** tab of `/admin` on the frontend. Listings created directly by an
admin account are auto-approved.

## 6. Notes

- Passwords are hashed with bcrypt; sessions use JWT (30-day expiry).
- Phone numbers are never included in the public listing payload — they're
  only returned by the `/listings/:id/contact` endpoint to logged-in users,
  which is what powers the "Show Contact Options" button on the frontend.
- Buyer/seller chat is fully real — messages are persisted in MongoDB and
  visible only to the two participants of a conversation.
