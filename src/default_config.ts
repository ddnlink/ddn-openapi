export const defaultConfig = {
    projectName: '', // 项目名称，用户必须提供
    schemaPath: '', // 模式路径，用户必须提供
    mock: false, // 是否启用 mock，默认值为 false
    mockPath: './openapi/mock', // mock 文件路径，默认值
    serversPath: './openapi/services', // 服务文件路径，默认值
    configPath: './config/config_openapi.ts', // 配置文件路径，默认值
    development: false, // 开发环境标志，用户必须提供
    requestLibPath: "import { request } from 'umi'", // 请求库路径，默认值为 "import { request } from 'umi'"
};