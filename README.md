<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1iMNvvhcfYecS4D6MUa1gbX0hH09fsf5k

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Google Sign-In (Google Cloud Console)

- Create an OAuth 2.0 Client ID in Google Cloud Console and use the following as the JavaScript origin when testing locally (adjust port if different):
   - `http://localhost:5173`
- The project already reads the client ID from the Vite env var `VITE_GOOGLE_CLIENT_ID`.
- A local env file `.env.local` is included with the provided client ID. If you need to replace it, edit `.env.local`.
- Make sure the OAuth Client has the correct Authorized JavaScript origins and that the Google Identity Services script is available in `index.html`.
