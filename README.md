# GOVGRAPH_

Interactive government sector data visualization demo.

## Stack
- React + TypeScript + Vite (client in `client/`)
- Express server (dev + optional prod) in `server/`
- Shared types & zod schemas in `shared/`
- TailwindCSS for styling, Chart.js for charts

## Development
```
npm install
npm run dev
```
Opens the dev server (Express + Vite) on port 5000.

## Build (static client)
```
npm run build
```
Outputs static assets to `client/dist`.

## Production (Node server + static assets)
```
npm run build
npm run start
```
Server will serve API + static files.

## Deployment Notes
For a static-only Vercel deploy, expose `client/dist` (adjust project settings) and ensure the client fetches either live API (host separately) or embed static data. For fullstack, deploy the Node server on a host like Railway/Render/Fly.io.

## License
Proprietary (update as needed).
