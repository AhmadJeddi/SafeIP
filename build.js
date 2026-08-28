import { build } from "esbuild";
import { minify as minifyHTML } from "html-minifier-terser";
import fs from "node:fs/promises";
import path from "node:path";
import { performance } from "node:perf_hooks";

const ROOT = process.cwd();
const OUTPUT = path.join(ROOT, "build");

const STATIC_ASSETS = [
  "favicon.png",
  "icon-192.png",
  "icon-512.png",
  "icon-192-maskable.png",
  "icon-512-maskable.png",
];

function formatBytes(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatReduction(sourceSize, buildSize) {
  if (!sourceSize) {
    return "0.00%";
  }

  return `${((1 - buildSize / sourceSize) * 100).toFixed(2)}%`;
}

async function getFileSize(filePath) {
  const stats = await fs.stat(filePath);
  return stats.size;
}

async function getDirectoryFiles(directory) {
  const entries = await fs.readdir(directory, {
    withFileTypes: true,
  });

  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await getDirectoryFiles(fullPath)));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

async function getDirectorySize(directory) {
  const files = await getDirectoryFiles(directory);

  let total = 0;

  for (const file of files) {
    total += await getFileSize(file);
  }

  return total;
}

async function copyFile(source, destination) {
  await fs.mkdir(path.dirname(destination), {
    recursive: true,
  });

  await fs.copyFile(source, destination);
}

/* ==========================================================
   JavaScript
========================================================== */

async function buildJavaScript() {
  const start = performance.now();

  await build({
    entryPoints: [path.join(ROOT, "js/app.js")],
    bundle: true,
    minify: true,
    format: "esm",
    target: "es2020",
    outfile: path.join(OUTPUT, "js/app.min.js"),
    logLevel: "silent",
  });

  const output = path.join(OUTPUT, "js/app.min.js");
  const size = await getFileSize(output);
  const duration = performance.now() - start;

  console.log(`  ${path.relative(ROOT, output)}  ${formatBytes(size)}`);
  console.log(`Done in ${duration.toFixed(0)}ms`);

  return {
    sourceSize: await getDirectorySize(path.join(ROOT, "js")),
    buildSize: size,
  };
}

/* ==========================================================
   CSS
========================================================== */

async function buildCSS() {
  const start = performance.now();

  await build({
    stdin: {
      contents: `
        @import "./css/reset.css";
        @import "./css/variables.css";
        @import "./css/style.css";
      `,
      resolveDir: ROOT,
      loader: "css",
    },
    bundle: true,
    minify: true,
    outfile: path.join(OUTPUT, "css/style.min.css"),
    logLevel: "silent",
  });

  const output = path.join(OUTPUT, "css/style.min.css");
  const size = await getFileSize(output);
  const duration = performance.now() - start;

  console.log(`  ${path.relative(ROOT, output)}  ${formatBytes(size)}`);
  console.log(`Done in ${duration.toFixed(0)}ms`);

  return {
    sourceSize: await getDirectorySize(path.join(ROOT, "css")),
    buildSize: size,
  };
}

/* ==========================================================
   HTML
========================================================== */

