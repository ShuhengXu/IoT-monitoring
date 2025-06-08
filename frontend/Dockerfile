# 第一步：构建阶段，使用官方 Node 镜像
FROM node:18-alpine AS build

WORKDIR /app/fronted

# 复制 package.json 和 package-lock.json（如果有的话）
COPY package.json ./
COPY package-lock.json ./  

# 安装依赖
RUN npm install

# 复制所有代码
COPY . .

# 生产环境打包
RUN npm run build

# 第二步：运行阶段，使用轻量 Nginx 镜像
FROM nginx:alpine

# 复制构建好的静态文件到 nginx 默认目录
COPY --from=build /app/fronted/build usr/share/nginx/html

# 复制自定义 nginx 配置（可选，如果你有自定义配置）
# COPY nginx.conf /etc/nginx/nginx.conf

# 暴露 80 端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]

