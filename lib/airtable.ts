import Airtable from "airtable";
import { getUserInfo } from "./auth";

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

function getFulfillmentTable() {
  return getBase()("FULFILLMENT");
}


export function getProjectsTable() {
  return getBase()("projects");
}

export function getProductsTable() {
  return getBase()("shop");
}

export function getShopTable() {
  return getBase()("user_shop_info");
}

function getReviewTable() {
  return getBase()("REVIEW");
}

export async function getSingularProject(userid: string, name: string) {
  console.log("userid =", userid)
  console.log("name =", name)
  const record = await getProjectsTable()
    .select({
      filterByFormula: `AND({userid} = '${userid}', {name} = '${name}')`,
      view: "Grid view",
    })
    .firstPage();

  return record[0];
}

export function updateProjectHours(projectid: string, hours: number) {
  getProjectsTable().update([
    {
      "id": projectid,
      "fields": {
        "hours": hours
      }
    }])
}

export async function getUsersProjects(userid: string) {
  const records = await getProjectsTable()
  .select({
    filterByFormula: `{userid} = '${userid}'`,
    view: "Grid view"
}).all()

  const projects = records.map((r) => ({
    id: r.id,
    name: r.get("name") as string,
    desc: r.get("description") as string,
    hours: r.get("hours") as Number,
    hackatime_name: r.get("hackatime_name") as string,
  }));

  return projects || [];
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

export async function getShopItems() {
  const records = await getProductsTable()
    .select({
      view: "Grid view",
    })
    .all();

  return records.map((r) => ({
    id: r.id,
    name: r.get("item_friendly_name") as string,
    description: r.get("description") as string,
    price: r.get("price") as number,
    image: r.get("image") as string | undefined,
    availability: r.get("availability") as string | undefined,
  }));
}

export async function getCurrency(userid: string) {
  const records = await getShopTable()
    .select({
      filterByFormula: `{id} = '${userid}'`,
      maxRecords: 1,
    })
    .firstPage();

    return records[0]?.get("currency") ?? 0
}

export async function addProduct(userid: string, product: string) {
  console.log("PRODUCT PASSED =", product)

  const records = await getShopTable()
    .select({
      filterByFormula: `{id} = '${userid}'`,
      maxRecords: 1,
    })
    .firstPage();

    const product_records = await getProductsTable()
    .select({
      filterByFormula: `{id} = '${product}'`,
      maxRecords: 1,
    })
    .firstPage();

  if (!records.length) throw new Error(`No record found for userid=${userid}`);

  const record = records[0];
  const product_record = product_records[0];

  const currentOrdered = (record.get("ordered") as string[]) ?? [];
  const updatedOrdered = [...currentOrdered, product];

  const currentCurrency = (record.get("currency") as number) ?? 0;
  const updatedCurrency = currentCurrency - Number(product_record.get("price"))

  await getShopTable().update([
    {
      id: record.id,
      fields: {
        ordered: updatedOrdered,
        currency: updatedCurrency,
      },
    },
  ]);

  addFulfillment(userid, product)

  return "success";
}

export async function addFulfillment(userid: string, product: string) {
  const user = await getUsersTable().select({
    filterByFormula: `{id} = '${userid}'`,
    maxRecords: 1,
  })
  .firstPage();

  const date = new Date().toISOString().slice(0, 10);

  const fields = {
    user: [user[0].getId()],
    product: [product],
    date: date,
    status: "Unfulfilled",
  };

  const records = await getFulfillmentTable().create([
    {
      fields,
    },
  ]);

  return records[0];
}

export async function shipProjectTable(projectid: string) {
  
  getProjectsTable().update([
    {
      "id": projectid,
      "fields": {
        "status": "Shipped"
      }
    }])

    const record = await getProjectsTable()
    .select({
      filterByFormula: `{id} = '${projectid}'`,
      maxRecords: 1,
    })
    .firstPage();
    
    const project = record[0]

    console.log(projectid)
    const userid = await project.get("userid")
    var userrecord = ""

    if (userid) {
      userrecord = (await getUsersTable()
      .select({
        filterByFormula: `{id} = '${userid}'`,
        maxRecords: 1,
      })
      .firstPage())[0].getId();
    }

    console.log(userrecord)

    const fields: Record<any, any> = {
      project: [projectid],
      user: [userrecord],
      status: "Unreviewed",
    };
  
    const review = await getReviewTable().create(fields);
    return review
}

export async function getProgressHours(userid: string) {
  const user = await getShopTable().select({
    filterByFormula: `{id} = '${userid}'`,
    maxRecords: 1,
  })
  .firstPage();

  console.log(userid)
  console.log(user)

  return user[0].get("hours_shipped")
}