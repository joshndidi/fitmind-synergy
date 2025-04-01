# Check if .env file exists
if (Test-Path .env) {
    Write-Host "Environment file already exists. Skipping setup."
    exit 0
}

# Copy .env.example to .env
Copy-Item .env.example .env

Write-Host "Environment file created. Please update the following variables in .env:"
Write-Host "1. VITE_SUPABASE_URL - Your Supabase project URL"
Write-Host "2. VITE_SUPABASE_ANON_KEY - Your Supabase anonymous key"
Write-Host "3. VITE_STRIPE_PUBLISHABLE_KEY - Your Stripe publishable key"
Write-Host "4. VITE_STRIPE_SECRET_KEY - Your Stripe secret key"
Write-Host "5. VITE_APP_URL - Your application URL (default: http://localhost:5173)" 