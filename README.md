# Job Expert Backend 🚀
Comprehensive documentation for the Job Expert backend (Express + MongoDB). This README summarizes how the app works, how to run it locally, the environment variables required, the main API endpoints, data models, authentication flow, and a short list of implementation notes and known issues discovered while analyzing the code. 🧭
## Quick overview 🔎
- Language & runtime: Node.js (ES modules) 🟩
- Frameworks: Express, Mongoose ⚙️
- Database: MongoDB (mongoose) 🗄️
- Authentication: JWT stored in cookie (or passed in Authorization header) 🔐
- Server default port: 5000 🖥️
## Requirements (what I will document) ✅
- ✅ Project metadata and scripts (from `package.json`)
- ✅ Environment variables required
- ✅ How to install & run locally
- ✅ API endpoints (grouped by resource)
- ✅ Data model summaries
- ✅ Authentication & middleware behavior
- ✅ Notes, caveats, and next steps found by analyzing the code
## Installation 🧰
- Node.js (v16+ recommended) ⚠️
- A MongoDB instance (URI) 🗃️

The repository's `start` script runs `nodemon index.js` (see `package.json`). The server listens on port 5000 by default. ✅
## Environment variables 🔑
- MONGODB_URI - MongoDB connection string (required)
- SECRET_KEY - JWT secret used by `authMiddleware` (required)
- CLOUD_NAME - Cloudinary cloud name (optional, for uploads)
- API_KEY - Cloudinary API key (optional)
- API_SECRET - Cloudinary API secret (optional)
- NODE_ENV - `production` or `development` (optional)

Notes:
- The code uses `process.env.SECRET_KEY` to sign/verify JWTs (some commented areas mention `JWT_SECRET_KEY` — prefer `SECRET_KEY`).
- Keep `.env` out of version control and add it to `.gitignore`. ⚠️

## Authentication 🔐
- Login sets an HTTP-only cookie named `token` and also returns an `access_token` in JSON.
- `verifyToken` middleware looks for the token in `req.cookies.token` OR the `Authorization` header with `Bearer <token>`.
- `verifyToken` verifies the token using `process.env.SECRET_KEY`, sets `req.id` and `req.user` and calls `next()`.
- `isAdmin` middleware checks `req.user.role === 'admin'`.
- Some controllers use `isAuthenticated` (which currently only checks cookie token) — this means the code supports both cookie and header flows but a few handlers rely only on cookies.

Security note: Make sure `SECRET_KEY` is a strong random value in production. Configure `secure: true` for the cookie in production behind HTTPS. 🔒
## API Reference (summary) 📡
Users (`/api/users`)
- POST /register — Register new user (uses `singleUpload` multer middleware for profile file) ➕
- POST /login — Login and set cookie 🔑
- GET /logout — Clear cookie logout 🚪
- GET /currentuser — Get current logged-in user (protected: `isAuthenticated`) 👤
- POST /profile/update — Update profile (protected: `isAuthenticated`, supports file upload) ✏️
- DELETE /delete — Delete own user (protected) 🗑️
- GET /getAllUsers — Admin or authenticated endpoint returning users (protected) 📋
- DELETE /delete/:userId — Admin-only delete ⚠️
Jobs (`/api/jobs`)
- GET /get — Public: list jobs 📄
- GET /get/:id — Public: get specific job 🔍
- Protected (requires token via `verifyToken`):
  - POST /review/:id — Add or update review for a job 📝
  - POST /apply/:id — Apply for a job (requires job.status === 'Approved') ✉️
  - POST /accept/:id — Accept a job ✅
  - POST /reject/:id — Reject a job ❌
