# Smart Voter Slip Printing System

Production-ready voter search and single-page slip printing for low-bandwidth polling booths.

## Architecture

```
┌─────────────┐     GET /api/search?q=     ┌──────────────────┐
│   React     │ ─────────────────────────► │  Express API     │
│   (Vite)    │     POST /api/print        │                  │
│             │ ◄───────────────────────── │  voterStore (RAM)│
└─────────────┘     single-page PDF        │  pdfService      │
                                           └──────────────────┘
```

| Layer | Tech | Role |
|-------|------|------|
| Frontend | React, Vite, Tailwind, React Query | Search UI, debounced queries, print dialog |
| Backend | Express, Helmet, Compression | REST API, security, gzip |
| Data | `database/voters.json` | Loaded once at startup, indexed in memory |
| PDF | `pdf/voterlist.pdf` + pdf-lib | Extract one page per request |

## Folder Structure

```
SmartVoterSlip/
├── backend/
│   ├── database/voters.json      # Voter records (replace with your data)
│   ├── pdf/voterlist.pdf         # Master PDF (never sent whole)
│   ├── scripts/generateSamplePdf.js
│   └── src/
│       ├── controllers/
│       ├── routes/
│       ├── services/
│       ├── database/voterStore.js
│       ├── pdf/pdfService.js
│       ├── middlewares/
│       └── utils/
├── frontend/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       └── utils/
├── docker-compose.yml
└── package.json
```

## Quick Start

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Generate sample PDF (or replace with your voterlist.pdf)

```bash
npm run generate-pdf
```

Place your real data in `backend/database/voters.json` and PDF in `backend/pdf/voterlist.pdf`.

### 3. Configure environment

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 4. Run development

```bash
# Both frontend + backend
npm run dev

# Or separately:
npm start --prefix backend    # http://localhost:5000
npm start --prefix frontend   # http://localhost:5173
```

## API

### `GET /api/search?q={epic}`

Partial, case-insensitive EPIC search.

**Response:**
```json
{
  "success": true,
  "query": "SIP229",
  "count": 1,
  "results": [
    {
      "serial_no": 733,
      "epic_no": "SIP2294544",
      "name": "শিবনাথ সর্দার",
      "page_no": 1
    }
  ]
}
```

### `POST /api/print`

**Body:** `{ "epic_no": "SIP2294544" }`

**Response:** `application/pdf` (single page only)

### `GET /api/health` · `GET /api/ready`

Health and readiness probes for Docker / Render / Railway.

## JSON Database

`backend/database/voters.json`:

```json
[
  {
    "serial_no": 733,
    "epic_no": "SIP2294544",
    "name": "শিবনাথ সর্দার",
    "page_no": 27
  }
]
```

- Loaded **once** at server startup
- `Map` index for O(1) EPIC lookup (print)
- Linear scan with early exit for partial search (debounced on frontend)
- Supports 100,000+ records

### Migrating to SQL (no frontend changes)

Replace `backend/src/database/voterStore.js` with a repository implementing the same interface:

```js
// voterRepository.js — same exports
export const voterStore = {
  load() { /* connect pool */ },
  findByEpic(epic) { /* SELECT ... WHERE epic_no = $1 */ },
  search(query, limit) { /* SELECT ... WHERE epic_no ILIKE '%' || $1 || '%' LIMIT $2 */ },
};
```

Keep `voterService.js`, controllers, and API routes unchanged. Frontend continues calling `/api/search` and `/api/print`.

## Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Server port |
| `VOTERS_JSON_PATH` | `./database/voters.json` | Voter JSON path |
| `VOTERLIST_PDF_PATH` | `./pdf/voterlist.pdf` | Master PDF path |
| `CORS_ORIGINS` | `http://localhost:5173` | Comma-separated allowed origins |
| `MIN_SEARCH_LENGTH` | `2` | Minimum query length |
| `MAX_SEARCH_RESULTS` | `50` | Max results per search |

### Frontend (`frontend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `/api` | API base (use full URL in production) |

## Deployment

### Frontend — Vercel

1. Set root directory to `frontend`
2. Build: `npm run build`, Output: `dist`
3. Set `VITE_API_BASE_URL=https://your-api.onrender.com/api`
4. Update `vercel.json` rewrite destination to your backend URL

### Backend — Render

Use `backend/render.yaml` or connect repo with root `backend`, start `npm start`.

Set `CORS_ORIGINS` to your Vercel domain.

### Backend — Railway

Deploy from `backend/` using `railway.toml`. Mount persistent volume for `database/` and `pdf/` if needed.

### Docker

```bash
docker compose up --build
```

- Frontend: http://localhost:8080
- Backend: http://localhost:5000

### Production Checklist

- [ ] HTTPS via reverse proxy (Nginx, Caddy, Cloudflare)
- [ ] Set `NODE_ENV=production`
- [ ] Restrict `CORS_ORIGINS` to your frontend domain
- [ ] Use `/api/ready` for load balancer health checks
- [ ] Monitor JSON logs (structured stdout)
- [ ] Keep PDF and JSON on persistent storage / volume

## Performance & Security

- Gzip compression, ETag, cache headers on search
- Rate limiting (general, search, print)
- Helmet security headers
- Input validation on EPIC and search query
- Axios retry with backoff
- React Query caching + debounced search
- Single-page PDF transfer only

## License

MIT
