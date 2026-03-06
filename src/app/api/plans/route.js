/**
 * GET  /api/plans  — list all saved plans (newest first)
 * POST /api/plans  — save a new named plan
 */

import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const plans = await prisma.savedPlan.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id:                     true,
        createdAt:              true,
        name:                   true,
        notes:                  true,
        mode:                   true,
        currentAge:             true,
        retirementAge:          true,
        lifeExpectancy:         true,
        currentAnnualExpenses:  true,
        inflationRate:          true,
        preRetirementReturn:    true,
        postRetirementReturn:   true,
        stepUpRate:             true,
        requiredMonthlySIP:     true,
        finalMonthlySIP:        true,
        retirementCorpus:       true,
        retirementAnnualExpense:true,
        totalInvested:          true,
        wealthGained:           true,
        yearsToRetirement:      true,
        isSustainable:          true,
      },
    });

    return Response.json({ success: true, plans });
  } catch (err) {
    return Response.json(
      { success: false, error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const { name, notes, inputs, results } = body;

    if (!name?.trim()) {
      return Response.json(
        { success: false, error: "Plan name is required" },
        { status: 400 }
      );
    }
    if (!inputs || !results) {
      return Response.json(
        { success: false, error: "inputs and results are required" },
        { status: 400 }
      );
    }

    const plan = await prisma.savedPlan.create({
      data: {
        name:                   name.trim(),
        notes:                  notes?.trim() ?? null,
        mode:                   results.isStepUp ? "stepup" : "flat",
        currentAge:             inputs.currentAge,
        retirementAge:          inputs.retirementAge,
        lifeExpectancy:         inputs.lifeExpectancy,
        currentAnnualExpenses:  inputs.currentAnnualExpenses,
        inflationRate:          inputs.inflationRate,
        preRetirementReturn:    inputs.preRetirementReturn,
        postRetirementReturn:   inputs.postRetirementReturn,
        stepUpRate:             inputs.stepUpRate ?? 0,
        requiredMonthlySIP:     results.requiredMonthlySIP,
        finalMonthlySIP:        results.finalMonthlySIP ?? null,
        retirementCorpus:       results.retirementCorpus,
        retirementAnnualExpense:results.retirementAnnualExpense,
        totalInvested:          results.totalInvested,
        wealthGained:           results.wealthGained,
        yearsToRetirement:      results.yearsToRetirement,
        isSustainable:          results.isSustainable,
      },
    });

    return Response.json({ success: true, plan }, { status: 201 });
  } catch (err) {
    return Response.json(
      { success: false, error: "Failed to save plan" },
      { status: 500 }
    );
  }
}
