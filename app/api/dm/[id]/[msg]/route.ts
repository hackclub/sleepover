import { NextResponse } from "next/server";
import { getProductsTable, getUserFromId } from "@/lib/airtable";
import { projectReviewMessage } from "@/lib/bot";
import { getUserInfo } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string, msg: string }> }
) {
  try {
    const vars = await params
    const id = await vars.id
    const msg = await vars.msg

    const user = await getUserFromId(id)
    const email = user.get("email")
    
    projectReviewMessage(email, msg)

    return NextResponse.json({
      message: "good" }, { status: 200
    });
  } catch (error) {
    console.error("error", error);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
}