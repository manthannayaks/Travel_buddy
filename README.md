# Travel Buddy Web Application 🌍

The ultimate ecosystem linking travelers, locals, and sponsors. Explore the world affordably, socially, and safely.

## 🚀 Features
- **User Authentication**: Secure JWT-based Login and Registration.
- **Travel Matching**: Find travelers going to the exact same destination right when you are.
- **Local Buddy System**: Search and connect with verified local guides.
- **Sponsored Travel**: Apply to curated content creation opportunities funded by top brands.
- **Skill Exchange**: Trade your talents (photography, coding) for accommodation or local tours.
- **Budget Splitter**: Interactive utility to log and evenly divide trip expenses among groups.
- **Medical Safety Panel**: A quick-access dashboard for emergency data, nearby mock hospitals, and essential first aid guides.

---

## 💻 Tech Stack
- **Frontend**: React.js 18, React Router v6, Tailwind CSS v3, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Security**: JSON Web Tokens (JWT), Bcrypt.js

---

## 🛠 Prerequisites
Before running the project locally, please ensure that you have the following installed:
1. **[Node.js](https://nodejs.org/en/download/)** (v16.14.0 or above)
2. **[MongoDB](https://www.mongodb.com/try/download/community)** (Running locally via MongoDB Compass, or utilize a MongoDB Atlas Cloud URI).

---

## ⚙️ How to Start the Project Locally

The project is split into two folders: `frontend` and `backend`. You must run both concurrently.

### 1. Backend Setup (API & Database)
1. Open your terminal and navigate to the backend folder:
   ```bash
   cd Travel_buddy/backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Prepare the Environment Variables:
   - Ensure the `.env` file exists inside `/backend`.
   - By default, it connects to a local MongoDB:
     ```env
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/travel_buddy
     JWT_SECRET=supersecretpassword123
     ```
   - If using MongoDB Atlas, replace `mongodb://localhost:27017/travel_buddy` with your Atlas connection string.
4. Start the backend server:
   ```bash
   npm run dev
   ```
   *You should see two messages in the console: "Server running on port 5000" and "MongoDB Connected".*

### 2. Frontend Setup (React UI)
1. Open a **new, separate terminal** and navigate to the frontend folder:
   ```bash
   cd Travel_buddy/frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the application:
   - Command line will output the local network URL. Click it or manually go to `http://localhost:5173/` in your browser.

---

## 🐛 Common Issues and Fixes

During testing or setup, you might encounter the following common issues:

### 1. MongoDB Connection Error (`MongoNetworkError`)
- **Symptom**: The backend server crashes immediately upon running `npm run dev` with a connection refused error.
- **Fix**: Ensure that your local MongoDB instance is actually running on your machine (usually as a background service). If on macOS, you can run `brew services start mongodb-community`. If using Atlas, ensure your IP address is whitelisted in the Network Access tab.

### 2. CORS Errors in the Browser Console
- **Symptom**: You trigger an API call from the frontend, but it fails, and Google Chrome DevTools displays a CORS Policy blockade.
- **Fix**: The backend uses the `cors` npm package correctly in `server.js`. Check that `frontend/src/services/api.js` points to the correct backend host (`http://localhost:5000`). If your backend restarted on a different port like `5001`, you must update the `baseURL` inside `api.js`.

### 3. "Not authorized, token failed" / Users getting logged out
- **Symptom**: Features like Travel Matching or Applying for Sponsorship fail with a 401 Unauthorized error in the console.
- **Fix**: Your JWT may have expired due to time or you altered the `JWT_SECRET`. To fix, clear your browser's Local Storage or simply click **Log Out** and sign back in to generate a fresh token payload.

### 4. Screens show "No guides found" or "No opportunities found"
- **Symptom**: The UI appears blank on specific routes because your local mongo database is entirely fresh and empty.
- **Fix**: We've included **Seed Demo Data** buttons on the Local Buddy and Sponsored Travel dashboards. Click these buttons to instruct the API to automatically populate your local MongoDB with realistic mock data! For Travel Matching, you'll need to create a test user via Signup, log dummy trips, and match against them.

---

## 🔮 Future Improvements (Performance)
1. Added database indexes for `destination` (Trips) and `location` (Guides) to dramatically improve search filtering at scale.
2. Global custom error handling middleware injected to maintain predictable modular responses.
