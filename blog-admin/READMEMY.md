
# 博客后台管理项目 - 学习React练手项目

## 项目概述
本项目是一个用于学习React技术的博客后台管理系统，旨在通过实际开发实践掌握React及其相关生态系统的核心概念和基本应用。作为学习练手项目，将采用简洁实用的技术架构，避免过度复杂的企业级特性，专注于基础功能实现和技术学习。

## 推荐技术栈
- **前端框架**: React 19 (用于构建用户界面的JavaScript库)
- **状态管理**: Redux Toolkit (简化Redux使用的工具集)
- **路由管理**: React Router v6 (处理应用路由)
- **UI组件库**: Ant Design (提供美观的UI组件)
- **HTTP客户端**: Axios (处理API请求)
- **构建工具**: Vite (快速的前端构建工具)
- **编程语言**: TypeScript (提供类型安全的JavaScript)
- **代码规范**: ESLint + Prettier (确保代码质量和一致性)

## 项目功能
- 用户登录/注销功能
- 博客文章管理(列表、新增、编辑、删除)
- 分类管理功能
- 简单的数据统计展示

## 项目创建步骤

1. 确保你的电脑已安装Node.js (建议v14.0.0或更高版本)和npm (通常随Node.js一起安装)。

2. 打开终端，导航到你想要创建项目的目录。

3. 使用Vite创建React+TypeScript项目，运行命令: npm create vite@latest blog-admin -- --template react-ts

4. 进入项目目录: cd blog-admin

5. 安装项目依赖: npm install

6. 安装路由管理库: npm install react-router-dom@6

7. 安装状态管理库: npm install @reduxjs/toolkit react-redux

8. 安装UI组件库: npm install antd

9. 安装HTTP客户端: npm install axios

10. 安装代码规范工具: npm install --save-dev eslint prettier eslint-plugin-react eslint-plugin-react-hooks

11. 启动开发服务器: npm run dev

12. 在浏览器中访问终端显示的本地开发地址(通常是http://localhost:5173)，确认项目成功运行。

13. 创建项目基本目录结构: 在src文件夹下创建components、pages、store、services、utils等目录。

14. 开始编写代码实现具体功能，建议从路由配置和基础布局开始。

## 开发注意事项
- 作为学习项目，重点关注React核心概念的理解和应用
- 保持代码简洁可读，适当添加注释
- 实现功能时可以分步骤进行，先搭建基础框架再逐步完善功能
- 遇到问题时查阅官方文档或相关学习资源

## 许可证
本项目仅供学习使用，无特定许可证要求。