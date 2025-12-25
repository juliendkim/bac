# BAC (Blood Alcohol Concentration) Calculator

[ English ](./README.en.md) | [ 한국어 ](./README.md)

This project is a web application that estimates Blood Alcohol Concentration (BAC) based on the Widmark formula, taking into account the user's gender, weight, amount of alcohol consumed, and time elapsed.

> **⚠️ Disclaimer:** The calculation results provided by this service are **estimates** based on the Widmark formula. Actual values may vary depending on individual constitution, food intake, etc., and cannot be used as legal evidence. Never drive after drinking.

---

## Key Features

- **Widmark Formula Calculation:** Precise estimation considering gender, weight, drink type, amount consumed, alcohol percentage (ABV), and time elapsed.
- **Various Drink Types:** Provides presets for Somaek, Soju, Beer, Makgeolli, Liquor, etc., and allows custom ABV input.
- **Real-time Status Visualization:** Instantly displays legal status (Normal, Caution, Suspension, Cancellation) with colors and icons based on BAC levels.
- **Interactive Gauge:** Provides an intuitive visual gauge to see current status at a glance.
- **Dark Mode Support:** Stylish UI tailored to the user environment (based on Tailwind CSS).
- **PWA (Progressive Web App):** Can be installed like an app for easy offline use.

## Tech Stack

- **Frontend:** React 19, Lucide React (Icons)
- **Styling:** Tailwind CSS 4
- **Build Tool:** Vite
- **PWA:** Vite Plugin PWA

---

## Installation and Usage

### Requirements
- [Node.js](https://nodejs.org/) (Version 18+ recommended)
- npm or yarn

### 1. Clone Repository
```bash
git clone git@github.com:juliendkim/bac.git
cd bac
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
After running, access `http://localhost:5173` in your browser.

### 4. Lint Code
```bash
npm run lint
```

### 5. Build and Deploy
```bash
npm run build
```
The static files generated in the `dist` folder can be deployed to a server.

---

## How to Use

1. **Enter User Info:** Select your weight and gender.
2. **Select Drink Data:** Choose the type of drink and enter the number of glasses. You can manually adjust the ABV (%) if necessary.
3. **Set Elapsed Time:** Adjust the slider to set the time passed since drinking.
4. **Check Results:** View the estimated BAC level and corresponding legal status on the right dashboard.
5. **Reset:** Click the refresh icon in the top right to reset all inputs to their initial state.

---

## Relevant Laws (Based on South Korean Road Traffic Act)

- **0.03% ~ less than 0.08%:** License Suspension (100 days)
- **0.08% or higher:** License Cancellation

---

## Created by

- **Dee Kim**
- School of Computer Software, Daegu Catholic University (대구가톨릭대학교 컴퓨터소프트웨어학부)
- Email: [deekim@cu.ac.kr](mailto:deekim@cu.ac.kr)

---

## License
This project is distributed under the MIT License.