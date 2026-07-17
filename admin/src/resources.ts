// Client-side mirror of worker/resources.js — field config drives both the
// generic table columns and the generic add/edit form. Keep in sync with
// the server config; this is intentionally duplicated (no shared module
// system between the Worker and the Vite app) rather than magic.

export type FieldType = "text" | "textarea" | "number" | "bool" | "date" | "datetime" | "enum";

export interface FieldDef {
  type: FieldType;
  label: string;
  required?: boolean;
  values?: string[];
  long?: boolean; // render as <textarea>
}

export interface ResourceDef {
  key: string;
  label: string;
  plural: string;
  icon: string;
  columns: string[]; // fields shown in the table, in order
  fields: Record<string, FieldDef>;
}

export const RESOURCES: ResourceDef[] = [
  {
    key: "tasks",
    label: "Task",
    plural: "Tasks & Reminders",
    icon: "✓",
    columns: ["title", "status", "priority", "area", "due_date"],
    fields: {
      title: { type: "text", label: "Title", required: true },
      notes: { type: "textarea", label: "Notes", long: true },
      status: { type: "enum", label: "Status", values: ["open", "in_progress", "done"] },
      priority: { type: "enum", label: "Priority", values: ["low", "medium", "high"] },
      area: { type: "text", label: "Area" },
      due_date: { type: "date", label: "Due date" },
    },
  },
  {
    key: "events",
    label: "Event",
    plural: "Calendar & Schedule",
    icon: "▤",
    columns: ["title", "starts_at", "location", "status"],
    fields: {
      title: { type: "text", label: "Title", required: true },
      starts_at: { type: "datetime", label: "Starts", required: true },
      ends_at: { type: "datetime", label: "Ends" },
      location: { type: "text", label: "Location" },
      notes: { type: "textarea", label: "Notes", long: true },
      status: { type: "enum", label: "Status", values: ["confirmed", "tentative", "cancelled"] },
    },
  },
  {
    key: "notes",
    label: "Note",
    plural: "Notes & Journal",
    icon: "✎",
    columns: ["title", "tags", "pinned", "updated_at"],
    fields: {
      title: { type: "text", label: "Title" },
      body: { type: "textarea", label: "Body", required: true, long: true },
      tags: { type: "text", label: "Tags (comma separated)" },
      pinned: { type: "bool", label: "Pinned" },
    },
  },
  {
    key: "contacts",
    label: "Contact",
    plural: "Contacts & Relationships",
    icon: "●",
    columns: ["name", "relationship", "company", "follow_up_at"],
    fields: {
      name: { type: "text", label: "Name", required: true },
      relationship: { type: "text", label: "Relationship" },
      email: { type: "text", label: "Email" },
      phone: { type: "text", label: "Phone" },
      company: { type: "text", label: "Company" },
      notes: { type: "textarea", label: "Notes", long: true },
      last_contacted_at: { type: "date", label: "Last contacted" },
      follow_up_at: { type: "date", label: "Follow up on" },
    },
  },
  {
    key: "research_items",
    label: "Research item",
    plural: "Research & Presentations",
    icon: "◆",
    columns: ["title", "status", "deck_url", "updated_at"],
    fields: {
      title: { type: "text", label: "Title", required: true },
      slug: { type: "text", label: "Slug" },
      summary: { type: "textarea", label: "Summary", long: true },
      status: { type: "enum", label: "Status", values: ["draft", "published", "archived"] },
      deck_url: { type: "text", label: "Deck URL (/admin/...)" },
      doc_url: { type: "text", label: "Research doc URL" },
    },
  },
  {
    key: "gear_items",
    label: "Gear item",
    plural: "Guitar Gear Inventory",
    icon: "♫",
    columns: ["name", "category", "brand", "status", "current_value"],
    fields: {
      name: { type: "text", label: "Name", required: true },
      category: { type: "enum", label: "Category", values: ["guitar", "amp", "pedal", "accessory"] },
      brand: { type: "text", label: "Brand" },
      model: { type: "text", label: "Model" },
      serial_number: { type: "text", label: "Serial number" },
      acquired_date: { type: "date", label: "Acquired" },
      purchase_price: { type: "number", label: "Purchase price" },
      current_value: { type: "number", label: "Current value" },
      condition: { type: "text", label: "Condition" },
      notes: { type: "textarea", label: "Notes", long: true },
      image_url: { type: "text", label: "Image URL" },
      status: { type: "enum", label: "Status", values: ["owned", "sold", "wishlist"] },
    },
  },
  {
    key: "content_items",
    label: "Content item",
    plural: "Social & YouTube",
    icon: "▶",
    columns: ["title", "platform", "type", "status", "scheduled_at"],
    fields: {
      platform: { type: "enum", label: "Platform", values: ["youtube", "instagram", "linkedin", "tiktok", "other"], required: true },
      title: { type: "text", label: "Title", required: true },
      type: { type: "enum", label: "Type", values: ["video", "short", "post", "story"] },
      status: {
        type: "enum",
        label: "Status",
        values: ["idea", "scripting", "filming", "editing", "scheduled", "published"],
      },
      scheduled_at: { type: "datetime", label: "Scheduled" },
      published_at: { type: "datetime", label: "Published" },
      url: { type: "text", label: "URL" },
      notes: { type: "textarea", label: "Notes", long: true },
    },
  },
];

export function getResource(key: string): ResourceDef {
  const found = RESOURCES.find((r) => r.key === key);
  if (!found) throw new Error(`Unknown resource: ${key}`);
  return found;
}
