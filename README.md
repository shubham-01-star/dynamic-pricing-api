Dynamic Pricing Backend (Blue-Green Deployment)
Overview

This backend serves dynamic pricing versions (blue / green) using configurable routing strategies. Sticky sessions ensure repeat users see the same version.

Features

Dynamic pricing version selection (blue/green)

Configurable routing strategies

Sticky sessions via cookies

Logging of routing decisions

Health check endpoint

CORS enabled for any frontend

Tech Stack

Node.js (v22.x)

Express.js

TypeScript

cookie-parser, CORS, morgan

crypto (built-in)

Folder Structure
src/
 ├─ config/       # routing-config.json, blue.json, green.json
 ├─ controllers/  # PricingController.ts
 ├─ services/     # RoutingService.ts
 ├─ utils/        # logger.ts
 └─ index.ts      # entry point
dist/             # compiled JS
package.json
tsconfig.json
README.md

Setup

Clone repo:

git clone <repo-url>
cd backend


Install dependencies:

npm install


Ensure src/config/ has:

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

Development:

npm run dev


Build:

npm run build


Start compiled backend:

npm run start

API Endpoints
Method	Endpoint	Description
GET	/api/v1/pricing	Get pricing data
GET	/api/v1/health	Health check ({status:ok})

Example Curl:

curl http://localhost:3000/api/v1/pricing


Response:

{
  "servedVersion": "green",
  "pricing": { "plan": "Pro", "price": 49 }
}

Routing Logic

Routing follows the configured strategyOrder:

Cookie – if version exists, use it

Header – x-version overrides cookie/IP

IP – hash IP → assign version based on percentage

Percentage – random version based on config

Sticky sessions store the chosen version in a cookie for repeat requests.

Notes

Local IP (::1) may always resolve same version due to hashing.

Ensure dist/ exists after npm run build before starting.

Frontend can rely on cookies to maintain sticky sessions.