- Admin-only (requires `isAdmin` after `verifyToken`):
- GET /admin — Jobs created by admin 🛠️
- POST /create — Create job ➕
- PUT /edit/:id — Edit job ✏️
- DELETE /delete/:id — Delete job 🗑️
- PATCH /applications/:jobId/:applicationId — Update application status 🔁
Companies (`/api/companies`)
- GET /get — Public: list companies 🏢
- GET /get/:id — Public: get specific company 🧾
- Admin (protected via `verifyToken` + `isAdmin`): POST /create, PUT /update/:id, DELETE /delete/:id 🔧
CV-related endpoints
- CV user (`/api/cvuser`): POST `/` create CV user details, GET `/:userId`, DELETE `/:userId` 📄
- Skills (`/api/skills`): POST `/` (expects JSON with userId, cvId, skills array), GET `/:userId` 🧰
- Certificates (`/api/certificates`): POST `/`, GET `/:userId` 🎓
- Education (`/api/education`): POST `/`, GET `/:userId` 🎒
- Experience (`/api/experience`): POST `/`, GET `/:userId` 💼
- Projects (`/api/projects`): POST `/`, GET `/:userId` 🧩
- Referees (`/api/referees`): POST `/`, GET `/:userId` 📞
All the CV sub-resources expect a `userId` and `cvId` in body or in their records and generally return the object stored in the DB.
## Data models (high-level) 📚
User (models/UserModel.js)
- fullname: String
- email: String (unique)
- phoneNumber: Number
- password: String (hashed expected)
- role: 'admin' | 'user' | 'company'
- profile: { bio, skills[], resume, resumeOriginalName, company ref, profilePhoto }

Job (models/jobModel.js)
- title, description, requirements, salary, location
- jobType: Enum
- experienceLevel: Enum
- numberOfPositions, positionsFilled
- company: ObjectId -> Company
- status: 'Pending' | 'Approved' | 'Rejected' | 'Filled'
- createdBy: User ref
- applicationDeadline: Date
- applications[]: {user, status, resume, coverLetter, appliedDate}
- reviews[]: {user, decision, comment, date}

Company (models/companyModel.js)
- name, description, industry, location, website, logo, contactEmail, contactPhone, createdBy

