# Track Specification: Initialize Core Structure & Sanity CMS

## 1. Overview
This track focuses on establishing the foundational infrastructure for the CUI Lab website. It involves configuring the Next.js environment with the defined technology stack, setting up the global visual identity (CU Anschutz colors), and integrating Sanity.io as the Headless CMS.

## 2. Goals
-   **Environment Setup:** Ensure Next.js, Tailwind CSS, and TypeScript are correctly configured.
-   **Branding Implementation:** Apply the CU Anschutz color palette (CU Gold & Black) and typography to the global Tailwind configuration.
-   **CMS Integration:** Connect the application to Sanity.io and establish the core content schemas.
-   **Core UI:** Implement the global layout, including a responsive Navbar and Footer.

## 3. Requirements

### 3.1 Styling & Theming
-   **Colors:** Configure Tailwind `theme.extend.colors` with:
    -   `cu-gold`: `#CFB87C` (Primary)
    -   `cu-black`: `#000000` (Secondary)
    -   `cu-gray`: Define a neutral gray palette for UI elements.
-   **Typography:** Configure fonts to match the "Professional & Traditional" aesthetic (e.g., Inter or Roboto for sans-serif, Merriweather or Lora for serif).

### 3.2 Sanity CMS Schemas
Define the following document types in Sanity:
-   **`researchProject`**:
    -   `title` (string)
    -   `slug` (slug)
    -   `summary` (text)
    -   `mainImage` (image)
    -   `description` (array/block content)
-   **`publication`**:
    -   `title` (string)
    -   `authors` (array of strings or references to team members)
    -   `journal` (string)
    -   `year` (number)
    -   `link` (url)
    -   `category` (string: "Research", "Review", etc.)
-   **`teamMember`**:
    -   `name` (string)
    -   `role` (string: "PI", "Postdoc", "PhD Student", etc.)
    -   `bio` (text)
    -   `headshot` (image)
-   **`newsPost`**:
    -   `title` (string)
    -   `publishedAt` (datetime)
    -   `body` (block content)

### 3.3 Core Components
-   **`Navbar`**: Responsive navigation bar with links to: Home, Research, Team, Publications, News, Contact.
-   **`Footer`**: Footer containing lab address, contact info, and copyright.

## 4. Acceptance Criteria
-   [ ] Next.js app builds without errors.
-   [ ] Tailwind config includes `cu-gold` and `cu-black`.
-   [ ] Sanity Studio is accessible and allows creating/editing Research, Publication, Team, and News items.
-   [ ] Frontend can fetch and display a simple list of items (e.g., latest news) to verify the connection.
