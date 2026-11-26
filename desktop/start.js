// 清除可能存在的 ELECTRON_RUN_AS_NODE，避免 Electron 以纯 Node 模式启动（那样 GUI API 会全部失效）
const { spawn } = require('child_process');
const path = require('path');

const env = Object.assign({}, process.env);
delete env.ELECTRON_RUN_AS_NODE;

let electronPath;
try {
  electronPath = require('electron');
} catch (e) {
  console.error('Electron 尚未安装，请先在项目中运行 npm install');
  process.exit(1);
}

const child = spawn(electronPath, [path.join(__dirname)], {
  env,
  stdio: 'inherit',
  windowsHide: false
});

child.on('error', function (err) {
  console.error('启动失败:', err.message);
  process.exit(1);
});
child.on('exit', function (code) {
  process.exit(code === null ? 0 : code);
});
