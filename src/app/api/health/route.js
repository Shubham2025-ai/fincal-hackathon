/**
 * GET /api/health
 *
 * Health check endpoint. Drupal can ping this to verify the
 * Next.js service is reachable before making calculation requests.
 *
 * Response: { status: "ok", service: "fincal-retirement-calculator", version: "1.0.0" }
 */

export async function GET() {
  return Response.json({
    status:    "ok",
    service:   "fincal-retirement-calculator",
    version:   "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      calculate: "POST /api/calculate",
      health:    "GET  /api/health",
    },
  });
}
