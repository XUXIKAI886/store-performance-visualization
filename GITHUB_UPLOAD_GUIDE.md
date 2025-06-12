# 项目 GitHub 上传指南

本文档提供如何将本项目上传到 GitHub 的指南。

## 前提条件

1. 本地安装 Git
2. 拥有 GitHub 账户
3. 创建了一个空的 GitHub 仓库

## 上传步骤

### 1. 初始化本地仓库

```bash
git init
```

### 2. 添加项目文件

```bash
git add .
```

### 3. 提交更改

```bash
git commit -m "初始提交：店铺运营数据可视化动画演示系统"
```

### 4. 关联远程仓库

将下面命令中的 `YOUR_GITHUB_USERNAME` 和 `YOUR_REPOSITORY_NAME` 替换为你的 GitHub 用户名和仓库名称。

```bash
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git
```

### 5. 推送到 GitHub

```bash
git push -u origin main
```

## 配置 GitHub Pages

要在线展示该项目，可以使用 GitHub Pages：

1. 访问你的 GitHub 仓库
2. 点击 "Settings"
3. 在左侧菜单中找到 "Pages"
4. 在 "Source" 部分，选择 "main" 分支和 "root" 文件夹
5. 点击 "Save"

等待几分钟后，您的项目将在网址 `https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPOSITORY_NAME` 可访问。

## 后续更新

当你需要更新项目时，执行以下命令：

```bash
git add .
git commit -m "更新内容：添加新特性"
git push
```