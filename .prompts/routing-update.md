**Objective:**  
Refactor the app's navigation system by replacing the current state-based navigation with a standard React Router implementation. This update should cover the main App.tsx file and the Bottom Navigation component.

**Technical Requirements:**

- **React Router Integration:**

  - Add `react-router-dom` to the project if not already present.
  - Wrap the app with `<BrowserRouter>` (typically in the root file, e.g., index.tsx).
  - Replace the current state-based navigation in App.tsx with React Router’s `<Routes>` and `<Route>` components.
  - **Important:** Consult the latest React Router documentation:
    - [Installation Docs](https://reactrouter.com/start/framework/installation) :contentReference[oaicite:0]{index=0}
    - [Home Page](https://reactrouter.com/start/home) :contentReference[oaicite:1]{index=1}
      This will ensure correct installation, configuration, and usage of the most recent APIs.

- **Route Mapping:**

  - Define routes for each screen:
    - `/dashboard` – Dashboard/Home screen (the main view)
    - `/join-league` – Join League Screen
    - `/create-team` – Team Creation Screen
    - `/review-team` – Review Team Screen
    - `/league` – League Screen
  - Set up the default route (e.g., `/` should redirect to `/dashboard`).

- **Update App.tsx:**

  - Remove the conditional rendering based on the `activeScreen` state.
  - Instead, render different screen components based on the current route using `<Routes>` and `<Route>`.
  - Ensure that the rest of the layout (such as the Header and global styling) remains consistent across screens.
  - Include a brief explanation at the top of App.tsx about the routing approach used.

- **Update Bottom Navigation Component:**
  - Modify the `<BottomNav />` component to use React Router for navigation:
    - Replace direct state updates with React Router navigation methods, such as using the `<Link>` component or the `useNavigate` hook.
    - The Bottom Navigation should include three options:
      - **Dashboard (Home)**
      - **Leagues**
      - **My Teams**
    - Ensure the component provides visual feedback (ripple effects and color transitions) on tap, as specified.
- **Tech Stack and File Structure:**
  - **Tech Stack:** React 18.3.1 with TypeScript, Vite 5.4.2, Tailwind CSS 3.4.1, Lucide React.
  - **Project Structure:** Follow the existing project organization (e.g., `/src/components/`, `/src/screens/`, etc.).
  - **Styling:** Use Tailwind CSS for responsive design and transitions, ensuring compatibility with our custom ThemeContext for dark/light theme support.

**Additional Instructions:**

- Ensure that the implementation is fully type-safe and adheres to our ESLint and TypeScript guidelines.
- Provide clear code comments and structure the code to fit our component-based architecture.
- Test navigation across all screens to ensure a seamless user experience with proper visual feedback on navigation actions.

**Output:**  
A refactored version of the main App.tsx file and the Bottom Navigation component that uses React Router for navigation. The updated code should handle all screen transitions via routes, integrating smoothly into our existing project architecture.

---

**Note:**  
This prompt includes all necessary context regarding our tech stack, file structure, and design requirements. Please ensure that the refactored navigation system fully aligns with these guidelines and follows the current best practices as outlined in the [React Router Installation Docs](https://reactrouter.com/start/framework/installation) :contentReference[oaicite:2]{index=2} and [React Router Home Page](https://reactrouter.com/start/home) :contentReference[oaicite:3]{index=3}.
