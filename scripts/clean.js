const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");

const TARGETS = [
    "node_modules",
    ".next",
    ".turbo",
    "out",
    "dist",
    "build",
    ".cache",
    "coverage",
    "tsconfig.tsbuildinfo",
    ".eslintcache",
];

// Root-only targets
const ROOT_ONLY_TARGETS = ["yarn.lock", ".yarn/cache", ".yarn/install-state.gz"];

const SHOULD_INSTALL = process.argv.includes("--install");
const SHOULD_REMOVE_LOCKFILE = process.argv.includes("--hard");

function listWorkspaceDirs() {
    const dirs = [ROOT];
    for (const group of ["apps", "packages"]) {
        const groupPath = path.join(ROOT, group);
        if (!fs.existsSync(groupPath)) continue;
        for (const name of fs.readdirSync(groupPath)) {
            const full = path.join(groupPath, name);
            if (fs.statSync(full).isDirectory()) dirs.push(full);
        }
    }
    return dirs;
}

function removePath(target) {
    if (!fs.existsSync(target)) return;
    fs.rmSync(target, { recursive: true, force: true });
    console.log(`  removed: ${path.relative(ROOT, target)}`);
}

function main() {
    console.log("Cleaning workspace...\n");

    const workspaceDirs = listWorkspaceDirs();

    for (const dir of workspaceDirs) {
        for (const target of TARGETS) {
            removePath(path.join(dir, target));
        }
    }

    if (SHOULD_REMOVE_LOCKFILE) {
        for (const target of ROOT_ONLY_TARGETS) {
            removePath(path.join(ROOT, target));
        }
    }

    console.log("\nClean complete.");

    if (SHOULD_INSTALL) {
        console.log("\nRunning fresh install (yarn install)...\n");
        execSync("yarn install", { cwd: ROOT, stdio: "inherit" });
        console.log("\nInstall complete.");
    }
}

main();
