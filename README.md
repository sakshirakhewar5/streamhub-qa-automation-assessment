# Streamhub QA Automation Assessment

## Selected section
**Section B — API Development + API Automation + EMI UI Automation + SQL**

This repository implements the requirements in the supplied Streamhub assessment:
- small API with 3 endpoints and query parameters
- Playwright API automation
- Cucumber feature/step/page-object framework
- EMI Calculator UI automation for the two requested scenarios
- SQL schema + queries for both requested scenarios
- AI self-healing locator exercise
- execution artifacts/screenshots
- Claude Code / AI reflection

Assessment source: Streamhub Fullstack + QA Automation Assessment, Section B. fileciteturn0file0L71-L84

## Repository structure

```text
.
├── .env.example
├── package.json
├── README.md
├── src/api/
│   ├── server.js
│   └── data/products.json
├── features/
│   ├── api.feature
│   ├── emi.feature
│   ├── steps/
│   │   ├── api.steps.js
│   │   └── emi.steps.js
│   ├── pages/
│   │   └── emi.page.js
│   └── support/
│       └── world.js
├── sql/
│   ├── schema.sql
│   ├── scenario1_round_trip.sql
│   ├── scenario2_ipl_streak.sql
│   └── seed.sql
├── docs/
│   ├── AI_SELF_HEALING.md
│   └── CLAUDE_CODE_REFLECTION.md
└── test-results/
    ├── screenshots/
    └── logs/
```

## 1. Requirements

Install:
- Node.js 18+
- npm
- Google Chrome/Chromium (installed by Playwright)
- Git

Then:

```bash
npm install
npx playwright install chromium
copy .env.example .env
```

Linux/macOS:

```bash
cp .env.example .env
```

## 2. Run the API

In terminal 1:

```bash
npm run api:start
```

The API runs at `http://127.0.0.1:3000`.

Endpoints:
- `GET /api/health`
- `GET /api/products`
- `GET /api/products/:id`

Examples:

```text
GET /api/products?category=electronics&sort=price_asc&page=1&limit=2
GET /api/products/2
GET /api/products?search=phone
```

Invalid query values return 400 with a JSON error.

## 3. Run all Cucumber tests

With the API running:

```bash
npm test
```

Run only API tests:

```bash
npm run test:api
```

Run only EMI tests:

```bash
npm run test:emi
```

For visible browser execution:

```bash
npm run test:headed
```

The test framework uses environment configuration; URLs are not hardcoded in step definitions.

## 4. Execution output

Cucumber writes JSON reports under `test-results/`.

Screenshots are written to:

```text
test-results/screenshots/
```

The API and EMI scenarios attach screenshots when the scenario fails. For the submission, I recommend also capturing one successful headed run with:

```bash
npm run test:headed
```

and keeping the terminal output in `test-results/logs/console-output.txt`.

A strong GitHub submission should contain:
- `test-results/cucumber-report.json`
- screenshots
- console output
- SQL screenshots exported from your SQL client

The assessment explicitly asks that execution results be included in the repository. fileciteturn0file0L78-L84

## 5. EMI calculations

The assessment gives:

### Home Loan A
- Principal = ₹25,00,000
- Interest = 10%
- Tenure = 10 years = 120 months

Expected EMI from the standard reducing-balance formula:

```text
EMI = P*r*(1+r)^n / ((1+r)^n - 1)
```

≈ **₹33,023/month**

### Home Loan B
- Principal = ₹50,00,000
- Interest = 7.5%
- Tenure = 15 years = 180 months

Expected EMI ≈ **₹46,351/month**

The assessment requires the independently calculated values to be compared with the application. fileciteturn0file0L95-L102

For the personal-loan chart scenario:
- ₹10,00,000
- 12%
- 5 years

The test checks the chart, bar count and one tooltip value as required. fileciteturn0file0L103-L113

## 6. SQL

The SQL files contain:
- table schema
- sample seed data
- round-trip transfer query
- 3-consecutive-match IPL streak query

Run them in MySQL 8+ or PostgreSQL after adjusting date functions if necessary.

Take screenshots showing:
1. schema/table creation
2. Scenario 1 query + output
3. Scenario 2 query + output

The assessment explicitly asks for schema and screenshots of query outputs. fileciteturn0file0L114-L122

## 7. AI self-healing exercise

`docs/AI_SELF_HEALING.md` deliberately documents 4 broken locator examples. They are kept out of the passing test path so the main suite remains green.

The document explains:
1. detection
2. AI prompt/context
3. candidate locator generation
4. validation
5. safe application
6. regression protection

This follows the assessment requirement to leave 3–5 incorrect/brittle locators and document the AI self-healing approach. fileciteturn0file0L10-L13

## 8. AI / Claude Code reflection

`docs/CLAUDE_CODE_REFLECTION.md` explains how AI was used as a pair programmer, including where AI suggestions required correction. This is included because the assessment specifically asks for a short reflection in the README. fileciteturn0file0L14-L25

## 9. GitHub submission

Recommended repository name:

**`streamhub-qa-automation-assessment`**

Alternative:
- `streamhub-fullstack-qa-assessment`
- `playwright-cucumber-api-automation`
- `streamhub-api-ui-sql-automation`

Create the repository, then:

```bash
git init
git add .
git commit -m "Complete Streamhub QA automation assessment"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/streamhub-qa-automation-assessment.git
git push -u origin main
```

Before pushing, make sure `.env` is not committed.
