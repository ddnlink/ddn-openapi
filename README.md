# @ddn/openapi

## 简介

OpenAPI Generator 是一个用于根据 OpenAPI 规范生成服务和客户端代码的工具。它支持多种语言和框架，旨在简化 API 的开发和集成过程。通过使用 OpenAPI Generator，开发者可以快速生成所需的代码，减少手动编写的工作量，提高开发效率。

本插件受到 [@umijs/plugin-openapi](https://github.com/umijs/plugins/tree/master/packages/plugin-openapi#readme)的启发，感谢作者。

## 使用

### 安装

确保您已经安装了 Node.js 和 npm。然后，您可以通过以下命令安装项目依赖：

```bash
$ yarn add @ddn/openapi
```

### 配置

在项目根目录下，创建 `config/openapi_config.ts` 文件，其中包含所有可配置参数及其默认值。您可以根据需要修改这些参数。

可配置参数包括：

- **projectName**: 项目名称，用户必须提供。
- **schemaPath**: 模式路径，用户必须提供。
- **mock**: 是否启用 mock，默认值为 `false`。
- **mockPath**: mock 文件路径，默认值为 `./openapi/mock`。
- **serversPath**: 服务文件路径，默认值为 `./openapi/services`。
- **configPath**: 配置文件路径，默认值为 `./config/config_openapi.ts`。
- **development**: 开发环境标志，用户必须提供。

### 运行

要运行 OpenAPI Generator，您可以使用以下命令：

```bash
$ openapi --projectName MyProject --schemaPath ./schema.json --mock --mockPath ./custom/mock --serversPath ./custom/services --configPath ./config/config_openapi.ts --development
```

或者，使用更简单的方式：

```bash
$ openapi -m -d
```

### 生成的文件

运行命令后，生成的文件将位于 `openapi` 目录中，包括：

- `openapi.json`: 根据 OpenAPI 规范生成的 JSON 文件。
- `openapi.tsx`: 用于生成 OpenAPI UI 的 React 组件。

## 开发

### 环境要求

- Node.js 版本 >= 12.x
- npm 版本 >= 6.x

### 克隆项目

您可以通过以下命令克隆项目：

```bash
$ git clone https://github.com/ddnlink/ddn-openapi.git
$ cd ddn-openapi
```


### 运行测试

在开发过程中，您可以运行测试以确保代码的正确性。使用以下命令运行测试：

```bash
$ npm test
```

### 贡献

欢迎任何形式的贡献！如果您发现了错误或有改进建议，请提交问题或拉取请求。

### 许可证

该项目使用 BSD 3.0 许可证。有关详细信息，请参阅 LICENSE 文件。