CV-related (models/*)
- `cvUser`, `skills`, `certificates`, `education`, `experience`, `projects`, `referees` contain `userId`, `cvId` and arrays describing each section.

## File uploads 📎
- Multer is used via `middlewares/multer.js` (imported across controllers/routes) for single file uploads.
- `utils/datauri.js` converts uploaded files to data URIs and `utils/cloudinary.js` is configured to upload files to Cloudinary using `CLOUD_NAME`, `API_KEY`, `API_SECRET`.
## Observations & notes from code analysis 📝
1. Default server port is 5000 (hard-coded in `index.js`).
2. CORS origin is restricted to `http://localhost:5173` in `index.js` — update this for production or make configurable. 🌐
3. Auth implementation supports both cookie-based and bearer-token header flows via `verifyToken`, but some parts of the code still use `isAuthenticated` (which requires cookie only). Consider standardizing to one method. 🔁
4. There are commented blocks and alternative implementations in `controllers/userControllers.js` — the file contains many commented examples which may be cleaned up. 🧹
5. `controllers/companyControllers.js` exists but is empty while `controllers/companyController.js` contains the implementation; consider deleting empty duplicate files to avoid confusion. 🗂️
6. Some commented code references `JWT_SECRET_KEY` whereas the runtime code uses `SECRET_KEY` — standardize on `SECRET_KEY` and update comments. 🔧
7. The repository currently contains a `.env` file in the workspace; ensure it is not committed to the public repo. Rotate any credentials that were committed. 🔒
## Suggestions / Next steps 🚀
- Add a `.gitignore` entry for `.env` if not present. 🛡️
- Clean up commented/duplicated controller files to reduce maintenance burden. 🧹
- Add integration tests for main auth and job flows. ✅
- Add OpenAPI/Swagger docs for machine-readable API reference. 📘
If you want me to extend this README with OpenAPI specs, example curl/postman requests, or to scaffold tests and CI, tell me which area you want next and I'll add it. ✨
# Job Expert Backend

Comprehensive documentation for the Job Expert backend (Express + MongoDB). This README summarizes how the app works, how to run it locally, the environment variables required, the main API endpoints, data models, authentication flow, and a short list of implementation notes and known issues discovered while analyzing the code.

## Quick overview

- Language & runtime: Node.js (ES modules)
- Frameworks: Express, Mongoose
- Database: MongoDB (mongoose)
- Authentication: JWT stored in cookie (or passed in Authorization header)
- Server default port: 5000

## Requirements (what I will document)

Checklist:
- [x] Project metadata and scripts (from `package.json`)
- [x] Environment variables required
- [x] How to install & run locally
- [x] API endpoints (grouped by resource)
- [x] Data model summaries
- [x] Authentication & middleware behavior
- [x] Notes, caveats, and next steps found by analyzing the code

## Installation

Prerequisites:
- Node.js (v16+ recommended)
- A MongoDB instance (URI)

Steps:

```powershell
# From the project root
npm install
# create a .env file (see below for required variables)
npm run start
```

The repository's `start` script runs `nodemon index.js` (see `package.json`). The server listens on port 5000 by default.

## Environment variables

Create a `.env` file in the project root with these variables (replace example values):

- MONGODB_URI - MongoDB connection string (required)
- SECRET_KEY - JWT secret used by `authMiddleware` (required)
- CLOUD_NAME - Cloudinary cloud name (optional, for uploads)
- API_KEY - Cloudinary API key (optional)
- API_SECRET - Cloudinary API secret (optional)
- NODE_ENV - `production` or `development` (optional)

Notes:
- The code uses `process.env.SECRET_KEY` to sign/verify JWTs (some commented areas mention `JWT_SECRET_KEY` — prefer `SECRET_KEY`).
- Keep `.env` out of version control and add it to `.gitignore`.

## How the server is started

Entry point: `index.js`.

Major middleware configured in `index.js`:
- CORS with origin set to `http://localhost:5173` and credentials enabled
- `body-parser` and `express.json()` / `urlencoded`
- `cookie-parser` for cookie handling

MongoDB connection string is read from `process.env.MONGODB_URI`.

## Authentication

- Login sets an HTTP-only cookie named `token` and also returns an `access_token` in JSON.
- `verifyToken` middleware looks for the token in `req.cookies.token` OR the `Authorization` header with `Bearer <token>`.
- `verifyToken` verifies the token using `process.env.SECRET_KEY`, sets `req.id` and `req.user` and calls `next()`.
- `isAdmin` middleware checks `req.user.role === 'admin'`.
- Some controllers use `isAuthenticated` (which currently only checks cookie token) — this means the code supports both cookie and header flows but a few handlers rely only on cookies.

Security note: Make sure `SECRET_KEY` is a strong random value in production. Configure `secure: true` for the cookie in production behind HTTPS.

## API Reference (summary)

Base path for resources: `/api`

Users (`/api/users`)
- POST /register — Register new user (uses `singleUpload` multer middleware for profile file)
- POST /login — Login and set cookie
- GET /logout — Clear cookie logout
- GET /currentuser — Get current logged-in user (protected: `isAuthenticated`)
- POST /profile/update — Update profile (protected: `isAuthenticated`, supports file upload)
- DELETE /delete — Delete own user (protected)
- GET /getAllUsers — Admin or authenticated endpoint returning users (protected)
- DELETE /delete/:userId — Admin-only delete

Jobs (`/api/jobs`)
- GET /get — Public: list jobs
- GET /get/:id — Public: get specific job
- Protected (requires token via `verifyToken`):
  - POST /review/:id — Add or update review for a job
  - POST /apply/:id — Apply for a job (requires job.status === 'Approved')
  - POST /accept/:id — Accept a job (increments positionsFilled)
  - POST /reject/:id — Reject a job
- Admin-only (requires `isAdmin` after `verifyToken`):
  - GET /admin — Jobs created by admin
  - POST /create — Create job
  - PUT /edit/:id — Edit job
  - DELETE /delete/:id — Delete job
  - PATCH /applications/:jobId/:applicationId — Update application status

Companies (`/api/companies`)
- GET /get — Public: list companies
- GET /get/:id — Public: get specific company
- Admin (protected via `verifyToken` + `isAdmin`): POST /create, PUT /update/:id, DELETE /delete/:id

CV-related endpoints
- CV user (`/api/cvuser`): POST `/` create CV user details, GET `/:userId`, DELETE `/:userId`
- Skills (`/api/skills`): POST `/` (expects JSON with userId, cvId, skills array), GET `/:userId`
- Certificates (`/api/certificates`): POST `/`, GET `/:userId`
- Education (`/api/education`): POST `/`, GET `/:userId`
- Experience (`/api/experience`): POST `/`, GET `/:userId`
- Projects (`/api/projects`): POST `/`, GET `/:userId`
- Referees (`/api/referees`): POST `/`, GET `/:userId`

All the CV sub-resources expect a `userId` and `cvId` in body or in their records and generally return the object stored in the DB.

## Data models (high-level)

User (models/UserModel.js)
- fullname: String
- email: String (unique)
- phoneNumber: Number
- password: String (hashed expected)
- role: 'admin' | 'user' | 'company'
- profile: { bio, skills[], resume, resumeOriginalName, company ref, profilePhoto }

Job (models/jobModel.js)
- title, description, requirements, salary, location
- jobType: Enum
- experienceLevel: Enum
- numberOfPositions, positionsFilled
- company: ObjectId -> Company
- status: 'Pending' | 'Approved' | 'Rejected' | 'Filled'
- createdBy: User ref
- applicationDeadline: Date
- applications[]: {user, status, resume, coverLetter, appliedDate}
- reviews[]: {user, decision, comment, date}

Company (models/companyModel.js)
- name, description, industry, location, website, logo, contactEmail, contactPhone, createdBy

CV-related (models/*)
- `cvUser`, `skills`, `certificates`, `education`, `experience`, `projects`, `referees` contain `userId`, `cvId` and arrays describing each section.

## File uploads

- Multer is used via `middlewares/multer.js` (imported across controllers/routes) for single file uploads.
- `utils/datauri.js` converts uploaded files to data URIs and `utils/cloudinary.js` is configured to upload files to Cloudinary using `CLOUD_NAME`, `API_KEY`, `API_SECRET`.

## Observations & notes from code analysis

1. Default server port is 5000 (hard-coded in `index.js`).
2. CORS origin is restricted to `http://localhost:5173` in `index.js` — update this for production or make configurable.
3. Auth implementation supports both cookie-based and bearer-token header flows via `verifyToken`, but some parts of the code still use `isAuthenticated` (which requires cookie only). Consider standardizing to one method.
4. There are commented blocks and alternative implementations in `controllers/userControllers.js` — the file contains many commented examples which may be cleaned up.
5. `controllers/companyControllers.js` exists but is empty while `controllers/companyController.js` contains the implementation; consider deleting empty duplicate files to avoid confusion.
6. Some commented code references `JWT_SECRET_KEY` whereas the runtime code uses `SECRET_KEY` — standardize on `SECRET_KEY` and update comments.
7. The repository currently contains a `.env` file in the workspace; ensure it is not committed to the public repo. Rotate any credentials that were committed.

## Suggestions / Next steps

- Add a `.gitignore` entry for `.env` if not present.
- Clean up commented/duplicated controller files to reduce maintenance burden.
- Add integration tests for main auth and job flows.
- Add OpenAPI/Swagger docs for machine-readable API reference.

## License

This project uses the ISC license as indicated in `package.json`.

## Contact

If you want me to extend this README with OpenAPI specs, example curl/postman requests, or to scaffold tests and CI, tell me which area you want next.

---

Requirements coverage:
- Redefine README.md with comprehensive documentation — Done (this file).
- Get further insight from analyzing code thoroughly — Done (observations & suggestions above).
