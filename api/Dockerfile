FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --production

COPY tsconfig.json ./
COPY src/ ./src/

RUN npm run build

ENV PORT=3001
ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "dist/api/src/index.js"]
