# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/0a4f2feb-cdbe-4de6-b940-c935f2b59d98

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/0a4f2feb-cdbe-4de6-b940-c935f2b59d98) and start prompting.

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
npm run dev
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

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/0a4f2feb-cdbe-4de6-b940-c935f2b59d98) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

# FitMind Synergy

A comprehensive fitness and wellness application that helps users track their workouts, nutrition, and mental well-being.

## Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fitmind-synergy.git
cd fitmind-synergy
```

2. Copy the environment variables file:
```bash
cp .env.example .env
```

3. Update the `.env` file with your actual values:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `VITE_STRIPE_SECRET_KEY`: Your Stripe secret key
- `VITE_APP_URL`: Your application URL (default: http://localhost:5173)

4. Run the setup script:
```bash
./setup-env.ps1
```

## Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Features

- Workout tracking and planning
- AI-generated workout recommendations
- Nutrition tracking
- Mental wellness exercises
- Progress tracking and achievements
- Social features and community
- Premium subscription features

## Tech Stack

- React + TypeScript
- Vite
- Supabase
- Stripe
- Tailwind CSS
- Shadcn UI
- React Query
- React Router

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
