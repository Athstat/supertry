# 🚀 Quick Start Guide - Maestro E2E Tests

Get your Maestro tests running in 5 minutes!

## Step 1: Install Maestro

```bash
# macOS
brew tap mobile-dev-inc/tap
brew install maestro

# Verify installation
maestro --version
```

## Step 2: Create Test User

Create a user account with these credentials (or update `.maestro/config.yaml` with your own):

- **Email:** `maestro_test@example.com`
- **Password:** `TestPassword123!`
- **Username:** `maestro_test_user`

## Step 3: Start Your App

```bash
# Start development server
pnpm dev

# Wait for app to be running on http://localhost:5173
```

## Step 4: Run Your First Test

```bash
# Run the sign-in test
pnpm test:e2e:signin

# Or run all critical tests
pnpm test:e2e:critical
```

## ✅ Success!

If the test passed, you'll see:
- ✅ Green checkmarks
- Screenshots in `~/.maestro/tests/`
- Console output with test results

## 🎯 What's Next?

### Run All Tests
```bash
pnpm test:e2e
```

### Run Specific Test Suites
```bash
pnpm test:e2e:auth      # Authentication tests
pnpm test:e2e:teams     # Team management tests
```

### Debug a Test
```bash
maestro studio
# Then open a test file to step through it visually
```

## 📚 Learn More

- Read the full [README.md](.maestro/README.md) for detailed documentation
- Check out [Maestro Docs](https://maestro.mobile.dev) for advanced features
- Explore test files in `.maestro/flows/` to understand the test structure

## 🐛 Troubleshooting

### Chrome Not Found
Make sure Chrome is installed and accessible from command line.

### Test Fails
1. Ensure dev server is running (`pnpm dev`)
2. Check if app loads at http://localhost:5173
3. Verify test user exists with correct credentials
4. Look at screenshots in `~/.maestro/tests/` for clues

### Need Help?
Check the [README.md](.maestro/README.md) Common Issues section.

---

Happy Testing! 🎉
