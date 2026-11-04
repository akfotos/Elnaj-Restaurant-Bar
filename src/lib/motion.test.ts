import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Reveal from "../components/Reveal";
import { readFileSync } from "node:fs";

test("the homepage hero keeps its poster and motion safeguards without a visible video control", () => {
  const source = readFileSync(new URL("../components/HeroVideo.tsx", import.meta.url), "utf8");
  assert.match(source, /seafood-bbq-poster/);
  assert.doesNotMatch(source, /<button|Pause video|Play video|hero-video-control/);
  assert.match(source, /prefers-reduced-motion: reduce/);
  assert.match(source, /!connection\?\.saveData/);
  assert.match(source, /enabled && !failed && <video/);
});

test("scroll reveals keep server-rendered content visible before JavaScript runs", () => {
  const html = renderToStaticMarkup(createElement(Reveal, { children: "Readable menu content" }));
  assert.match(html, /Readable menu content/);
  assert.match(html, /class="reveal /);
  assert.doesNotMatch(html, /reveal-ready|aria-hidden|opacity:0/);
});

test("reveals preserve semantic headers and sections without extra layout wrappers", () => {
  for (const as of ["header", "section"] as const) {
    const html = renderToStaticMarkup(createElement(Reveal, { as, className: "page-intro", delay: 80, children: "Page content" }));
    assert.ok(html.startsWith(`<${as} `));
    assert.ok(html.endsWith(`</${as}>`));
    assert.match(html, /page-intro/);
    assert.match(html, /--reveal-delay:80ms/);
  }
});
