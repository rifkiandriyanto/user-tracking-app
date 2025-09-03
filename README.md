# User Tracking Map Application

An interactive web application that displays simulated real-time user locations on a map. Users can search, filter, and "follow" a specific user, causing the map to automatically center on their movements.

**Live Demo:** [https://user-tracking-app-rifki.vercel.app/](https://user-tracking-app-rifki.vercel.app/)

---

## ✨ Key Features

-   **Map Visualization**: Renders all users as markers on an interactive map powered by Mapbox.
-   **Real-time Search**: Instantly search for users by Name or ID via the search panel.
-   **"Follow" Mode**: Click on a user in the list or on the map to focus and track their movements. The map will automatically pan to keep the followed user centered.
-   **Interactive Panel**: A sidebar that lists all users and allows for easy interaction.
-   **Real-time Updates**: User locations are simulated to move randomly, providing a live tracking experience.
-   **Responsive Design**: Adapts gracefully to various screen sizes.
-   **Light & Dark Theme**: Supports the user's system theme preference.

---

## 🛠️ Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (React Framework)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **State Management**: [Jotai](https://jotai.org/)
-   **Mapping**: [Mapbox GL JS](https://www.mapbox.com/mapbox-gljs) & [React Map GL](https://visgl.github.io/react-map-gl/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Getting Started Locally

Follow these steps to run the project on your local machine.

### Prerequisites

-   Node.js (v18.x or newer)
-   npm, yarn, or pnpm

### 1. Clone the Repository

```bash
git clone https://github.com/rifkiandriyanto/user-tracking-app.git
cd user-tracking-app
```

### 2. Install Dependencies

Choose your preferred package manager:

```bash
npm install
# OR
yarn install
# OR
pnpm install
```

### 3. Set Up Environment Variables

You will need an access token from Mapbox.

1.  Create a free account at [mapbox.com](https://www.mapbox.com/).
2.  Go to your **access tokens page** and copy your *default public token*.
3.  Create a new file in the project root named `.env`.
4.  Copy the following content into the `.env` file and replace `YOUR_MAPBOX_ACCESS_TOKEN` with your actual token.

    ```env
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=YOUR_MAPBOX_ACCESS_TOKEN
    ```

### 4. Run the Development Server

```bash
npm run dev
# OR
yarn dev
# OR
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

---

## 📄 License

This project is licensed under the **MIT License**. See the `LICENSE` file for more details.

---

Crafted with ❤️ by [Rifki Andriyanto](https://github.com/rifkiandriyanto)
