# Universal Lab Website Template

This is a "plug and play" website template for research labs, originally built for the Cui Lab.
It features a dynamic configuration system managed via Sanity CMS, allowing any lab to customize their site without touching code.

## Key Features
- **Dynamic Configuration**: Manage Lab Name, Logo, Social Links, and Contact Info via Sanity (`Site Settings`).
- **Content Types**: Team Members, Research Projects, Publications, News, and Intranet.
- **Intranet**: Built-in inventory and order management system.
- **Tech Stack**: Next.js (App Router), Tailwind CSS, Sanity CMS.

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Setup**:
    Ensure you have `.env.local` configured with your Sanity Project ID and Dataset.
    ```bash
    NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
    NEXT_PUBLIC_SANITY_DATASET=production
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Open Sanity Studio**:
    Go to `/studio` to configure your `Site Settings` and add content.

## Project Structure
- `app/`: Application routes and pages.
- `components/`: Reusable UI components.
- `sanity/`: Sanity configuration and schemas.
- `public/`: Static assets.

