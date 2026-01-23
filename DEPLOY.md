# Deployment Guide: Cui Lab Website

This guide will walk you through deploying your **Next.js** website and **Sanity Studio** to production. We recommend using **Vercel** as it is the creators of Next.js and offers the seamless integration.

## Prerequisites

1.  **GitHub Account**: Ensure your code is pushed to a GitHub repository.
2.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com) using your GitHub account.

---

## Step 1: Create and Push to GitHub

Since this is a new project, follow these steps to upload it to GitHub:

1.  **Create a Repository on GitHub**:
    *   In the top-right corner of any GitHub page, select the **+** dropdown menu and click **New repository**.
    *   **Repository name**: `cui-labwebsite`.
    *   Select **Private**.
    *   **Do NOT** initialize with README, .gitignore, or License (leave these unchecked).
    *   Scroll to the bottom of the form and click the green **Create repository** button.

2.  **Push your code**:
    Open your terminal in the project folder and run these commands one by one:

    ```bash
    # Initialise git (if not already done)
    git init

    # Add all files
    git add .

    # Commit changes
    git commit -m "Initial commit of Cui Lab Website"

    # Link to your new GitHub repo (Replace YOUR_USERNAME with your actual GitHub username)
    git remote add origin https://github.com/YOUR_USERNAME/cui-labwebsite.git

    # Push to main branch
    git branch -M main
    git push -u origin main
    ```

---

## Step 2: Deploy to Vercel

1.  Go to your **Vercel Dashboard**.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your `cui-labwebsite` repository from GitHub.
4.  **Configure Project**:
    *   **Framework Preset**: Next.js (should detect automatically)
    *   **Root Directory**: `./` (default)
    *   **Environment Variables**:
        You need to add the Sanity variables here. Copy them from your local `.env.local` file:
        *   `NEXT_PUBLIC_SANITY_PROJECT_ID`
        *   `NEXT_PUBLIC_SANITY_DATASET`
        *(You can find these values in your local `.env.local` file or `sanity.config.ts`)*

5.  Click **"Deploy"**.

Vercel will build your site. Once complete, you will get a production URL (e.g., `cui-labwebsite.vercel.app`).

---

## Step 3: Configure Sanity CORS

For your website to fetch data from Sanity, you need to allow your new Vercel domain in Sanity's CORS settings.

1.  Go to [sanity.io/manage](https://www.sanity.io/manage).
2.  Select your project.
3.  Go to **API** tab.
4.  Scroll down to **CORS Origins**.
5.  Click **Add CORS Origin**.
6.  Enter your Vercel URL (e.g., `https://cui-labwebsite.vercel.app`).
7.  Check **Allow credentials**.
8.  Save.

---

---

## Step 4: Configure Custom Domain (Optional)

If you have purchased a custom domain (e.g., `www.cuilab.org`), you can connect it in Vercel.

1.  **In Vercel Dashboard**, go to your Project -> **Settings** -> **Domains**.
2.  Enter your domain name and click **Add**.
3.  Vercel will provide **DNS Records** (usually A records or CNAME records).
4.  Log in to your domain registrar (GoDaddy, Namecheap, Google Domains, etc.) and add these records.
5.  **CRITICAL**: Once your new domain is working, you **MUST** go back to **Sanity Manage** -> **API** -> **CORS Origins** and add your new custom domain (e.g., `https://www.cuilab.org`). If you forget this, images will not load.

---

## Step 5: Deploy Sanity Studio (Optional)

Currently, your Studio lives at `/studio` on your website. Since you deployed the whole Next.js app to Vercel, **your Studio is already deployed!**

You can access it at: `https://your-vercel-url.vercel.app/studio`

### Managing Content
To edit content, simply go to that URL, log in, and make changes. To see them on the live site, you may need to wait a minute for revalidation (we set `revalidate = 60` seconds on most pages).

---

## Verification

1.  Visit your live URL.
2.  Check that images are loading (CORS is working).
3.  Navigate to `/studio` and ensure you can log in.

**Congratulations! Your site is live.**
