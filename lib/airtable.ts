import Airtable from "airtable";

function getBase() {
  if (!process.env.AIRTABLE_API_KEY) {
    throw new Error("AIRTABLE_API_KEY is required");
  }
  if (!process.env.AIRTABLE_BASE_ID) {
    throw new Error("AIRTABLE_BASE_ID is required");
  }
  return new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID
  );
}

function getUsersTable() {
  return getBase()(process.env.AIRTABLE_TABLE_NAME || "Users");
}

export interface UserRecord {
  id: string;
  email: string;
  name?: string;
  slack_id?: string;
  slack_display_name?: string;
  slack_avatar_url?: string;
  verification_status?: string;
  created_at: string;
}

function escapeFormulaString(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

export async function findUserByEmail(email: string) {
  const safeEmail = escapeFormulaString(email);
  const records = await getUsersTable()
    .select({
      filterByFormula: `{email} = '${safeEmail}'`,
      maxRecords: 1,
    })
    .firstPage();

  return records[0] || null;
}

export async function createUser(user: Omit<UserRecord, "created_at">) {
  const fields: Record<string, string> = {
    id: user.id,
    email: user.email,
    name: user.name || "",
    slack_id: user.slack_id || "",
    slack_display_name: user.slack_display_name || "",
    slack_avatar_url: user.slack_avatar_url || "",
    verification_status: user.verification_status || "",
    created_at: new Date().toISOString(),
  };

  const record = await getUsersTable().create(fields);
  return record;
}

export async function updateUser(
  recordId: string,
  updates: Partial<UserRecord>
) {
  const record = await getUsersTable().update(recordId, updates);
  return record;
}
