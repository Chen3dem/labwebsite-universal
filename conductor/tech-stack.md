# Tech Stack: The CUI Lab Website

This document outlines the primary technologies used to build and maintain the CUI Lab website.

## 1. Core Framework & Language

-   **Framework:** **Next.js (App Router)** - A React-based framework for building high-performance web applications with server-side rendering and static site generation.
-   **Language:** **TypeScript** - A typed superset of JavaScript that enhances code quality, maintainability, and developer productivity.

## 2. Frontend & Styling

-   **Styling:** **Tailwind CSS (v4)** - A utility-first CSS framework for rapid UI development and consistent styling.
-   **Icons:** **Lucide React** - A clean and consistent icon library for React applications.
-   **UI Utilities:**
    -   `clsx`: A tiny utility for constructing `className` strings conditionally.
    -   `tailwind-merge`: Efficiently merges Tailwind CSS classes without style conflicts.

## 3. Content Management System (CMS)

-   **CMS:** **Sanity.io** - A headless CMS that provides a highly customizable content platform and an intuitive editing interface (Sanity Studio) for lab members to manage website content.

## 4. Testing Framework

-   **Testing Framework:** **Vitest** - A Vite-native unit test framework.
-   **UI Testing:** **React Testing Library** - For testing React components.
-   **DOM Environment:** **jsdom** - A pure-JavaScript implementation of many web standards.

## 5. Development & Tooling

-   **Linting:** **ESLint** - For maintaining code quality and adhering to project standards.
-   **Version Control:** **Git** - For source code management and collaboration.
-   **Package Management:** **npm** - For managing project dependencies.