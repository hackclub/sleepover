import { NextResponse } from "next/server";
import { getUserFromId } from "@/lib/airtable";
import { projectReviewMessage } from "@/lib/bot";

const corsHeaders = {
  // If you want to lock it down, replace "*" with "https://airtable.com"
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function POST(
  request: Request, { params }: { params: Promise<{ id: string }> } ) {
  try {
    const { id } = await params;
    const { dmMsg } = await request.json();

    if (!dmMsg) {
      return NextResponse.json(
        { error: "dmMsg is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const user = await getUserFromId(id);
    const email = user.get("email");

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