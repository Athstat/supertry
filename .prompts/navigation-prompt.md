**Objective:**  
Implement a fixed bottom navigation bar for our mobile app with exactly three navigation options: **Dashboard (Home)**, **Leagues**, and **My Teams**. This component should provide smooth visual feedback (ripple effects and color transitions) when icons are tapped and integrate with our existing dark/light theme.

**Technical Requirements:**

- **Tech Stack:**

  - **React 18.3.1 with TypeScript:** Use functional components and React hooks (e.g., `useState`) to manage the active navigation state.
  - **Vite 5.4.2:** Ensure compatibility with our build environment.
  - **Tailwind CSS 3.4.1:** Utilize Tailwind utility classes for styling, responsiveness, and transitions.
  - **Lucide React:** Use appropriate icons for each navigation option:
    - **Dashboard (Home):** e.g., `HomeIcon`
    - **Leagues:** an icon that represents grouping or competition (choose an appropriate Lucide icon)
    - **My Teams:** an icon that represents teams or personalization

- **Component Details:**
  - **Location:** Place the new component (e.g., `<BottomNav />`) in the `/src/components/` directory.
  - **Navigation Layout:**
    - The navigation bar must be fixed to the bottom of the screen.
    - Display three icon-based options, evenly spaced.
    - Implement visual feedback for user interaction:
      - **Ripple Effects:** Create a ripple effect on tap.
      - **Color Transitions:** Apply smooth color transitions when an icon is activated/tapped.
  - **Theme Support:** Integrate with our custom `ThemeContext` to ensure proper dark/light theme compatibility.
  - **State Management:**
    - Use React’s state hooks to keep track of the currently active navigation option.
    - Update the UI accordingly based on the active state.

**Design & UX Considerations:**

- The component must be mobile-friendly and responsive across various screen sizes.
- Visual animations (ripple effects and color transitions) should be subtle yet noticeable to provide an engaging user experience without degrading performance.
- Follow our existing coding conventions and project structure.

**Additional Instructions:**

- Use Tailwind’s built-in transition classes for smooth animations.
- Ensure that the code is clean, well-commented, and adheres to our ESLint and TypeScript guidelines.
- Provide a brief reasoning section explaining your approach before finalizing the component implementation.

**Output:**  
A fully functional React component for the bottom navigation bar that meets the above requirements. The component should be ready to integrate into our existing project structure.

---

**Note:**  
This prompt is crafted to include all the necessary context about our tech stack, design requirements, and file layout. Please ensure the solution aligns with our established project architecture and follows best practices for AI-assisted coding as outlined in the .cursorrules file
