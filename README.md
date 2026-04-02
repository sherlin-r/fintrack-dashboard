<<<<<<< HEAD
# 💰 FinTrack – Finance Dashboard

## 📌 Overview

FinTrack is a **modern finance dashboard web application** designed to help users track financial activity, analyze spending patterns, and manage transactions efficiently.

This project was **originally developed earlier as a personal project** and has been **enhanced and refined specifically for this assignment** by incorporating additional features, improved UI/UX, and better state handling as per the given requirements.



## 🎯 Objective

The goal of this project is to demonstrate:

* Frontend design thinking
* Component structuring
* State management
* User experience considerations
* Handling and visualization of financial data

---

## 🚀 Features

### 📊 Dashboard Overview

* Summary cards:

  * Total Balance
  * Total Income
  * Total Expenses
* Time-based visualization (monthly income vs expense)
* Category-based visualization (spending breakdown)
* Net balance trend

---

### 💳 Transactions Section

* View all transactions with:

  * Date
  * Description
  * Category
  * Amount
  * Type (Income/Expense)
* Features:

  * Search functionality
  * Filtering (category/type)
  * Sorting (date/amount)
* Admin actions:

  * Add transaction
  * Edit transaction
  * Delete transaction (with confirmation)

---

### 🔐 Role-Based UI (Simulated)

* **Viewer**

  * Read-only access
* **Admin**

  * Can add, edit, and delete transactions
* Role switching implemented via UI toggle

---

### 📈 Insights Section

* Highest spending category
* Monthly comparison (current vs previous)
* Savings rate calculation
* Visual indicators for financial trends

---

### 💾 State Management

* Managed using React Hooks (`useState`, `useMemo`, `useEffect`)
* Efficient filtering and derived data computation
* Clean separation of UI and logic (within component structure)

---

### 💡 Data Persistence

* Transactions and role are stored using **localStorage**
* Ensures data remains after page refresh

---

### 🎨 UI/UX Highlights

* Clean and modern dashboard layout
* Responsive design for different screen sizes
* Interactive elements with visual feedback
* Empty states and confirmations handled
* Smooth and intuitive navigation

---

## 🛠️ Tech Stack

* **Frontend Framework:** React (Vite)
* **Language:** JavaScript
* **Styling:** Custom CSS (inline + global styles)
* **State Management:** React Hooks
* **Data Handling:** Local mock data + localStorage

---

## 📂 Project Structure

src/

* App.jsx (Main application logic and UI)
* data/ (mock data and constants)

> Note: The project is structured to keep logic organized and readable while maintaining simplicity for demonstration purposes.

---

## ⚙️ Setup Instructions

1. Clone the repository:

```bash
git clone <your-repo-link>
cd finance-dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open in browser:

```
http://localhost:5173
```

---

## 📌 Assumptions

* Data is handled on the frontend using mock data
* Role-based access is simulated for demonstration purposes
* No backend or authentication is implemented

---

## ✨ Enhancements Made for This Assignment

* Added role-based UI behavior
* Implemented filtering, sorting, and search
* Added insights and analytics section
* Integrated localStorage for persistence
* Improved UI structure and user experience

---

## 🧠 Conclusion

This project reflects a practical approach to building a **scalable and user-friendly frontend dashboard**, focusing on clarity, usability, and meaningful data representation rather than unnecessary complexity.

---
=======
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
>>>>>>> fee5dfa (Finance Dashboard project with role-based UI and insights)
