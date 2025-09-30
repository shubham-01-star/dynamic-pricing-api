Dynamic Pricing Backend (Blue-Green Deployment)
Overview

This backend service demonstrates Blue-Green deployment for pricing APIs.
It dynamically serves different pricing versions (blue or green) based on configurable routing strategies such as:

Cookie

Request header

IP hashing

Random percentage (load testing)

Sticky sessions are supported to ensure consistent responses for repeat users.

Features

✅ Dynamic pricing version selection (blue / green)

✅ Configurable routing strategies

✅ Sticky sessions via cookies

✅ Logging of routing decisions

✅ Health endpoint for monitoring

✅ Works with any frontend (CORS enabled)

Tech Stack

Node.js (v22.x recommended)

Express.js

TypeScript

Cookie-parser, CORS, Morgan

Crypto (built-in Node.js module)

Folder Structure
backend/
├── src/
│   ├── config/
│   │   ├── routing-config.json      # Routing strategy config
│   │   ├── blue.json                # Blue version pricing data
│   │   └── green.json               # Green version pricing data
│   ├── controllers/
│   │   └── PricingController.ts     # API controller
│   ├── services/
│   │   └── RoutingService.ts        # Routing logic
│   ├── utils/
│   │   └── logger.ts                # Logging helper
│   └── index.ts                     # Entry point
├── dist/                             # Compiled JS files
├── package.json
├── tsconfig.json
└── README.md

Setup & Installation

Clone the repository:

git clone <repo-url>
cd backend


Install dependencies:

npm install


Ensure your src/config/ folder contains:

routing-config.json

blue.json

green.json

Example routing-config.json:

{
  "strategyOrder": ["cookie", "header", "ip", "percentage"],
  "cookieName": "pricing_version",
  "headerName": "x-version",
  "percentage": { "blue": 70, "green": 30 },
  "sticky": true,
  "stickyDays": 30
}

Scripts

Run in development mode:

npm run dev


Compile TypeScript:

npm run build


Run compiled backend:

npm run start

API Endpoints
Method	Endpoint	Description
GET	/api/v1/pricing	Get pricing data (blue/green)
GET	/api/v1/health	Health check (returns {status: ok})

Example Request (Curl):

curl -i http://localhost:3000/api/v1/pricing


Response:

{
  "servedVersion": "green",
  "pricing": {
    "plan": "Pro",
    "price": 49
  }
}

Routing Strategies

Routing is determined based on the configured strategy order:

Cookie: If user has pricing_version cookie → use it.

Header: If request contains x-version header → use it.

IP: Hash client IP → determine version based on percentage config.

Percentage: Random version based on blue/green percentage.

Sticky sessions:
If enabled, selected version is saved in cookie for repeat requests.

Logging

Every request logs:

[Routing] Strategy order: [ 'cookie', 'header', 'ip', 'percentage' ]
[Routing] Chosen from IP: green
{"timestamp":"...","ip":"...","path":"/api/v1/pricing","method":"GET","servedVersion":"green"}

Notes

Make sure dist/ folder exists after npm run build before running npm start.

Localhost IP (::1) may always resolve to same version due to IP hashing. For random tests, disable ip strategy or use different IPs.

Frontend can use cookie to maintain consistent version for sticky sessions.

License

MIT License