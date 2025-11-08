# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/1c3c2442-af56-4649-b122-85f0466c2f88

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/1c3c2442-af56-4649-b122-85f0466c2f88) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm start
# OR
npm run dev

# The server will automatically open at http://localhost:8080
# If you see a blank page, check FIX_BLANK_PAGE.md for troubleshooting
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

### Option 1: Deploy to Vercel (Recommended)

This project is fully configured for Vercel deployment! 

**Quick Steps:**
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
4. Click Deploy!

**📖 Full Guide:** See [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md) for detailed instructions.

### Option 2: Deploy via Lovable

Simply open [Lovable](https://lovable.dev/projects/1c3c2442-af56-4649-b122-85f0466c2f88) and click on Share -> Publish.

### Other Platforms

This Vite + React app can also be deployed to:
- **Netlify** - Similar to Vercel, just connect your repo
- **GitHub Pages** - Requires build script adjustments
- **Cloudflare Pages** - Great performance
- **AWS Amplify** - Enterprise option

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
