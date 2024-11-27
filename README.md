# Uncle-Ali-Tours

## Motivation

The **Trip Advising Website** was developed as part of the **Advanced Computing Lab (ACL)** course (Code: CSEN704) at the German University in Cairo. This project was inspired by the growing need for efficient and personalized trip planning tools in today's fast-paced world.

Travelers often face challenges in finding trustworthy information, comparing options, and making decisions that fit their preferences and budget. Our project addresses this gap by providing a user-friendly platform that offers recommendations, reviews, and detailed information to simplify the trip planning process.

From an academic perspective, this project serves as an opportunity to apply and integrate knowledge from various domains, including web development, databases, and user experience design. It also demonstrates collaborative skills and best practices in software engineering, such as version control and agile development, while solving a real-world problem.

## Code Style

The project adheres to clean and consistent coding practices tailored to the MERN stack, with **Tailwind CSS** for styling. Below are the key aspects of the code style:

### General
- **Languages Used**:
  - Frontend: React.js (JavaScript/JSX).
  - Backend: Node.js with Express.js.
  - Database: MongoDB with Mongoose.
  - Styling: Tailwind CSS.

- **Formatting**:
  - Indentation: 2 spaces (default for JavaScript/React).
  - Line Length: Maximum of 100 characters for better readability.
  - File Naming:
    - React components: `PascalCase` (e.g., `TripAdvisorCard.js`).
    - Utility functions and hooks: `camelCase` (e.g., `useFetchData.js`).

### Frontend (React.js and Tailwind CSS)
- **Components**:
  - Functional components using hooks (`useState`, `useEffect`, etc.).
  - Components are modular and reusable.

- **Styling with Tailwind CSS**:
  - Use semantic class names provided by Tailwind for styling.
  - Component-specific styles are grouped logically for maintainability.
  - Utility-first approach for rapid UI development.

- **State Management**:
  - Local state managed with React hooks.
  - Global state handled using Context API or a state management library (e.g., Redux).

- **Coding Practices**:
  - Follow **ESLint** with Airbnb configuration for linting.
  - Use **Prettier** for auto-formatting.

### Backend (Node.js and Express.js)
- **API Design**:
  - RESTful APIs with meaningful endpoint names (e.g., `/api/trips` or `/api/users`).
  - Use **Express Router** for modular routes.

- **Middleware**:
  - Separate middleware for authentication, validation, and error handling.

- **Error Handling**:
  - Centralized error handling using `try...catch` blocks and custom error classes.

- **Environment Variables**:
  - Sensitive information (e.g., database URIs, API keys) is stored in a `.env` file and accessed using `dotenv`.

### Database (MongoDB with Mongoose)
- **Schema Design**:
  - Schemas are modular and placed in the `models` directory.
  - Use appropriate data validation and constraints in Mongoose schemas.

- **Queries**:
  - Avoid embedding large documents; use references where appropriate.
  - Use indexes for frequently queried fields.

### Version Control
- **Branching Strategy**:
  - All work was done directly on the `main` branch.
  - While feature branches were not utilized, commit messages were structured to ensure clarity and traceability.

- **Commit Messages**:
  - Followed the [Conventional Commits](https://www.conventionalcommits.org/) specification:
    - `feat`: New feature (e.g., `feat: add trip search functionality`).
    - `fix`: Bug fix (e.g., `fix: resolve crash on login`).
    - `refactor`: Code improvements without changing behavior.
    - `docs`: Documentation updates.

### Tools Used
- **Styling**: Tailwind CSS for utility-first design.
- **Linting**: ESLint (Airbnb Style Guide).
- **Formatting**: Prettier.
- **Version Control**: Git with all development on the `main` branch.

By following these conventions, the project maintains consistency, even when all work is centralized on a single branch.