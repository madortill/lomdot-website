import assert from "node:assert/strict";
import test from "node:test";
import { extractDevelopers, extractVersionDate } from "./sync-courses.mjs";

const PRIMARY_DEVELOPER = `
  <h3>מפתחת ראשית:</h3><p>סמל גילי נחום</p>
  <h3>גרפיקה:</h3><p>סמל גילי נחום</p>
  <h3>גרסה:</h3><p>אוגוסט 2026</p>
`;

const MULTIPLE_DEVELOPERS = `
  <h3>מפתחות לומדה:</h3>
  <p>רב\"ט דני שריקי</p><p>רב\"ט גילי גורדון</p><p>סמל אדוה אבא</p>
  <p>סמל דורון הרפז</p><p>טוראי גילי נחום</p>
  <h3>גרסה:</h3><p>מאי 2025</p>
`;

const EMBEDDED_ABOUT = `
  <div className={showAbout ? "open" : "closed"}>
    <h3>מפתחת ראשית:</h3><p>רב\"ט גילי נחום</p>
    <h3>מומחי תוכן:</h3><p>רס\"ל עדן מאיר</p>
    <h3>גרסה:</h3><p>פברואר 2026</p>
  </div>
`;

test("extracts one primary developer and removes the rank", async () => {
  assert.deepEqual(extractDevelopers(PRIMARY_DEVELOPER), ["גילי נחום"]);
});

test("extracts multiple Vue developers", async () => {
  assert.deepEqual(extractDevelopers(MULTIPLE_DEVELOPERS), [
    "דני שריקי", "גילי גורדון", "אדוה אבא", "דורון הרפז", "גילי נחום",
  ]);
});

test("extracts an About block embedded in App.jsx", async () => {
  assert.deepEqual(extractDevelopers(EMBEDDED_ABOUT), ["גילי נחום"]);
  assert.equal(extractVersionDate(EMBEDDED_ABOUT), "2026-02-01");
});

test("normalizes Hebrew version months to sortable dates", async () => {
  assert.equal(extractVersionDate("<h3>גרסה:</h3><p>ספטמבר 2026</p>"), "2026-09-01");
  assert.equal(extractVersionDate("<h3>גרסה:</h3><p>יוני 2026</p>"), "2026-06-01");
});
