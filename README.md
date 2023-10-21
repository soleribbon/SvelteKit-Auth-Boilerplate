<div align="center">

# 💃 Personal Dashboard Application 💃
### By VITO SOFTWARE aka Ravi

![Svelte](https://img.shields.io/badge/Svelte-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-FF5733?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Bulma](https://img.shields.io/badge/Bulma-00D1B2?style=for-the-badge&logo=bulma&logoColor=white)

</div>

---

## 🌐 Overview

This is a personal dashboard boilerplate app made with **SvelteKit** and **Supabase**. It offers a myriad of features like user authentication, server-side data fetching, and a simple starting point for a user dashboard. Moreover, it's styled using **Tailwind CSS** and **Bulma CSS** .

---

## 🚀 Getting Started

### Steps

1. **Clone the repository** to your local machine.
   ```bash
   git clone https://github.com/soleribbon/SvelteKit-Auth-Boilerplate.git

2. **Navigate to the project folder** and **install the dependencies**.
   ```bash
   cd personal
   npm install

3. **Start the development server**.
npm run dev -- --host

*Note: The --host flag makes your application accessible to any device on your local network.*

## 🎨 Features

### 🔒 User Authentication

- Handles user sign-up, sign-in, and password reset functionality.
- Leverages Supabase's authentication services.
- Compatible with Google + GitHub authentication 
- 📂 **Related Code**: `src/routes/(app)/+page.server.js`

### 📊 Dashboard

- Displays server-side fetched data for authenticated users.
- 📂 **Related Code**: `src/routes/(app)/dashboard/+page.svelte`

### 🎨 Styling

- Styled using Tailwind CSS.
- 📂 **Related Code**: `tailwind.config.js`

### 🧪 Testing

- End-to-end testing enabled with Playwright.
- 📂 **Related Code**: `playwright.config.js` and `tests/test.js`

---

## 📜 Scripts

```bash
npm run dev -- --host  # Starts the development server
npm run test          # Runs the Playwright tests
npm run lint          # Checks the format of the code
npm run format        # Automatically formats the code
