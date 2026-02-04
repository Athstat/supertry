# Scrummy Web App (Supertry)

## Introduction
Supertry repo is made with React and Vite. Pnpm is the default package manager. More details will be added as we add more docs

## Environment Setup

There are a few environment variables needed to run the app. When these environment variables are not defined inside an `.env` file the app will crash on `pnpm dev`. Here is an example screenshot to show this.

```bash
$ supertry % pnpm dev

> vite-react-typescript-starter@0.0.0 dev /Users/tadiwa/dev/scrummy/supertry
> rm -rf node_modules/.vite &&  vite --host=0.0.0.0

failed to load config from /Users/tadiwa/dev/scrummy/supertry/vite.config.ts
error when starting dev server:
Error: 'VITE_API_BASE_URL', env variable is missing
    at validateEnvironmentVariables (file:///Users/tadiwa/dev/scrummy/supertry/vite.config.ts.timestamp-1764003834375-7ae8c644429a6.mjs:8:11)
    at file:///Users/tadiwa/dev/scrummy/supertry/vite.config.ts.timestamp-1764003834375-7ae8c644429a6.mjs:30:3
    at loadConfigFromFile (file:///Users/tadiwa/dev/scrummy/supertry/node_modules/.pnpm/vite@5.4.19_@types+node@22.15.3_terser@5.44.0/node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:66805:62)
    at async resolveConfig (file:///Users/tadiwa/dev/scrummy/supertry/node_modules/.pnpm/vite@5.4.19_@types+node@22.15.3_terser@5.44.0/node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:66399:24)
    at async _createServer (file:///Users/tadiwa/dev/scrummy/supertry/node_modules/.pnpm/vite@5.4.19_@types+node@22.15.3_terser@5.44.0/node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:62999:18)
    at async CAC.<anonymous> (file:///Users/tadiwa/dev/scrummy/supertry/node_modules/.pnpm/vite@5.4.19_@types+node@22.15.3_terser@5.44.0/node_modules/vite/dist/node/cli.js:736:20)
 ELIFECYCLE  Command failed with exit code 1.
```

The missing environment variable will be mentioned in the error.

### Environment Variables Table

|Variable|Description|Source|Example Value|
|---|---|--|--|
|VITE_APP_ENV|The environment the app is running in. When not in production a `beta` is show||`qa`, `production`|
|VITE_API_BASE_URL|The base url of the server that the web app should make requests to|Render Dashboard|`https://scrummy-django-server.onrender.com`|
|VITE_AMPLITUDE_API_KEY|API key for Amplitude|Amplitude Dashboard|apikey123456|
|VITE_AF_ONELINK_BASE_URL| AppFlyer One link base url for tracking marketing UTMs|Render, AppsFlyer Dashboard|`https://onrender.onelink.me/FOO/bar`|
|VITE_FEATURE_LEAGUE_GROUP_ID| The featured fantasy league group's ID that will be used on the onboarding screen|Scrummy Django Dashboard|`45031b65-31df-419b-8693-29199ebfe08c`|
|VITE_GOOGLE_CLIENT_ID| Google Client ID for Google Auth|Google Cloud Dashboard|somekey.apps.googleusercontent.com|
|VITE_APPLE_CLIENT_ID| Client ID for Apple Sign In| Apple Developer Dashboard|`com.some-domain.web`|
|VITE_SUPABASE_URL| Supabase project URL for chat | Supabase Dashboard | `https://example.supabase.co`|
|VITE_SUPABASE_PUBLISHABLE_OR_ANON_KEY| Supabase publishable/anon key for chat | Supabase Dashboard | `sb_publishable_xxxxx`|
