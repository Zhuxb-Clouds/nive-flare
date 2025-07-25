#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

// 配置项
const CONFIG = {
  sourceDir: process.cwd(), // 当前工作目录
  targetDir: path.join(__dirname, "../posts"), // 目标目录
  outputDir: path.join(process.cwd(), "_documents"), // 最终输出目录
  ignoreList: ["node_modules", ".git", "_documents", ".github"], // 忽略项
  buildCommand: ["run", "build"] // 构建命令
};

// 工具函数：检查路径是否在忽略列表中
const shouldIgnore = (item) => CONFIG.ignoreList.some(ignored => item.includes(ignored));

// 安全创建目录（递归）
const ensureDir = async (dir) => {
  try {
    await fs.promises.mkdir(dir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
};

// 清空目录（递归）
const clearDir = async (dir) => {
  if (!fs.existsSync(dir)) return;

  const items = await fs.promises.readdir(dir);
  await Promise.all(items.map(async (item) => {
    const itemPath = path.join(dir, item);
    const stat = await fs.promises.stat(itemPath);

    if (stat.isDirectory()) {
      await clearDir(itemPath);
      await fs.promises.rmdir(itemPath);
    } else {
      await fs.promises.unlink(itemPath);
      console.log(`Deleted: ${itemPath}`);
    }
  }));
};

// 复制文件或目录（递归）
const copyItem = async (source, target) => {
  const stat = await fs.promises.stat(source);

  if (stat.isDirectory()) {
    await ensureDir(target);
    const items = await fs.promises.readdir(source);
    await Promise.all(items.map(item =>
      copyItem(path.join(source, item), path.join(target, item))
    ));
  } else if (!shouldIgnore(source)) {
    await fs.promises.copyFile(source, target);
    console.log(`Copied: ${source} → ${target}`);
  }
};

// 跨平台执行命令
const runCommand = (command, args, cwd) => {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: true
    });

    proc.on('close', (code) =>
      code === 0 ? resolve() : reject(`Command failed with code ${code}`)
    );
    proc.on('error', reject);
  });
};

const build = async () => {
  try {
    console.log('[1/3] Copying source files...');
    await ensureDir(CONFIG.targetDir);
    await clearDir(CONFIG.targetDir);
    await copyItem(CONFIG.sourceDir, CONFIG.targetDir);

    console.log('[2/3] Building project...');
    await runCommand('npm', CONFIG.buildCommand, path.dirname(__dirname));

    console.log('[3/3] Moving output files...');
    await ensureDir(CONFIG.outputDir);
    await clearDir(CONFIG.outputDir);
    await copyItem(path.join(__dirname, "../build"), CONFIG.outputDir);

    console.log('✅ Done!');
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};


// 初始化命令：创建 meta.json
async function initProject() {
  const metaPath = path.join(process.cwd(), CONFIG.metaFile);
  if (fs.existsSync(metaPath)) {
    console.log('⚠️  meta.json already exists');
    return;
  }

  try {
    await fs.promises.writeFile(
      metaPath,
      JSON.stringify(CONFIG.defaultMeta, null, 2)
    );
    console.log('✅ Created meta.json');
  } catch (err) {
    console.error('❌ Failed to create meta.json:', err);
  }
}

// 构建命令（复用你之前的逻辑）
async function buildProject() {
  console.log('🚀 Building project...');
  build()
}

// 主入口
async function main() {
  const [_, __, command] = process.argv; // 获取命令行参数

  switch (command) {
    case 'init':
      await initProject();
      break;
    case 'build':
      await buildProject();
      break;
    default:
      console.log(`
Usage:
  NiveFlare init    - Create meta.json
  NiveFlare build   - Build project
      `);
      process.exit(1);
  }
}

main().catch(console.error);