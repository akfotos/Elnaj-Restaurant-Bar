import { test } from "node:test";
import assert from "node:assert/strict";
import { diningAreas, getDiningArea, reservationNotes } from "./dining-areas";

test("homepage booking choices resolve to the correct area", () => {
  assert.deepEqual(diningAreas.map((area) => area.name), ["Elnaj BAR", "Elnaj DINING", "Private Dining"]);
  for (const area of diningAreas) assert.equal(getDiningArea(area.id)?.name, area.name);
  for (const value of [undefined, "unknown", ["bar", "private"]]) assert.equal(getDiningArea(value), undefined);
});

test("staff notes retain the selected area and guest message within the request limit", () => {
  for (const area of diningAreas) {
    assert.equal(reservationNotes(area.id, "  Birthday visit  "), `Preferred area: ${area.name}\nBirthday visit`);
    assert.equal(reservationNotes(area.id, ""), `Preferred area: ${area.name}`);
    assert.ok(reservationNotes(area.id, "a".repeat(1900)).length <= 2000);
  }
});
