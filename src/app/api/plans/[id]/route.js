/**
 * GET    /api/plans/[id]  — get a single plan
 * DELETE /api/plans/[id]  — delete a plan
 */

import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return Response.json({ success: false, error: "Invalid ID" }, { status: 400 });
    }

    const plan = await prisma.savedPlan.findUnique({ where: { id } });
    if (!plan) {
      return Response.json({ success: false, error: "Plan not found" }, { status: 404 });
    }

    return Response.json({ success: true, plan });
  } catch {
    return Response.json({ success: false, error: "Failed to fetch plan" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return Response.json({ success: false, error: "Invalid ID" }, { status: 400 });
    }

    await prisma.savedPlan.delete({ where: { id } });
    return Response.json({ success: true, deleted: id });
  } catch {
    return Response.json({ success: false, error: "Plan not found or already deleted" }, { status: 404 });
  }
}
