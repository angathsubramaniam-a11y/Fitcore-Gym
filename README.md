# FitCore - Gym Management Platform

FitCore is a comprehensive, multi-platform gym management system designed to streamline operations for gym administrators, empower personal trainers, and enhance the fitness journey for gym members. Built with a modern web and mobile tech stack, it provides specialized dashboards and tools for all roles within a fitness center.

## 🚀 Features

### 👑 Admin Features
- **Member Management**: Add, update, and manage member profiles.
- **Trainer Management**: Manage trainer profiles and assign trainers to members.
- **Fee Tracking**: Track payments, membership renewals, and overdue fees.
- **Support HQ**: Address member queries and support tickets.
- **Dashboard Analytics**: Gain insights into gym performance, member growth, and revenue.

### 🏋️‍♂️ Trainer Features
- **Client Overview**: View assigned members and their progress.
- **Workout & Diet Plans**: Create, assign, and track personalized workout routines and nutrition plans.
- **Client Communication**: Respond to queries from assigned members via the Support HQ.

### 🏃 Member Features
- **Personal Dashboard**: Track workouts, diets, and membership status.
- **Support HQ**: Submit queries directed to the gym administration or assigned trainers.
- **Mobile-Friendly**: Seamlessly accessible via web or mobile devices.

## 🛠 Tech Stack

**Frontend:**
- [React.js](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) (Animations)
- [Recharts](https://recharts.org/) (Data Visualization)
- [Capacitor](https://capacitorjs.com/) (Cross-platform mobile wrapper for iOS & Android)

**Backend:**
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Supabase](https://supabase.com/) (PostgreSQL Database & Authentication)
- [JWT](https://jwt.io/) (JSON Web Tokens for secure authentication)

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- A Supabase account and project

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory.
2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory and configure the following variables:
   ```env
   # Server Port
   PORT=5000

   # Supabase Configuration
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_KEY=your_supabase_service_role_key

   # JWT Secret for Authentication
   JWT_SECRET=your_jwt_secret_key
   ```

### Running the Application

This project is configured to run both the frontend (Vite) and backend (Express) concurrently.

- **Start both Development Servers**:
  ```bash
  npm run dev
  ```
  This will start the backend server on the configured port (default 5000) and the frontend on the Vite default port (usually 5173).

- **Start Frontend only**:
  ```bash
  npm run dev:frontend
  ```

- **Start Backend only**:
  ```bash
  npm run dev:backend
  ```

## 📱 Mobile Build (Capacitor)

FitCore is mobile-ready out of the box using Capacitor.

1. **Build the web assets**:
   ```bash
   npm run build
   ```
2. **Sync with native platforms**:
   ```bash
   npx cap sync
   ```
3. **Open Android Studio or Xcode**:
   ```bash
   npx cap open android
   # or
   npx cap open ios
   ```

## 📁 Project Structure

The project has been unified into a single repository for easier management:
- `src/` - React frontend application (Pages, Components, Context, Hooks).
- `routes/` - Express backend API routes (auth, members, trainers, workouts, diet, fees, support).
- `server.js` - Main entry point for the Express backend.
- `android/` & `ios/` - Capacitor native projects.

## 📄 License

This project is licensed under the MIT License.
