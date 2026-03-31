import { chromium, type Page } from "playwright";
import { existsSync, mkdirSync, statSync } from "fs";
import { join } from "path";

const BASE_URL = "http://localhost:3000";
const OUTPUT_DIR = join(new URL(".", import.meta.url).pathname, "screenshots-v3");

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
} as const;

const PAGES = [
  { name: "home", path: "/", locales: ["fr", "en"] },
  { name: "artists", path: "/artists", locales: ["fr"] },
  { name: "artist-detail", path: "/artists/matthieu-scheiffer", locales: ["fr"] },
  { name: "about", path: "/about", locales: ["fr"] },
  { name: "press", path: "/press", locales: ["fr"] },
  { name: "contact", path: "/contact", locales: ["fr"] },
];

async function scrollToBottom(page: Page) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 300;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
}

async function main() {
  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const results: { file: string; ok: boolean }[] = [];

  for (const [vpName, vpSize] of Object.entries(VIEWPORTS)) {
    const context = await browser.newContext({
      viewport: vpSize,
      deviceScaleFactor: vpName === "mobile" ? 2 : 1,
    });
    const page = await context.newPage();

    for (const { name, path, locales } of PAGES) {
      for (const locale of locales) {
        const url = `${BASE_URL}/${locale}${path}`;
        const filename = `${name}-${locale}-${vpName}.png`;
        const filepath = join(OUTPUT_DIR, filename);

        console.log(`📸 ${filename} → ${url}`);

        try {
          await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
          await page.waitForTimeout(1000);
          await scrollToBottom(page);
          await page.screenshot({ path: filepath, fullPage: true });
          results.push({ file: filename, ok: true });
        } catch (err) {
          console.error(`  ❌ Failed: ${(err as Error).message}`);
          results.push({ file: filename, ok: false });
        }
      }
    }

    await context.close();
  }

  await browser.close();

  console.log("\n── Results ──");
  let allOk = true;
  for (const { file, ok } of results) {
    const filepath = join(OUTPUT_DIR, file);
    const exists = existsSync(filepath);
    const size = exists ? statSync(filepath).size : 0;
    const status = ok && exists && size > 0 ? "✅" : "❌";
    if (status === "❌") allOk = false;
    console.log(`  ${status} ${file} (${(size / 1024).toFixed(0)} KB)`);
  }

  console.log(`\n${allOk ? "✅ All screenshots captured" : "❌ Some screenshots failed"}`);
  process.exit(allOk ? 0 : 1);
}

main();
