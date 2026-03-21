# Welspun AWD – Textile Management System

Advanced Warehouse & Distribution (AWD) portal for Welspun textile operations.

## Features
- **Login** – Secure authentication with plant selection
- **Dashboard** – KPI overview, production trend chart, category mix, recent orders
- **Orders** – Full order list with status filtering, search, and new-order modal
- **Stock** – Fabric inventory with fill-level progress bars, reorder alerts, category filters
- **Reports** – Revenue analytics, plant efficiency, dispatch vs production charts, top customers

## Stack
- React 18 (Create React App)
- Recharts (charts)
- Lucide React (icons)
- Pure CSS variables for theming (dark industrial aesthetic)

## Getting Started
```bash
npm install
npm start
```
App runs on http://localhost:3000

## Login
- Email: admin@welspun.com
- Password: any 4+ characters (e.g. `admin123`)

## Folder Structure
```
welspun-awd/
├── public/index.html
├── src/
│   ├── App.js           ← routing & auth gate
│   ├── App.css          ← global design tokens & utilities
│   ├── index.js
│   ├── components/
│   │   ├── Sidebar.js
│   │   └── Layout.js
│   └── pages/
│       ├── Login.js
│       ├── Dashboard.js
│       ├── Orders.js
│       ├── Stock.js
│       └── Reports.js
└── package.json
```
