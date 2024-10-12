#!node
const fs = require("fs");
const path = require("path");
const { spawn, exec } = require("child_process");

const targetDirectory = path.join(__dirname, "../posts"); // 目标目录
const currentDirectory = process.cwd();

// 要忽略的文件和文件夹
const ignoreList = ["node_modules", ".git"]; // 添加你想要忽略的文件和文件夹

// 创建目标目录
function createDirectory(dir) {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) {
        reject(`Error in mkdir: ${err.message}`);
      } else {
        resolve();
      }
    });
  });
}

function clearDirectory(dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, items) => {
      if (err) {
        return reject(`读取目录时出错: ${err.message}`);
      }

      // 创建一个数组来存储删除操作的 Promise
      const deletePromises = items.map((item) => {
        const itemPath = path.join(dir, item);

        return new Promise((resolve, reject) => {
          fs.stat(itemPath, (err, stats) => {
            if (err) {
              return reject(`获取文件信息时出错: ${err.message}`);
            }

            if (stats.isDirectory()) {
              // 递归删除目录
              clearDirectory(itemPath)
                .then(() => fs.rmdir(itemPath, resolve)) // 删除空目录
                .catch(reject);
            } else {
              // 删除文件
              fs.unlink(itemPath, (err) => {
                if (err) {
                  return reject(`删除文件时出错: ${err.message}`);
                }
                console.log(`已删除文件: ${itemPath}`);
                resolve();
              });
            }
          });
        });
      });

      // 等待所有删除操作完成
      Promise.all(deletePromises).then(resolve).catch(reject);
    });
  });
}

// 复制文件
function copyFile(source, target) {
  return new Promise((resolve, reject) => {
    fs.copyFile(source, target, (err) => {
      if (err) {
        reject(`Error in copy files: ${err.message}`);
      } else {
        console.log(`copied: ${source} -> ${target}`);
        resolve();
      }
    });
  });
}

// 复制目录
async function copyDirectory(source, target) {
  // 如果目标目录存在，先清空它
  if (fs.existsSync(target)) {
    await clearDirectory(target);
  } else {
    // 否则创建目标目录
    await createDirectory(target);
  }

  const items = await fs.promises.readdir(source);
  for (const item of items) {
    if (ignoreList.includes(item)) {
      console.log(`ignored: ${item}`);
      continue; // 跳过忽略列表中的文件或文件夹
    }

    const sourcePath = path.join(source, item);
    const targetPath = path.join(target, item);
    const stats = await fs.promises.stat(sourcePath);

    if (stats.isDirectory()) {
      await copyDirectory(sourcePath, targetPath);
    } else {
      await copyFile(sourcePath, targetPath);
    }
  }
}

// 执行构建命令
function runBuild() {
  return new Promise((resolve, reject) => {
    const buildProcess = spawn(
      /^win/.test(process.platform) ? "npm.cmd" : "npm",
      ["run", "export"],
      {
        cwd: path.join(__dirname, "../"),
        stdio: "inherit",
        shell: true,
      }
    );
    buildProcess.on("close", (code) => {
      if (code !== 0) {
        reject(`Build Fail Error: ${code}`);
      } else {
        resolve();
      }
    });

    buildProcess.on("error", (error) => {
      reject(`执行构建时出错: ${error.message}`);
    });
  });
}

// 主函数
async function main() {
  try {
    await copyDirectory(currentDirectory, targetDirectory);
    await runBuild();
    await copyDirectory(path.join(__dirname, "../out"), path.join(currentDirectory, "_documents"));
  } catch (error) {
    console.error(error);
  }
}

main();
