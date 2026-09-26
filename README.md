# AIterior Design - Backend API

RESTful API and AI service backend for AIterior Design Studio, built with Node.js, Express, and MongoDB.

## Features
- JWT Authentication & Role-based Access Control (Superadmin, Admin, Client)
- Project & Category management
- Client Enquiries & Testimonials management
- Cloudinary media asset storage & local upload fallback
- AI Interior Design integration (Replicate / Flux / SD)
- Dashboard analytics and stats

## Tech Stack
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT, bcryptjs
- **Cloud Storage:** Cloudinary
- **AI Integration:** Replicate API

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in MongoDB connection URI, Cloudinary keys, and Replicate API token.

### 3. Initialize Default Users & Seed Data
```bash
npm run init:users
npm run seed
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Production
```bash
npm start
```
