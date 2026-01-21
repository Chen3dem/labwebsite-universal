# Implementation Plan - Track: Initialize Core Structure & Sanity CMS

## Phase 1: Environment Configuration & Styling [checkpoint: bcbf655]
- [x] Task: Clean up default Next.js boilerplate (remove default page content, reset global.css). 9d394b7
- [x] Task: Configure Tailwind CSS with CU Anschutz brand colors (Gold #CFB87C, Black #000000) in `tailwind.config.ts`. 91b84de
- [x] Task: Configure project fonts (e.g., using `next/font`) to align with the "Professional & Traditional" aesthetic. d5634cc
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Environment Configuration & Styling' (Protocol in workflow.md)

## Phase 2: Sanity.io Setup & Schema Definition
- [x] Task: Install Sanity client and dependencies (`next-sanity`, `sanity`). d3aa905
- [ ] Task: Initialize Sanity configuration (`sanity.config.ts`, `sanity.cli.ts`) and environment variables.
- [ ] Task: Create schema for `researchProject` (title, slug, summary, image, description).
- [ ] Task: Create schema for `publication` (title, authors, journal, year, link).
- [ ] Task: Create schema for `teamMember` (name, role, bio, headshot).
- [ ] Task: Create schema for `newsPost` (title, date, body).
- [ ] Task: Verify Sanity Studio is working and schemas are correct by creating dummy data.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Sanity.io Setup & Schema Definition' (Protocol in workflow.md)

## Phase 3: Core UI Components
- [ ] Task: Create a responsive `Navbar` component with links to all main sections.
- [ ] Task: Create a `Footer` component with contact info and copyright.
- [ ] Task: Update the root `Layout` to include the Navbar and Footer.
- [ ] Task: Create a basic utility function to fetch data from Sanity.
- [ ] Task: Update the Home page to display a "Hello CUI Lab" message and fetch one item from Sanity (e.g., a news post) to verify integration.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Core UI Components' (Protocol in workflow.md)
