/**
 * GET /api/analytics
 *
 * Returns aggregate statistics from all calculations stored in the DB.
 * Useful for the admin dashboard and for demonstrating DB integration to judges.
 */

import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalCalculations,
      totalSavedPlans,
      aggregates,
      modeCounts,
      recentCalculations,
      topCorpus,
    ] = await Promise.all([
      // Total counts
      prisma.calculation.count(),
      prisma.savedPlan.count(),

      // Averages
      prisma.calculation.aggregate({
        _avg: {
          requiredMonthlySIP: true,
          retirementCorpus:   true,
          currentAge:         true,
          retirementAge:      true,
          totalInvested:      true,
        },
        _max: { retirementCorpus: true },
        _min: { requiredMonthlySIP: true },
      }),

      // Flat vs step-up counts
      prisma.calculation.groupBy({
        by: ["mode"],
        _count: { mode: true },
      }),

      // Last 5 calculations
      prisma.calculation.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id:                 true,
          createdAt:          true,
          currentAge:         true,
          retirementAge:      true,
          mode:               true,
          requiredMonthlySIP: true,
          retirementCorpus:   true,
          isSustainable:      true,
        },
      }),

      // Top 3 largest corpus calculations
      prisma.calculation.findMany({
        orderBy: { retirementCorpus: "desc" },
        take: 3,
        select: {
          id:                 true,
          currentAge:         true,
          retirementAge:      true,
          retirementCorpus:   true,
          requiredMonthlySIP: true,
          mode:               true,
        },
      }),
    ]);

    const modeMap = Object.fromEntries(
      modeCounts.map((m) => [m.mode, m._count.mode])
    );

    return Response.json({
      success: true,
      analytics: {
        totals: {
          calculations: totalCalculations,
          savedPlans:   totalSavedPlans,
        },
        averages: {
          monthlySIP:    Math.round(aggregates._avg.requiredMonthlySIP ?? 0),
          corpus:        Math.round(aggregates._avg.retirementCorpus   ?? 0),
          currentAge:    +(aggregates._avg.currentAge    ?? 0).toFixed(1),
          retirementAge: +(aggregates._avg.retirementAge ?? 0).toFixed(1),
          totalInvested: Math.round(aggregates._avg.totalInvested ?? 0),
        },
        extremes: {
          maxCorpus:    Math.round(aggregates._max.retirementCorpus   ?? 0),
          minSIP:       Math.round(aggregates._min.requiredMonthlySIP ?? 0),
        },
        modes: {
          flat:   modeMap.flat   ?? 0,
          stepup: modeMap.stepup ?? 0,
        },
        recentCalculations,
        topCorpusCalculations: topCorpus,
      },
    });
  } catch (err) {
    return Response.json(
      { success: false, error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
