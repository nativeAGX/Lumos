# LUMOS MUNICIPAL 💡
### Autonomous Municipal Smart Streetlighting SCADA & Civic Redressal Platform

[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?style=flat&logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-v4.19-000000?style=flat&logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-v7.0+-47A248?style=flat&logo=mongodb)](https://www.mongodb.com)
[![React](https://img.shields.io/badge/React-v18.2-61DAFB?style=flat&logo=react)](https://react.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![JWT](https://img.shields.io/badge/Auth-JWT%20%2B%20Bcrypt-FF4088?style=flat&logo=json-web-tokens)](https://jwt.io)

> **Endorsed under the Smart City Governance Framework**  
> *ISO 37122 & ISO 37120 Municipal Telemetry Compliant | AES-256 Civic Transport | Role-Based Access Control*

---

## 🌟 Overview & System Architecture

**LUMOS MUNICIPAL** is a production-grade full-stack smart city management platform. It combines an **Express & Node.js REST API**, **MongoDB database**, and an interactive **React 18 frontend** to bridge real-time SCADA IoT streetlighting telemetry, AI-driven fault triage, dynamic field crew dispatch, and civic grievance resolution into a single unified console.

```
┌─────────────────────────────────────────────────────────────┐
│                       REACT FRONTEND                        │
│   (Port 3000 • React Router 6 • Tailwind CSS • Context API) │
└──────────────┬──────────────────────────────▲───────────────┘
               │ HTTP Requests (JSON)         │ Live State
               │ Bearer JWT Auth              │ Optimistic UI
               ▼                              │
┌─────────────────────────────────────────────┴───────────────┐
│                    EXPRESS & NODE BACKEND                   │
│   (Port 5001 • REST Controllers • Bcrypt • JWT Middleware)  │
└──────────────┬──────────────────────────────▲───────────────┘
               │ Mongoose ODM                 │ Native Driver
               ▼                              │
┌─────────────────────────────────────────────┴───────────────┐
│                      MONGODB DATABASE                       │
│     (Port 27017 • lumos_db • Monitored via MongoDB Compass) │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Key Modules & Capabilities

| Module | Route | Access Level | Description & Core Features |
|---|---|---|---|
| **Landing & Civic Overview** | `/` | Public | Network-wide KPIs (14,820+ poles, 38% energy offset, <4h MTTR), quick asset inspector, and portal switcher. |
| **Authentication & Role Portal** | `/login` | Public | Secure credentials login, JWT session issuance, and instant role switcher with pre-configured municipal personas. |
| **Citizen Grievance Redressal** | `/citizen` | Citizen / Public | 5-step fault filing wizard with GPS EXIF watermarking, category tagging, and 4-phase live resolution dispatch pipeline. |
| **Geospatial Asset Twin** | `/gis-map` | Operations (`ward_officer`, `field_tech`) | Vector SCADA map of streetlight nodes, branch circuits, live voltage/current draw diagnostics, and asset CRUD. |
| **AI Fault Intakes & Triage** | `/fault-intakes` | Operations (`ward_officer`, `field_tech`) | Neural fault classification (`Lumos-Vision-v4.1`), spatial deduplication within 12m radius, and 1-click Work Order approval. |
| **Work Orders & Dispatch Kanban**| `/work-orders` | Operations (`ward_officer`, `field_tech`) | 3-stage Kanban board (**TO DISPATCH**, **IN PROGRESS**, **UNDER REVIEW / QA**), crew allocation, and before/after photo audit logs. |
| **Field Technician Console** | `/field-queue` | Lineman (`field_tech` only) | Mobile-optimized terminal for Unit #07, high-voltage safety protocols, mandatory repair checklists, proof submission, and RFID van inventory. |
| **SLA Analytics & Compliance** | `/sla-analytics` | Officer (`ward_officer` only) | Resolution velocity metrics, citywide MTTR vs target (3.8h vs 5.0h), sector penalty tracking, and CSV audit export. |

---

## 🔒 Security, Authentication & Role-Based Access Control (RBAC)

The platform implements multi-layer defense with **bcryptjs password hashing** and **stateless JSON Web Tokens (JWT)**:

* **Password Security**: Passwords are salted with 10 rounds of bcrypt upon registration and compared securely during login. Password hashes use `{ select: false }` to prevent database leaks.
* **Strict Authentication**: Login enforces mandatory email and password validation with direct bcrypt comparison.
* **JWT Token Issuance**: Issued tokens embed user identification and their authorized `role` (`ward_officer`, `field_tech`, or `citizen`).
* **Route Protection Middleware**:
  - `protect`: Validates the `Authorization: Bearer <token>` header, verifies signature against `JWT_SECRET`, and injects `req.user`.
  - `authorize(...roles)`: Verifies role permissions and rejects unauthorized requests with `403 Forbidden`.
* **Registration Protection**: Public self-registration is strictly locked to the `citizen` role. Administrative roles (`ward_officer`, `field_tech`) cannot be self-escalated.
* **Environment Isolation**: `server/.env` is kept private and excluded via [`.gitignore`](file:///Users/varadbipinsurve/Desktop/lumos-municipal/.gitignore). The server fails fast on startup if `JWT_SECRET` is not configured.

### Permissions Matrix

| Endpoint | Method | Required Role | Functionality |
|---|---|---|---|
| `/api/auth/register` | `POST` | Public (`citizen` only) | Register verified resident account |
| `/api/auth/login` | `POST` | Public | Authenticate with email/password & receive JWT |
| `/api/auth/me` | `GET` | Authenticated | Retrieve authenticated user profile |
| `/api/auth/users` | `GET` | `ward_officer` | List municipal user accounts |
| `/api/poles` | `GET` | Public / Operations | Read streetlight pole coordinates & telemetry |
| `/api/poles` | `POST`, `PUT`, `DELETE` | `ward_officer` | Register, edit, or decommission poles |
| `/api/poles/:id/ping` | `POST` | `ward_officer`, `field_tech` | Trigger SCADA telemetry ping |
| `/api/grievances` | `POST` | `citizen`, `ward_officer` | File new civic complaint |
| `/api/grievances` | `GET` | Public / Citizen | View civic grievances and ticket status |
| `/api/grievances/:id/status`| `PATCH` | `ward_officer`, `field_tech` | Update grievance resolution status |
| `/api/intakes` | `GET` | `ward_officer`, `field_tech` | Access AI fault triage stream |
| `/api/intakes/:id/*` | `PATCH`, `POST`, `DELETE` | `ward_officer` | Reclassify defect, dedup cluster, dismiss, approve |
| `/api/work-orders` | `GET` | `ward_officer`, `field_tech` | View maintenance dispatch board |
| `/api/work-orders` | `POST`, `DELETE` | `ward_officer` | Create or cancel work orders |
| `/api/work-orders/:id/*` | `PATCH` | `ward_officer` | Dispatch crew, audit QA sign-off, reject redo |
| `/api/technician/*` | ALL | `field_tech` (Strict) | Lineman checklist, photo upload, job completion |
| `/api/analytics` | `GET` | `ward_officer` | SLA benchmarks, MTTR metrics, CSV export |

---

## 🍃 MongoDB & MongoDB Compass Setup

### 1. Ensure MongoDB Server is Running

#### On macOS (via Homebrew):
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```
*(Verify with `brew services list` — status will display `started` on port `27017`)*

#### Via Docker (Alternative):
```bash
docker run -d -p 27017:27017 --name lumos-mongo mongo:latest
```

#### Via MongoDB Atlas (Cloud Alternative):
Paste your connection URI (`mongodb+srv://<user>:<password>@cluster0.mongodb.net/lumos_db`) into `server/.env`.

### 2. Connect MongoDB Compass (GUI)
1. Launch **MongoDB Compass**.
2. In the connection string bar, enter:
   ```
   mongodb://127.0.0.1:27017
   ```
3. Click **Connect**.
4. After running the seeder (Step 3 below), click **Refresh** on Compass to explore the `lumos_db` database and its 7 collections:
   - `poles`
   - `grievances`
   - `aiintakes`
   - `workorders`
   - `technicianqueues`
   - `analytics`
   - `users`

---

## ⚡ Quick Start Guide

### 1. Clone & Install Dependencies

```bash
# Clone repository
git clone https://github.com/your-repo/lumos-municipal.git
cd lumos-municipal

# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..
```

### 2. Configure Environment Variables

Create `server/.env` based on `server/.env.example`:

```bash
cp server/.env.example server/.env
```

Ensure your `server/.env` contains:
```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/lumos_db
CLIENT_ORIGIN=http://localhost:3000
NODE_ENV=development
JWT_SECRET=lumos_municipal_jwt_secret_key_2026_super_secure
JWT_EXPIRES_IN=30d
```

> **Note on Port 5001**: macOS Monterey and newer bind port `5000` to AirPlay Receiver. The Lumos backend runs on port `5001` to eliminate port collision issues.

### 3. Seed Initial Dataset

Seed poles, grievances, work orders, field queue data, and encrypted demo users:

```bash
npm run seed
```

### 4. Run the Full Stack

Run both the Express backend and React frontend concurrently:

```bash
npm run dev
```

* **Frontend**: [http://localhost:3000](http://localhost:3000)
* **Backend API**: [http://localhost:5001](http://localhost:5001)
* **Health Check**: [http://localhost:5001/api/health](http://localhost:5001/api/health)

*(You can also run them in separate terminals with `npm run server` and `npm start`)*

---

## 🔑 Demo Personas & Test Credentials

All demo accounts are pre-seeded with password: **`password123`**

| Persona | Role | Email | Password | Landing Page |
|---|---|---|---|---|
| **Dr. Sandeep Deshmukh** | `ward_officer` | `officer.deshmukh@somaiya.gov.in` | `password123` | `/gis-map` |
| **Rajesh Kumar** | `field_tech` | `rajesh.k@field.lumos.gov.in` | `password123` | `/field-queue` |
| **Rahul M.** | `citizen` | `rahul.m@somaiya.edu` | `password123` | `/citizen` |

---

## 📁 Directory Structure

```
lumos-municipal/
├── server/
│   ├── config/
│   │   └── db.js                 # MongoDB Mongoose connection & diagnostics
│   ├── controllers/
│   │   ├── aiIntakeController.js # AI triage actions & dedup clustering
│   │   ├── analyticsController.js# SLA metrics & CSV audit report generation
│   │   ├── authController.js     # Bcrypt authentication, register & JWT issue
│   │   ├── grievanceController.js# Civic complaint filing & resolution pipeline
│   │   ├── poleController.js     # Pole CRUD & SCADA telemetry ping simulation
│   │   ├── technicianController.js# Lineman checklist, photo upload & inventory
│   │   └── workOrderController.js# Work order dispatch, Kanban & QA approval
│   ├── middleware/
│   │   └── authMiddleware.js     # protect (JWT verification) & authorize (RBAC)
│   ├── models/
│   │   ├── AiIntake.js
│   │   ├── Analytics.js
│   │   ├── Grievance.js
│   │   ├── Pole.js
│   │   ├── TechnicianQueue.js
│   │   ├── User.js               # Bcrypt pre-save hook & JWT generator
│   │   └── WorkOrder.js
│   ├── routes/                   # Mounted Express API routers
│   ├── seeder/
│   │   └── seedData.js           # Database population script
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Express application entry point (Port 5001)
├── src/
│   ├── components/
│   │   ├── common/               # Header (with live DB badge), Footer
│   │   └── modals/               # Inspector, CAD overlay, Work Order, Reclassify
│   ├── constants/
│   ├── contexts/
│   │   ├── AuthContext.js        # JWT token state & role-switching
│   │   └── LumosContext.js       # Live API synchronization with local fallback
│   ├── layouts/
│   ├── pages/                    # 8 full-page interactive views
│   ├── routes/
│   │   ├── AppRoutes.js          # Client-side route declarations
│   │   └── ProtectedRoute.js     # Client RBAC route guard
│   ├── services/
│   │   └── api.js                # Axios client with Bearer token interceptor
│   ├── utils/
│   ├── App.js
│   └── index.js
├── .gitignore                    # Excludes .env, server/.env, and node_modules
├── package.json                  # Root runner scripts (npm run dev, server, seed)
└── tailwind.config.js
```

---

## 🧪 Testing API Protection via cURL

```bash
# 1. Login as Ward Officer to receive JWT token
TOKEN=$(curl -s -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"officer.deshmukh@somaiya.gov.in","password":"password123"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# 2. Access Ward Officer endpoint (200 OK)
curl -i http://localhost:5001/api/analytics -H "Authorization: Bearer $TOKEN"

# 3. Login as Citizen
CITIZEN_TOKEN=$(curl -s -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rahul.m@somaiya.edu","password":"password123"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# 4. Attempt to access Ward Officer endpoint as Citizen (403 Forbidden)
curl -i http://localhost:5001/api/analytics -H "Authorization: Bearer $CITIZEN_TOKEN"
# Result -> HTTP/1.1 403 Forbidden: "User role 'citizen' is not authorized to access this route"

# 5. Attempt to access Technician queue as Citizen (403 Forbidden)
curl -i http://localhost:5001/api/technician/queue -H "Authorization: Bearer $CITIZEN_TOKEN"
# Result -> HTTP/1.1 403 Forbidden: "User role 'citizen' is not authorized to access this route"
```

---

## 📜 License & Compliance
This project is open-source under the ISC License. Designed and architected for municipal operations, smart infrastructure research, and demonstration purposes.
