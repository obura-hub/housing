import { NextRequest, NextResponse } from "next/server";
import { getFloorWithUnits } from "@/lib/actions/projectActions";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const floor = await getFloorWithUnits(parseInt(id));
  if (!floor)
    return NextResponse.json({ error: "Floor not found" }, { status: 404 });
  return NextResponse.json(floor);
}
