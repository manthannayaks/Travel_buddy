# Travel Buddy Mobile Application 🌍📱

The ultimate ecosystem linking travelers, locals, and sponsors. Explore the world affordably, socially, and safely from the palm of your hand.

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
- **Mobile App**: React Native, Expo, React Navigation, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Security**: JSON Web Tokens (JWT), Bcrypt.js

---

## 🛠 Prerequisites
Before running the project locally, please ensure that you have the following installed:
1. **[Node.js](https://nodejs.org/en/download/)** (v16.14.0 or above)
2. **[MongoDB](https://www.mongodb.com/try/download/community)** (Running locally via MongoDB Compass, or utilize a MongoDB Atlas Cloud URI).
3. **Expo Go** App installed on your physical iOS or Android device.

---

## ⚙️ How to Start the Project Locally

The project is split into two folders: `backend` (API Server) and `mobile` (React Native app). You must run both concurrently.

### 1. Backend Setup (API & Database)
1. Open your terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install the backend dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Prepare the Environment Variables:
   - Ensure the `.env` file exists inside `/backend`.
   - By default, it connects to a local MongoDB:
     ```env
     PORT=5001
     MONGO_URI=mongodb://localhost:27017/travel_buddy
     JWT_SECRET=supersecretpassword123
     ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   *You should see a message in the console like: "Server running on port 5001".*

### 2. Mobile Setup (React Native App)
1. Open a **new, separate terminal** and navigate to the mobile folder:
   ```bash
   cd mobile
   ```
2. Install the mobile dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Configure the API URL:
   - Go to `mobile/src/services/api.js` and ensure `BASE_URL` points to your computer's local Wi-Fi IP address (e.g., `http://192.168.1.100:5001`). `localhost` will not work on a physical device.
4. Start the Expo development server:
   ```bash
   npx expo start
   ```
5. Run the application:
   - Scan the QR code generated in your terminal using the **Expo Go** app on your smartphone, or press `a` to run on an Android emulator / `i` for iOS simulator.

---

## 🐛 Common Issues and Fixes

### 1. Network Error on Mobile
- **Symptom**: The mobile app loads but fails to login or fetch data, showing a network error.
- **Fix**: Ensure your smartphone and your development laptop are on the exact same Wi-Fi network. Also, verify that `BASE_URL` in `mobile/src/services/api.js` matches your laptop's current local IP address, not `localhost`.

### 2. MongoDB Connection Error
- **Symptom**: The backend server crashes immediately upon running.
- **Fix**: Ensure that your local MongoDB instance is running. If on macOS, run `brew services start mongodb-community`.
