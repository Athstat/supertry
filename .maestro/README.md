# Maestro E2E Tests for Scrummy Web App

This directory contains automated end-to-end (E2E) tests for the Scrummy fantasy rugby web application using [Maestro](https://maestro.mobile.dev).

## 📁 Directory Structure

```
.maestro/
├── config.yaml                 # Configuration and environment variables
├── flows/
│   ├── auth/                   # Authentication test flows
│   │   ├── 01-signup.yaml
│   │   ├── 02-signin.yaml
│   │   ├── 03-guest-login.yaml
│   │   └── 04-password-reset.yaml
│   ├── teams/                  # Team management test flows
│   │   ├── 05-create-team.yaml
│   │   ├── 06-edit-team.yaml
│   │   └── 07-view-my-teams.yaml
│   └── helpers/                # Reusable helper flows
│       └── login-helper.yaml
├── test-data/                  # Test data and credentials
│   └── users.yaml
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites

1. **Node.js and pnpm** installed
2. **Maestro CLI** installed (see installation below)
3. **Chrome browser** installed and accessible from command line
4. **Running dev server** on `http://localhost:5173`

### Installing Maestro

#### macOS

```bash
# Install via Homebrew
brew tap mobile-dev-inc/tap
brew install maestro

# Verify installation
maestro --version
```

#### Linux

```bash
# Install via curl
curl -Ls "https://get.maestro.mobile.dev" | bash

# Verify installation
maestro --version
```

#### Windows

```powershell
# Install via PowerShell
iwr -useb 'https://get.maestro.mobile.dev' | iex

# Verify installation
maestro --version
```

For more installation options, visit [Maestro Installation Guide](https://maestro.mobile.dev/getting-started/installing-maestro).

## ⚙️ Configuration

### 1. Update Environment Variables

Edit `.maestro/config.yaml` to match your environment:

```yaml
env:
  BASE_URL: "http://localhost:5173"  # Your web app URL
  TEST_EMAIL: "maestro_test@example.com"
  TEST_PASSWORD: "TestPassword123!"
  TEST_USERNAME: "maestro_test_user"
```

**Note:** The BASE_URL should point to your local development server. If you deploy to a staging/production environment, update this accordingly.

### 2. Create Test User

Before running tests, create a test user account with the credentials specified in `config.yaml`:

- Email: `maestro_test@example.com`
- Password: `TestPassword123!`
- Username: `maestro_test_user`

You can do this manually or create a setup script.

### 3. Start Development Server

```bash
# Start your development server
pnpm dev

# The app will be running on http://localhost:5173
```

**Note:** On Windows, use `pnpm dev-win` if you encounter issues with the default `dev` command.

## 🧪 Running Tests

### Run All Tests

```bash
# Using npm scripts
pnpm test:e2e

# Or directly with Maestro
maestro test .maestro/flows/
```

### Run Specific Test Suites

```bash
# Run only authentication tests
pnpm test:e2e:auth

# Run only team management tests
pnpm test:e2e:teams

# Run only critical tests
pnpm test:e2e:critical
```

### Run Individual Tests

```bash
# Run signup test
pnpm test:e2e:signup

# Run signin test
pnpm test:e2e:signin

# Or run any specific file
maestro test .maestro/flows/auth/01-signup.yaml
```

### Generate Test Report

```bash
# Generate JUnit XML report
pnpm test:e2e:report

# This creates test-results.xml in the project root
```

## 📊 Test Coverage

### Authentication Flows (4 tests)

| Test | File | Priority | Description |
|------|------|----------|-------------|
| Sign Up | `01-signup.yaml` | P0 (Critical) | Tests 4-step registration process |
| Sign In | `02-signin.yaml` | P0 (Critical) | Tests login with email/password |
| Guest Login | `03-guest-login.yaml` | P1 | Tests guest access with restrictions |
| Password Reset | `04-password-reset.yaml` | P2 | Tests password reset request |

### Team Management Flows (3 tests)

| Test | File | Priority | Description |
|------|------|----------|-------------|
| Create Team | `05-create-team.yaml` | P0 (Critical) | Tests team creation with player selection |
| Edit Team | `06-edit-team.yaml` | P1 (High) | Tests team editing and transfers |
| View My Teams | `07-view-my-teams.yaml` | P1 (High) | Tests viewing team list and details |

### Helper Flows

- **Login Helper** (`login-helper.yaml`): Reusable authentication flow for tests requiring logged-in state

## 🎯 Test Tags

Tests are organized with tags for selective execution:

- `auth` - Authentication related tests
- `teams` - Team management tests  
- `critical` - Critical path tests (P0 priority)
- `signup` - Sign up specific
- `signin` - Sign in specific
- `guest` - Guest user tests
- `web` - Web-specific tests

Run tests by tag:

```bash
maestro test --include-tags=critical .maestro/flows/
maestro test --include-tags=auth .maestro/flows/
maestro test --include-tags=web .maestro/flows/
```

## 🐛 Debugging Tests

### Use Maestro Studio

Maestro Studio is a visual tool for debugging and creating tests interactively:

```bash
# Launch Maestro Studio
maestro studio

# Then open a test file or create a new one
# The studio will guide you through the test visually
```

### View Test Output

```bash
# Run with detailed output
maestro test --debug-output .maestro/flows/auth/01-signup.yaml

# This will show:
# - Screenshots at each step
# - Console logs
# - Detailed failure information
```

### Check Screenshots

After test execution, screenshots are saved in:
- `~/.maestro/tests/<test-run-id>/screenshots/`

## ⚡ Continuous Mode

Run tests continuously during development:

```bash
maestro test --continuous .maestro/flows/
```

This re-runs tests whenever you save changes to your test files.

## 🔧 Improving Test Reliability

### 1. Add Test IDs to Components

For better selector reliability, add `data-testid` attributes to your React components:

```tsx
// Example: SignUpScreen.tsx
<input
  data-testid="username-input"
  type="text"
  value={username}
  onChange={handleUsernameChange}
/>

<button 
  data-testid="next-button"
  onClick={handleNext}
>
  Next
</button>
```

Then update tests to use these IDs:

```yaml
- tapOn:
    id: "username-input"
- inputText: "testuser"
- tapOn:
    id: "next-button"
```

### 2. Use Explicit Waits

Add waits for async operations:

```yaml
- waitForAnimationToEnd
- assertVisible:
    text: "Success"
    timeout: 10000
```

### 3. Handle Network Delays

Configure appropriate timeouts in `config.yaml`:

```yaml
env:
  MAESTRO_DRIVER_STARTUP_TIMEOUT: 120000
```

## 📝 Writing New Tests

### 1. Create a New Flow File

```bash
touch .maestro/flows/your-feature/new-test.yaml
```

### 2. Use the Template

```yaml
# Test Name
# Description of what this test does

appId: ${BASE_URL}
tags:
  - your-tag
---
# Test steps go here
- launchApp:
    appId: chrome
    arguments:
      - "--new-window"
      - "${BASE_URL}/your-route"

- assertVisible: "Your Text"
- tapOn: "Button Text"
# ... more steps
```

### 3. Run Your New Test

```bash
maestro test .maestro/flows/your-feature/new-test.yaml
```

## 🚨 Common Issues

### Issue: "Chrome not found"

**Solution:** 
- Ensure Google Chrome is installed on your system
- On macOS: Chrome is typically at `/Applications/Google Chrome.app`
- On Linux: Install via `sudo apt install google-chrome-stable` or similar
- On Windows: Install from [chrome.google.com](https://www.google.com/chrome/)
- Verify Chrome is accessible from command line by running `chrome --version` (or `google-chrome --version` on Linux)

### Issue: "Element not found"

**Solution:** 
- Increase timeout values
- Add `waitForAnimationToEnd` before assertions
- Use more specific selectors
- Add `data-testid` attributes

### Issue: "Test fails intermittently"

**Solution:**
- Add explicit waits
- Use `waitForAnimationToEnd`
- Increase timeout values
- Check for race conditions

### Issue: "App not launching" or "Cannot access BASE_URL"

**Solution:**
- Ensure dev server is running (`pnpm dev`)
- Verify app loads at http://localhost:5173 in your browser
- Check BASE_URL in config.yaml matches your dev server
- If using a different port, update BASE_URL accordingly
- Check firewall settings aren't blocking localhost access

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Maestro
        run: |
          curl -Ls "https://get.maestro.mobile.dev" | bash
          echo "$HOME/.maestro/bin" >> $GITHUB_PATH
      
      - name: Start App
        run: |
          pnpm install
          pnpm dev &
          sleep 10
      
      - name: Run E2E Tests
        run: pnpm test:e2e:critical
      
      - name: Upload Test Results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results.xml
```

## 📚 Resources

- [Maestro Documentation](https://maestro.mobile.dev)
- [Maestro Web Testing Guide](https://maestro.mobile.dev/platform-support/web)
- [Maestro Commands Reference](https://maestro.mobile.dev/api-reference/commands)
- [Maestro GitHub](https://github.com/mobile-dev-inc/maestro)
- [Scrummy App Repository](https://github.com/Athstat/supertry)

## 🤝 Contributing

When adding new tests:

1. Follow the existing naming convention (`##-test-name.yaml`)
2. Add appropriate tags
3. Include descriptive comments
4. Take screenshots at key points
5. Update this README with new tests

## 📧 Support

For issues with:
- **Maestro**: [Maestro GitHub Issues](https://github.com/mobile-dev-inc/maestro/issues)
- **Maestro Web Testing**: [Web Testing Docs](https://maestro.mobile.dev/platform-support/web)
- **Scrummy App**: Contact the development team

---

**Happy Testing! 🎉**
