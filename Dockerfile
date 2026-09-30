FROM node:22-alpine AS deps

WORKDIR /app
ENV NODE_ENV=development
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/core/package.json packages/core/package.json
RUN pnpm install --frozen-lockfile

FROM deps AS build

ARG VITE_ENABLE_DONATION_BOX=false
ENV VITE_ENABLE_DONATION_BOX=$VITE_ENABLE_DONATION_BOX

COPY . .
# 第一道产物门禁：package.json 的 build 链尾已挂 verify-dist-integrity.mjs。
# pnpm 会透传脚本退出码（实测：脚本 exit 3 -> `pnpm run` 返回 3），RUN 收到非 0
# 即中止 docker build —— 这是 Docker 全版本（含 BuildKit）默认行为，无需任何
# 版本开关或 --check 之类的额外配置。此处刻意不加 `|| true` / `; exit 0`，
# 否则门禁会被静默绕过。
RUN pnpm build

FROM node:22-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
RUN corepack enable

# 注：这里的整目录 COPY 是「有意为之」，不是疏忽 —— 运行时入口为
# `pnpm exec tsx server/docker-server.ts`，它直接 import ../src/lib/** 的
# TypeScript 源码，且 tsx 属 devDependencies，因此 runtime 必须同时具备
# src/ + packages/(@temposoul/core) + 含 devDeps 的 node_modules。
# 盲目改成 prod-only prune 会直接打挂容器。瘦身前置条件见交付报告。
COPY --from=build /app /app

# 第二道产物门禁：断言「最终镜像里」的 dist 可用，fail-closed。
# 第一道只保护构建过程；这一道保护镜像内容 —— 将来若有人改动 COPY 来源、拆分
# stage、改用 --target build 的产物、或以挂载覆盖 dist，这里仍然拦得住。
# 在镜像构建期执行（RUN 层），不增加容器启动开销。
# 依赖：scripts/ 必须随 /app 一起拷贝；当前整目录 COPY 已包含，
# 日后若改为白名单 COPY，务必带上 scripts/，否则此步会因找不到脚本而失败。
RUN node scripts/verify-dist-integrity.mjs dist

EXPOSE 3000
CMD ["pnpm", "exec", "tsx", "--tsconfig", "tsconfig.app.json", "server/docker-server.ts"]