async function buildHTML() {
  const start = performance.now();

  const source = path.join(ROOT, "index.html");
  const destination = path.join(OUTPUT, "index.html");

  let html = await fs.readFile(source, "utf8");

  html = html
    .replace(
      /<link\s+rel=["']stylesheet["']\s+href=["']css\/reset\.css["']\s*\/?>/gi,
      "",
    )
    .replace(
      /<link\s+rel=["']stylesheet["']\s+href=["']css\/variables\.css["']\s*\/?>/gi,
      "",
    )
    .replace(
      /<link\s+rel=["']stylesheet["']\s+href=["']css\/style\.css["']\s*\/?>/gi,
      '<link rel="stylesheet" href="css/style.min.css">',
    )
    .replace(
      /<script\s+type=["']module["']\s+src=["']js\/app\.js["']\s*><\/script>/gi,
      '<script type="module" src="js/app.min.js"></script>',
    );

  const minified = await minifyHTML(html, {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: true,
    useShortDoctype: true,
    removeRedundantAttributes: true,
    removeEmptyAttributes: true,
    sortAttributes: true,
    sortClassName: true,
  });

  await fs.mkdir(path.dirname(destination), {
    recursive: true,
  });

  await fs.writeFile(destination, minified, "utf8");

  const size = await getFileSize(destination);
  const sourceSize = await getFileSize(source);
  const duration = performance.now() - start;

  console.log(`  ${path.relative(ROOT, destination)}  ${formatBytes(size)}`);
  console.log(`Done in ${duration.toFixed(0)}ms`);

  return {
    sourceSize,
    buildSize: size,
  };
}

/* ==========================================================
   Service Worker
========================================================== */

async function buildServiceWorker() {
  const start = performance.now();

  const source = path.join(ROOT, "service-worker.js");
  const output = path.join(OUTPUT, "service-worker.js");

  const productionAppShell = [
    "./",
    "./index.html",
    "./manifest.webmanifest",
    "./service-worker.js",
    "./css/style.min.css",
    "./js/app.min.js",
    "./assets/favicon.png",
    "./assets/icon-192.png",
    "./assets/icon-512.png",
    "./assets/icon-192-maskable.png",
    "./assets/icon-512-maskable.png",
  ];

  let serviceWorker = await fs.readFile(source, "utf8");

  serviceWorker = serviceWorker.replace(
    /const\s+APP_SHELL\s*=\s*\[[\s\S]*?\];/,
    `const APP_SHELL = ${JSON.stringify(productionAppShell, null, 2)};`,
  );

  await build({
    stdin: {
      contents: serviceWorker,
      sourcefile: source,
      resolveDir: ROOT,
      loader: "js",
    },
    bundle: false,
    minify: true,
    format: "iife",
    target: "es2020",
    outfile: output,
    logLevel: "silent",
  });

  const size = await getFileSize(output);
  const sourceSize = await getFileSize(source);
  const duration = performance.now() - start;

  console.log(`  ${path.relative(ROOT, output)}  ${formatBytes(size)}`);
  console.log(`Done in ${duration.toFixed(0)}ms`);

  return {
    sourceSize,
    buildSize: size,
  };
}

/* ==========================================================
   Web App Manifest
========================================================== */

async function minifyManifest() {
  const start = performance.now();

  const source = path.join(ROOT, "manifest.webmanifest");
  const destination = path.join(OUTPUT, "manifest.webmanifest");

  const content = await fs.readFile(source, "utf8");
  const minified = JSON.stringify(JSON.parse(content));

  await fs.writeFile(destination, minified, "utf8");

  const size = await getFileSize(destination);
  const sourceSize = await getFileSize(source);
  const duration = performance.now() - start;

  console.log(`  ${path.relative(ROOT, destination)}  ${formatBytes(size)}`);
  console.log(`Done in ${duration.toFixed(0)}ms`);

  return {
    sourceSize,
    buildSize: size,
  };
}

/* ==========================================================
   Static Assets
========================================================== */

async function copyStaticAssets() {
  const start = performance.now();

  let buildSize = 0;

  for (const asset of STATIC_ASSETS) {
    const source = path.join(ROOT, "assets", asset);
    const destination = path.join(OUTPUT, "assets", asset);

    await copyFile(source, destination);
    buildSize += await getFileSize(destination);
  }

  const sourceSize = await Promise.all(
    STATIC_ASSETS.map((asset) => getFileSize(path.join(ROOT, "assets", asset))),
  ).then((sizes) => sizes.reduce((total, size) => total + size, 0));

  const duration = performance.now() - start;

  console.log(
    `  ${STATIC_ASSETS.length} production assets  ${formatBytes(buildSize)}`,
  );
  console.log(`Done in ${duration.toFixed(0)}ms`);

  return {
    sourceSize,
    buildSize,
  };
}

/* ==========================================================
   Main Build
========================================================== */

async function main() {
  const buildStart = performance.now();

  console.log("Cleaning build directory...");

  await fs.rm(OUTPUT, {
    recursive: true,
    force: true,
  });

  await fs.mkdir(OUTPUT, {
    recursive: true,
  });

  console.log("");
  console.log("Building JavaScript...");
  const jsStats = await buildJavaScript();

  console.log("");
  console.log("Building CSS...");
  const cssStats = await buildCSS();

  console.log("");
  console.log("Building HTML...");
  const htmlStats = await buildHTML();

  console.log("");
  console.log("Building Service Worker...");
  const swStats = await buildServiceWorker();

  console.log("");
  console.log("Minifying Web App Manifest...");
  const manifestStats = await minifyManifest();

  console.log("");
  console.log("Copying production assets...");
  const assetStats = await copyStaticAssets();

  const totalSourceSize =
    jsStats.sourceSize +
    cssStats.sourceSize +
    htmlStats.sourceSize +
    swStats.sourceSize +
    manifestStats.sourceSize +
    assetStats.sourceSize;

  const totalBuildSize =
    jsStats.buildSize +
    cssStats.buildSize +
    htmlStats.buildSize +
    swStats.buildSize +
    manifestStats.buildSize +
    assetStats.buildSize;

  const totalReduction = formatReduction(totalSourceSize, totalBuildSize);

  const totalDuration = performance.now() - buildStart;

  console.log("");
  console.log("========================================");
  console.log("            BUILD SIZE SUMMARY");
  console.log("========================================");

  console.log(
    `JavaScript:      ${formatBytes(jsStats.sourceSize)} → ${formatBytes(jsStats.buildSize)}  (-${formatReduction(jsStats.sourceSize, jsStats.buildSize)})`,
  );

  console.log(
    `CSS:             ${formatBytes(cssStats.sourceSize)} → ${formatBytes(cssStats.buildSize)}  (-${formatReduction(cssStats.sourceSize, cssStats.buildSize)})`,
  );

  console.log(
    `HTML:            ${formatBytes(htmlStats.sourceSize)} → ${formatBytes(htmlStats.buildSize)}  (-${formatReduction(htmlStats.sourceSize, htmlStats.buildSize)})`,
  );

  console.log(
    `Service Worker:  ${formatBytes(swStats.sourceSize)} → ${formatBytes(swStats.buildSize)}  (-${formatReduction(swStats.sourceSize, swStats.buildSize)})`,
  );

  console.log(
    `Manifest:        ${formatBytes(manifestStats.sourceSize)} → ${formatBytes(manifestStats.buildSize)}  (-${formatReduction(manifestStats.sourceSize, manifestStats.buildSize)})`,
  );

  console.log(
    `Assets:          ${formatBytes(assetStats.sourceSize)} → ${formatBytes(assetStats.buildSize)}`,
  );

  console.log("----------------------------------------");
  console.log(`Source total:    ${formatBytes(totalSourceSize)}`);
  console.log(`Build total:     ${formatBytes(totalBuildSize)}`);
  console.log(`Total reduction: ${totalReduction}`);
  console.log("========================================");

  console.log("");
  console.log("✅ Production build completed successfully.");
  console.log(`📦 Output: ${OUTPUT}`);
  console.log(`⏱️ Total time: ${totalDuration.toFixed(0)}ms`);
}

main().catch((error) => {
  console.error("");
  console.error("❌ Build failed:");
  console.error(error);
  process.exit(1);
});
