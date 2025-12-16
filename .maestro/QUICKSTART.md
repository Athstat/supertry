# 🚀 Quick Start Guide - Maestro Web E2E Tests

Get your Maestro web tests running in 5 minutes!

## Step 1: Install Maestro

### macOS
```bash
brew tap mobile-dev-inc/tap
brew install maestro

# Verify installation
maestro --version
```

### Linux
```bash
curl -Ls "https://get.maestro.mobile.dev" | bash

# Verify installation
maestro --version
```

### Windows
```powershell
iwr -useb 'https://get.maestro.mobile.dev' | iex

# Verify installation
maestro --version
```

## Step 2: Install Chrome Browser

Maestro uses Chrome for web testing. Make sure you have Google Chrome installed:

- **macOS/Windows:** Download from [chrome.google.com](https://www.google.com/chrome/)
- **Linux:** `sudo apt install google-chrome-stable`

Verify Chrome is accessible:
```bash
# macOS/Windows
chrome --version

# Linux
google-chrome --version
```

## Step 3: Create Test User

Create a user account with these credentials (or update `.maestro/config.yaml` with your own):

- **Email:** `maestro_test@example.com`
- **Password:** `TestPassword123!`
- **Username:** `maestro_test_user`

You can create this account by:
1. Starting your dev server (`pnpm dev`)
2. Opening http://localhost:5173 in your browser
3. Signing up with these credentials

## Step 4: Start Your Web App

```bash
# Install dependencies (if not already done)
pnpm install

# Start development server
pnpm dev

# Wait for app to be running on http://localhost:5173
```

The dev server must be running for tests to work!

## Step 5: Run Your First Test

```bash
# Run the sign-in test
pnpm test:e2e:signin

# Or run all critical tests
pnpm test:e2e:critical
```

## ✅ Success!

If the test passed, you'll see:
- ✅ Green checkmarks in your terminal
- Test execution details
- Screenshots saved in `~/.maestro/tests/`
- Console output with test results

You should see output like:
```
✅ Test Passed: Sign In Flow
   Duration: 12.3s
   Screenshots: 2
```

## 🎯 What's Next?

### Run All Tests
```bash
# Run the complete test suite
pnpm test:e2e
```

### Run Specific Test Suites
```bash
pnpm test:e2e:auth      # Authentication tests only
pnpm test:e2e:teams     # Team management tests only
pnpm test:e2e:critical  # Critical path tests only
```

### Run Individual Tests
```bash
pnpm test:e2e:signup    # Sign up flow
pnpm test:e2e:signin    # Sign in flow

# Or run any specific test file
maestro test .maestro/flows/auth/03-guest-login.yaml
```

### Generate a Test Report
```bash
# Generate JUnit XML report for CI/CD
pnpm test:e2e:report

# Output: test-results.xml
```

### Debug a Test Interactively
```bash
# Launch Maestro Studio for visual debugging
maestro studio

# Then open a test file to step through it visually
```

## 📚 Learn More

- Read the full [README.md](.maestro/README.md) for detailed documentation
- Check out [Maestro Web Testing Guide](https://maestro.mobile.dev/platform-support/web)
- Explore test files in `.maestro/flows/` to understand the test structure
- Learn about [Maestro Commands](https://maestro.mobile.dev/api-reference/commands)

## 🐛 Troubleshooting

### Chrome Not Found
**Problem:** Maestro can't find Chrome browser

**Solution:**
- Ensure Chrome is installed
- Verify it's accessible from command line
- Try running `chrome --version` (or `google-chrome --version` on Linux)

### Dev Server Not Running
**Problem:** Tests fail immediately with connection errors

**Solution:**
1. Make sure you ran `pnpm dev`
2. Check if http://localhost:5173 opens in your browser
3. Look for any errors in the dev server console
4. Try restarting the dev server

### Test User Not Found
**Problem:** Sign-in test fails with "Invalid credentials"

**Solution:**
1. Create the test user manually at http://localhost:5173
2. Use the exact credentials from `.maestro/config.yaml`
3. Ensure the user account is active

### Test Fails Intermittently
**Problem:** Tests pass sometimes but fail other times

**Solution:**
- Your app might have loading delays
- Check the test screenshots in `~/.maestro/tests/`
- Consider adding `data-testid` attributes to components
- See README.md for improving test reliability

### Port Already in Use
**Problem:** Dev server won't start on port 5173

**Solution:**
1. Stop any process using port 5173
2. Or update BASE_URL in `.maestro/config.yaml` to use a different port
3. Then restart your dev server on that port

### Need Help?
Check the full [README.md](.maestro/README.md) Common Issues section for more troubleshooting tips.

---

## 🎉 Quick Tips

- **Run tests continuously during development:**
  ```bash
  maestro test --continuous .maestro/flows/
  ```

- **View test screenshots:**
  ```bash
  open ~/.maestro/tests/
  ```

- **Add your own tests:**
  - Copy an existing test file in `.maestro/flows/`
  - Modify the steps for your feature
  - Run it with `maestro test path/to/your-test.yaml`

- **Tag your tests:**
  ```yaml
  tags:
    - your-feature
    - web
  ```
  Then run: `maestro test --include-tags=your-feature .maestro/flows/`

---

**Happy Testing! 🎉**
