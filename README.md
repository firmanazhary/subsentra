# SubSentry 🛡️
> **Your Money, Under Control.**  
> Smart Subscription Manager, Savings Simulator, and Investment Growth Tracker.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)

---

## 🌟 Overview

**SubSentry** is a modern, high-performance fintech personal finance dashboard tailored for tracking recurring subscriptions, discovering smart cost-cutting opportunities, and visualizing how saved funds can grow over time through compound investment.

Built for global audiences with specialized focus on **United States**, **Japan**, and **Indonesia**, SubSentry provides native localization and official regional pricing models for 350+ subscription services.

---

## ✨ Key Features

### 1. 🌐 Multi-Currency & 3-Language Internationalization (i18n)
* **Target Regions**:
  * 🇺🇸 **United States**: English (`en`) · US Dollar (`USD`, `$`)
  * 🇯🇵 **Japan (日本)**: Japanese (`ja`) · Japanese Yen (`JPY`, `¥`)
  * 🇮🇩 **Indonesia**: Indonesian (`id`) · Indonesian Rupiah (`IDR`, `Rp`)
* **Official Regional Pricing**: Prices automatically adapt to authentic local pricing (e.g. Netflix: **$19.99** / **¥1,980** / **Rp 186.000**) rather than inaccurate raw currency conversions.
* **Smart Currency Adaptation**: Switching currencies in the header dynamically recalculates all active subscriptions and preserves custom price adjustments proportionately.

### 2. 📚 350+ Subscriptions Catalog & UI-Friendly Pagination
* **350+ Services Catalog**: Spanning 24+ categories (Streaming, Music, AI Tools, Developer, Gaming, Education, Fitness, Finance, and more).
* **Smart Pagination**: View 12, 24, or 48 services per page with smooth-scroll navigation and result counters.
* **Region Tabs**: Filter by `🌐 Global`, `🇺🇸 United States`, `🇯🇵 Japan`, or `🇮🇩 Indonesia`.
* **Category Pills**: Horizontally scrollable chips with live item count badges (e.g. `Streaming (47)`).
* **Search & Sort**: Real-time search with instant clear button (`X`) and multi-mode sorting (Name A–Z / Z–A, Price Low–High / High–Low).
* **Dual-Tab Workflow**: Seamlessly switch between **Browse Catalog** and **Selected Subscriptions**, with a quick `Clear All` reset button.

### 3. ⏱️ Live Real-Time Overview & Dashboard
* **Real-Time Clock**: Live ticking clock with localized weekday, date, and pulsating live status indicator.
* **Key Metrics**: Instant monthly recurring costs, projected annual spend, active subscription count, and potential monthly savings.
* **Interactive Spending Chart**: Visual category distribution powered by Recharts with localized tooltips.

### 4. 💡 Smart Spending Insights
* Automatic detection of your **highest-cost subscription**.
* Category concentration alerts (warns when a single category exceeds 40% of budget).
* **Overlapping Services Detection**: Identifies redundant subscriptions within the same category (e.g. multiple streaming or AI platforms).
* Actionable, localized recommendations in English, Japanese, and Indonesian.

### 5. 🐷 Savings Simulator
* Selectively toggle subscriptions you are considering cancelling.
* Calculates exact monthly and annual savings and remaining budget after cancellation.
* Safe sandbox: simulates savings without contacting service providers or modifying real accounts.

### 6. 📈 Investment Growth Compound Interest Simulator
* Demonstrates how recurring monthly subscription savings can compound into wealth.
* Customizable monthly contribution (adaptive to USD, JPY, and IDR scales).
* Adjustable assumed annual return (0%–15%) and flexible duration (1, 3, 5, 10, 15, 20 years).
* Dual-series Recharts projection comparing total principal contributed against estimated investment growth.

### 7. 🌓 Dark Mode & Light Mode
* Persistent theme preference saved in `localStorage`.
* Seamless Tailwind CSS v4 class-based switching with dedicated toggle located in the sidebar.

### 8. 📱 100% Responsive Design
* **Mobile & Tablet**: Sticky top navigation with brand logo, slide-over drawer sidebar with backdrop blur, and auto body-scroll lock.
* **Desktop**: Fixed left navigation bar with fluid responsive content margins.

---

## 🛠️ Tech Stack

* **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
* **Library**: [React 19](https://react.dev/)
* **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Charts**: [Recharts](https://recharts.org/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Storage**: Browser LocalStorage with automatic state sanitization and migration

---

## 📁 Project Structure

```
subsentry/
├── app/
│   ├── favicon.ico
│   ├── icon.png                 # 32x32 Favicon
│   ├── apple-icon.png           # 180x180 Apple Touch Icon
│   ├── globals.css              # Tailwind CSS v4 variables & custom variants
│   ├── layout.tsx               # Root layout with Theme, I18n & Sub Providers
│   ├── page.tsx                 # Overview Dashboard
│   ├── subscriptions/page.tsx   # Subscription Management & Catalog
│   ├── savings/page.tsx         # Savings Simulator
│   ├── insights/page.tsx        # Spending Insights & Smart Recommendations
│   └── investment/page.tsx      # Compound Interest Investment Simulator
├── components/
│   ├── header.tsx               # Header with Live Clock & Region/Currency Selector
│   ├── sidebar.tsx              # Sidebar with Theme Toggle & Mobile Drawer
│   ├── stat-card.tsx            # Metric Card
│   ├── spending-chart.tsx       # Category Breakdown Chart
│   ├── subscription-list.tsx    # Active Subscriptions List
│   └── subscription-selector.tsx# 350+ Paginated Catalog & Selected Manager
├── context/
│   ├── theme-context.tsx        # Dark/Light Mode Provider
│   ├── i18n-context.tsx         # 3-Language & 3-Currency State & Translations
│   └── subscription-context.tsx # Subscriptions State, Persistence & Price Migration
├── data/
│   └── subscriptions.ts         # 350+ Subscriptions with Regional Pricing
├── lib/
│   ├── calculations.ts          # Budget & Spending Calculation Utilities
│   ├── insights.ts              # Recommendation & Categorization Logic
│   └── investment.ts            # Compound Growth Series Calculations
├── types/
│   ├── i18n.ts                  # Language & Currency Types & Exchange Configs
│   └── subscription.ts          # Subscription & Category Open Union Types
└── public/
    └── images/
        └── logo_subsentri.png   # Official Brand Logo
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.18.0 or newer
* **npm**, **yarn**, **pnpm**, or **bun**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/firmanazhary/subsentry.git
   cd subsentry
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

### Available Scripts

* `npm run dev` - Start local development server with Turbopack
* `npm run build` - Build production bundle
* `npm run start` - Start production server
* `npm run lint` - Run ESLint checks
* `npx tsc --noEmit` - Run TypeScript compiler verification

---

## 📄 License

This project is licensed under the MIT License.
