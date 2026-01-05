import { NextResponse, NextRequest } from "next/server";
import { getUserFromId } from "@/lib/airtable";
import { projectReviewMessage } from "@/lib/bot";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const dmMsg = body?.dmMsg;

    if (!dmMsg) {
      return NextResponse.json(
        { error: "dmMsg is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const user = await getUserFromId(id);
    const email = user?.get?.("email");

    if (!email) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    await projectReviewMessage(email, dmMsg);

    return NextResponse.json(
      { message: "good" },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("error", error);
    return NextResponse.json(
      { error: "error" },
      { status: 500, headers: corsHeaders }
    );
  }
}