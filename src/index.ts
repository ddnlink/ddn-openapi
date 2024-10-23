import { generateService, getSchema } from '@umijs/openapi';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import rimraf from 'rimraf';
import { Command } from 'commander';
import lodash from 'lodash'; // 修正导入方式
import { defaultConfig } from './default_config'; // 导入默认配置

const program = new Command();

program
  .option('-p, --projectName <name>', '项目名称')
  .option('-s, --schemaPath <path>', '模式路径')
  .option('-m, --mock', '是否启用 mock')
  .option('-mp, --mockPath <path>', 'mock 文件路径') // 默认放在 openapi/mock
  .option('-sv, --serversPath <path>', '服务文件路径') // 默认放在 openapi/services
  .option('-c, --configPath <path>', '配置文件路径', './config/config_openapi.js') // 修改为 ./config/config_openapi.ts
  .option('-d, --development', '开发环境')
  .option('-rl, --requestLibPath <path>', '请求库路径'); // 默认值为 'umi'

program.parse(process.argv);
const options = program.opts();

const openAPIFilesPath = join(process.cwd(), 'openapi'); // 修改为 'openapi'

try {
  if (existsSync(openAPIFilesPath)) {
    rimraf.sync(openAPIFilesPath);
  }
  mkdirSync(openAPIFilesPath, { recursive: true }); // 递归创建目录
} catch (error) {
  console.error('创建文件夹失败:', error);
}

const readConfigFile = async (configPath: string) => {
  const absoluteConfigPath = resolve(process.cwd(), configPath);
  console.log('absoluteConfigPath: ', absoluteConfigPath);

  if (existsSync(absoluteConfigPath)) {
    const configContent = require(absoluteConfigPath);
    console.log('configContent1: ', configContent);
    return configContent;
  }
  console.warn(`配置文件 ${configPath} 不存在，使用默认配置。`);
  return {};
};

// fixme: 暂时不用
const genOpenAPIFiles = async (openAPIConfig: any) => {
  if (!openAPIConfig.development) return;
  const openAPIJson = await getSchema(openAPIConfig.schemaPath);
  writeFileSync(
    join(openAPIFilesPath, `${'openapi'}.json`), // openAPIConfig.projectName || 
    JSON.stringify(openAPIJson, null, 2),
  );
};

const genAllFiles = async (openAPIConfig: any) => {
  const mockFolder = openAPIConfig.mock ? openAPIConfig.mockPath : undefined;
  const serversPath = openAPIConfig.serversPath;

  let resolvedMockFolder;
  let resolvedServersPath;

  // 确保 mockFolder 和 serversPath 是有效的字符串
  if (mockFolder && typeof mockFolder === 'string') {
    resolvedMockFolder = resolve(mockFolder);
    // 递归创建 mock 文件夹
    if (!existsSync(resolvedMockFolder)) {
      mkdirSync(resolvedMockFolder, { recursive: true });
    }
  } else {
    console.error('无效的 mockPath:', mockFolder);
  }

  if (serversPath && typeof serversPath === 'string') {
    resolvedServersPath = resolve(serversPath);
    // 递归创建服务文件夹
    if (!existsSync(resolvedServersPath)) {
      mkdirSync(resolvedServersPath, { recursive: true });
    }
  } else {
    console.error('无效的 serversPath:', serversPath);
  }

  // 生成服务文件
  await generateService({
    ...openAPIConfig,
    mockFolder: resolvedMockFolder,
    serversPath: resolvedServersPath,
  });
  console.log('[openAPI]: 执行完成');
};

// 生成 OpenAPI UI 页面
const generateOpenAPIUI = (arrayConfig: any[]) => {
  const config = arrayConfig?.[0]?.projectName || 'openapi';
  const content = `
  // This file is generated automatically
  // DO NOT CHANGE IT MANUALLY!
  import { useEffect, useState } from 'react';
  import { SwaggerUIBundle } from 'swagger-ui-dist';
  import 'swagger-ui-dist/swagger-ui.css';
  const App = () => {
    const [value, setValue] = useState("${config || 'openapi'}");
    useEffect(() => {
      SwaggerUIBundle({
        url: \`/umi-plugins_$\{value}.json\`,
        dom_id: '#swagger-ui',
      });
    }, [value]);

    return (
      <div
        style={{
          padding: 24,
        }}
      >
        <select
          style={{
            position: "fixed",
            right: "16px",
            top: "8px",
          }}
          onChange={(e) => setValue(e.target.value)}
        >
          ${arrayConfig
            .map((item) => {
              return `<option value="${item.projectName || 'openapi'}">${item.projectName || 'openapi'}</option>`;
            })
            .join('\n')}
        </select>
        <div id="swagger-ui" />
      </div>
    );
  };
  export default App;
  `;

  // 写入生成的文件到 openAPIFilesPath
  writeFileSync(join(openAPIFilesPath, 'openapi.tsx'), content);
};

const main = async () => {
  if (options.schemaPath) {
    options.schemaPath = resolve(process.cwd(), options.schemaPath);
  }

  if (options.development) {
    // 读取配置文件并合并到 openAPIConfig
    const configFromFile = await readConfigFile(options.configPath);
    
    const openAPIConfig = {
      ...defaultConfig,
      ...configFromFile, // 合并配置文件内容在前
      ...options,
    };
    console.log('openAPIConfig: ', openAPIConfig);

    await genOpenAPIFiles(openAPIConfig);
    await genAllFiles(openAPIConfig); // 只传递 openAPIConfig

    // 生成 OpenAPI UI 页面
    const arrayConfig = lodash.flatten([openAPIConfig]);
    generateOpenAPIUI(arrayConfig);
  } else {
    console.log('请在开发环境中运行此命令');
  }
};

main().catch(console.error);