# Drupal 10 Integration Guide

**FinCal Innovation Hackathon — Retirement Planning Calculator**

This guide explains how the Next.js calculator integrates with Drupal 10.5.6 (PHP 8.1).

---

## Architecture

```
┌─────────────────────┐        HTTP POST         ┌──────────────────────┐
│   Drupal 10 (PHP)   │  ──────────────────────▶  │  Next.js 15 (Node)   │
│                     │  POST /api/calculate       │                      │
│  FinCalRetirement   │  ◀──────────────────────  │  /api/calculate      │
│  Client (Guzzle)    │  JSON response             │  /api/health         │
│                     │                            │                      │
│  Block Plugin       │  ◀─── iframe embed ──────  │  / (UI page)         │
└─────────────────────┘                            └──────────────────────┘
```

Two integration modes are available:

| Mode | Description | Best for |
|------|-------------|----------|
| **Iframe embed** | Drupal renders a block with an iframe pointing to the Next.js URL | Full calculator UI on Drupal pages |
| **API proxy** | Drupal calls `/api/calculate` via Guzzle and renders results natively | Custom Drupal templates, headless |

---

## Quick Setup

### 1. Start the Next.js app

```bash
cd fincal-hackathon
npm install
npm run build
npm start           # runs on http://localhost:3000
```

### 2. Install the Drupal module

Copy the `drupal/fincal_retirement/` folder into your Drupal installation:

```bash
cp -r drupal/fincal_retirement /path/to/drupal/web/modules/custom/
```

Enable it:

```bash
cd /path/to/drupal
drush en fincal_retirement -y
drush cr
```

### 3. Configure the Next.js URL

```bash
drush config:set fincal_retirement.settings nextjs_base_url http://localhost:3000
```

Or visit **Admin → Configuration → FinCal → Retirement Calculator Settings**
(`/admin/config/fincal/retirement`).

### 4. Add the block to a page

Go to **Structure → Block layout** and place the
**FinCal Retirement Calculator** block in any region.

---

## API Reference

### POST `/api/calculate`

Calculates retirement corpus and required SIP.

**Request headers:**
```
Content-Type: application/json
Accept: application/json
```

**Request body:**
```json
{
  "currentAge":            28,
  "retirementAge":         60,
  "lifeExpectancy":        85,
  "currentAnnualExpenses": 600000,
  "inflationRate":         6,
  "preRetirementReturn":   12,
  "postRetirementReturn":  7,
  "stepUpRate":            0
}
```

| Field | Type | Range | Description |
|-------|------|-------|-------------|
| `currentAge` | integer | 18–55 | Current age in years |
| `retirementAge` | integer | currentAge+2–75 | Target retirement age |
| `lifeExpectancy` | integer | retirementAge+2–100 | Expected lifespan |
| `currentAnnualExpenses` | number | 120000–5000000 | Annual expenses today (₹) |
| `inflationRate` | number | 2–12 | Annual inflation rate (%) |
| `preRetirementReturn` | number | 4–18 | Expected return before retirement (%) |
| `postRetirementReturn` | number | 4–12 | Expected return after retirement (%) |
| `stepUpRate` | number | 0–25 | Annual SIP increase rate (%, 0 = flat SIP) |

**Success response (200):**
```json
{
  "success": true,
  "mode": "flat",
  "inputs": { "...validated inputs..." },
  "results": {
    "requiredMonthlySIP":      10007,
    "finalMonthlySIP":         null,
    "retirementCorpus":        45100000,
    "retirementAnnualExpense": 3872000,
    "totalInvested":           3840000,
    "wealthGained":            41260000,
    "yearsToRetirement":       32,
    "retirementDuration":      25,
    "isSustainable":           true,
    "remainingCorpus":         1200000,
    "accumulationData":        [...],
    "drawdownData":            [...]
  },
  "disclaimer": "This tool has been designed for information purposes only..."
}
```

**Validation error (400):**
```json
{
  "success": false,
  "errors": [
    "retirementAge: must be at least 2 years greater than currentAge"
  ]
}
```

### GET `/api/health`

```json
{
  "status": "ok",
  "service": "fincal-retirement-calculator",
  "version": "1.0.0",
  "timestamp": "2026-03-15T10:00:00.000Z"
}
```

---

## PHP Usage Example (Drupal Service)

```php
<?php
// In any Drupal controller, form, or hook:

/** @var \Drupal\fincal_retirement\FinCalRetirementClient $client */
$client = \Drupal::service('fincal_retirement.client');

// Check service is up
if (!$client->isHealthy()) {
  \Drupal::messenger()->addError('Calculator service unavailable.');
  return;
}

// Calculate
try {
  $response = $client->calculate([
    'currentAge'            => 28,
    'retirementAge'         => 60,
    'lifeExpectancy'        => 85,
    'currentAnnualExpenses' => 600000,
    'inflationRate'         => 6,
    'preRetirementReturn'   => 12,
    'postRetirementReturn'  => 7,
    'stepUpRate'            => 10,   // Step-Up SIP at 10%/yr
  ]);

  if ($response['success']) {
    $sip    = $response['results']['requiredMonthlySIP'];   // 7842
    $corpus = $response['results']['retirementCorpus'];     // 45100000
    $final  = $response['results']['finalMonthlySIP'];      // 38000 (step-up)

    // Use in Twig template, REST response, Views field, etc.
  }
  else {
    foreach ($response['errors'] as $error) {
      \Drupal::logger('fincal')->warning($error);
    }
  }
}
catch (\RuntimeException $e) {
  \Drupal::logger('fincal')->error($e->getMessage());
}
```

---

## Environment Variables

Set in your Next.js `.env.local`:

```env
# Restrict CORS to your Drupal domain (production)
DRUPAL_ORIGIN=https://your-drupal-site.com
```

For development, CORS defaults to `*` (all origins allowed).

---

## Compatibility

| Component | Version |
|-----------|---------|
| Next.js   | 15.5.9  |
| Node.js   | 22.11.0 |
| Drupal    | 10.5.6  |
| PHP       | 8.1+    |
| Guzzle    | 7.x (bundled with Drupal core) |
