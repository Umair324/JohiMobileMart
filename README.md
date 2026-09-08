# Johi Mobile Mart

A local mobile-phone marketplace for Johi — buyers and sellers connect
directly, with a real backend, real accounts, real in-app messaging, and a
fully functional admin panel.

## Stack

- **Frontend:** React + Vite + Tailwind CSS + React Router
- **Backend:** Node.js + Express + MongoDB (Mongoose) + JWT auth + Multer image uploads

## Quick start (both servers)

### 1. Backend
```
cd server
cp .env.example .env      # then edit MONGO_URI — see server/README.md
npm install
npm run seed               # demo admin/sellers/buyers/listings
npm run dev                 # http://localhost:5000
```
Full details, demo login credentials, and the API reference are in
[`server/README.md`](server/README.md).

### 2. Frontend
```
cp .env.example .env       # VITE_API_URL defaults to http://localhost:5000/api
npm install
npm run dev                 # http://localhost:5173
```

Open http://localhost:5173 and log in with one of the seeded demo accounts
(shown on the login page), or register a new account.

## What's fully functional

- **Accounts:** real registration/login with JWT, hashed passwords
- **Listings:** create with real image upload, browse with server-side
  filters/sort/pagination, edit, mark sold, renew, delete
- **Contact sharing:** phone/WhatsApp numbers are hidden by default and only
  revealed to logged-in users via a protected API call — real data sharing,
  not a UI mock
- **Messaging:** a real buyer↔seller chat inbox (`/messages`), persisted in
  MongoDB, only visible to the two people in the conversation
- **Favorites:** saved per-account on the server
- **Wanted Phones:** post/browse/delete requests, tied to your account
- **Admin Dashboard** (`/admin`, admin accounts only): live stats, approve/
  reject pending listings, delete any listing, suspend/unsuspend users,
  resolve reports, view all wanted requests — every action hits the real API
- **Moderation workflow:** listings from regular users go to "Pending" until
  an admin approves them; only approved + active listings appear in public
  search

## What's still a placeholder

- Google login button (UI only, intentionally disabled)
- Demo/seed listings use generated SVG "phone art" instead of real photos
  (new listings you create yourself upload and display real photos)
- No payment processing — by design, per the marketplace's safety model
  (buyers and sellers meet and pay each other directly)

## Project structure

```
src/            React frontend (pages, components, api client, contexts)
server/         Express + MongoDB backend (routes, models, middleware)
```
