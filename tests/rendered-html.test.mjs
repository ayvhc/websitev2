import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const distRoot = new URL("../dist/", import.meta.url);
const serverRoot = new URL("server/", distRoot);
const clientRoot = new URL("client/", distRoot);

async function readServerBundles() {
  const files = await readdir(serverRoot, { recursive: true });
  const bundles = files.filter((file) => file.endsWith(".js"));
  return Promise.all(
    bundles.map((file) => readFile(new URL(file, serverRoot), "utf8")),
  ).then((contents) => contents.join("\n"));
}

test("builds the portfolio and its public assets", async () => {
  await Promise.all([
    access(new URL("server/index.js", distRoot)),
    access(new URL("client/og.png", distRoot)),
    access(new URL("client/favicon.svg", distRoot)),
    access(new URL("client/Adam_CV.pdf", distRoot)),
  ]);

  await assert.rejects(access(new URL("file.svg", clientRoot)));
  await assert.rejects(access(new URL("globe.svg", clientRoot)));
  await assert.rejects(access(new URL("window.svg", clientRoot)));
  await assert.rejects(
    access(new URL("images/ice-wine-watercolor.png", clientRoot)),
  );
});

test("includes portfolio content and metadata in the server build", async () => {
  const output = await readServerBundles();

  assert.match(output, /Hi, I'm Yihung Chen\./i);
  assert.match(output, /How I invest:/i);
  assert.match(output, /Yihung Chen portrait/i);
  assert.match(output, /\/favicon\.svg/i);
  assert.match(output, /\/og\.png/i);
  assert.doesNotMatch(
    output,
    /site-creator-vinext-starter|Your site is taking shape/i,
  );
});
