FROM node:24-alpine AS deps
WORKDIR /app
COPY apps/web/package*.json ./
RUN npm ci --ignore-scripts

FROM node:24-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY apps/web ./
RUN npm run build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
RUN addgroup -S raqm && adduser -S raqm -G raqm
COPY --from=build /app/build ./build
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev --ignore-scripts
USER raqm
EXPOSE 3000
CMD ["node", "build"]
