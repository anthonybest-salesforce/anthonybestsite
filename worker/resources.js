// Generic resource registry driving the admin CRUD API + D1 store.
// This is the reusable "shared scaffold" piece: adding a new admin-portal
// domain is a matter of adding one entry here (+ a matching table in
// schema.sql) rather than writing bespoke routes/store code per resource.
// sccgc-site's admin console (content/links/council/social) predates this
// generic pattern — this is the version worth porting back into it later.

export const RESOURCES = {
  tasks: {
    table: "tasks",
    orderBy: "due_date IS NULL, due_date ASC, created_at DESC",
    fields: {
      title: { type: "text", required: true },
      notes: { type: "text" },
      status: { type: "enum", values: ["open", "in_progress", "done"], default: "open" },
      priority: { type: "enum", values: ["low", "medium", "high"], default: "medium" },
      area: { type: "text" },
      due_date: { type: "date" },
    },
  },
  events: {
    table: "events",
    orderBy: "starts_at ASC",
    fields: {
      title: { type: "text", required: true },
      starts_at: { type: "datetime", required: true },
      ends_at: { type: "datetime" },
      location: { type: "text" },
      notes: { type: "text" },
      status: { type: "enum", values: ["confirmed", "tentative", "cancelled"], default: "confirmed" },
    },
  },
  notes: {
    table: "notes",
    orderBy: "pinned DESC, updated_at DESC",
    fields: {
      title: { type: "text" },
      body: { type: "text", required: true },
      tags: { type: "text" },
      pinned: { type: "bool", default: false },
    },
  },
  contacts: {
    table: "contacts",
    orderBy: "name ASC",
    fields: {
      name: { type: "text", required: true },
      relationship: { type: "text" },
      email: { type: "text" },
      phone: { type: "text" },
      company: { type: "text" },
      notes: { type: "text" },
      last_contacted_at: { type: "date" },
      follow_up_at: { type: "date" },
    },
  },
  research_items: {
    table: "research_items",
    orderBy: "updated_at DESC",
    fields: {
      title: { type: "text", required: true },
      slug: { type: "text" },
      summary: { type: "text" },
      status: { type: "enum", values: ["draft", "published", "archived"], default: "draft" },
      deck_url: { type: "text" },
      doc_url: { type: "text" },
    },
  },
  gear_items: {
    table: "gear_items",
    orderBy: "created_at DESC",
    fields: {
      name: { type: "text", required: true },
      category: { type: "enum", values: ["guitar", "amp", "pedal", "accessory"], default: "guitar" },
      brand: { type: "text" },
      model: { type: "text" },
      serial_number: { type: "text" },
      acquired_date: { type: "date" },
      purchase_price: { type: "number" },
      current_value: { type: "number" },
      condition: { type: "text" },
      notes: { type: "text" },
      image_url: { type: "text" },
      status: { type: "enum", values: ["owned", "sold", "wishlist"], default: "owned" },
    },
  },
  content_items: {
    table: "content_items",
    orderBy: "scheduled_at IS NULL, scheduled_at ASC, created_at DESC",
    fields: {
      platform: { type: "enum", values: ["youtube", "instagram", "linkedin", "tiktok", "other"], required: true },
      title: { type: "text", required: true },
      type: { type: "enum", values: ["video", "short", "post", "story"], default: "video" },
      status: {
        type: "enum",
        values: ["idea", "scripting", "filming", "editing", "scheduled", "published"],
        default: "idea",
      },
      scheduled_at: { type: "datetime" },
      published_at: { type: "datetime" },
      url: { type: "text" },
      notes: { type: "text" },
    },
  },
};

export const RESOURCE_KEYS = Object.keys(RESOURCES);
