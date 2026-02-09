FROM node:22-alpine

WORKDIR /app

# Dependencies
COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

# Prisma
COPY prisma ./prisma
RUN npx prisma generate

# TypeScript config
COPY tsconfig.json ./

# Source code
COPY src ./src

ENV NODE_ENV=production

# Build
RUN npm run build 

# ✅ TO'G'RI copy command
RUN cp -r /app/src/generated/* /app/dist/generated/

# Debug
RUN echo "📂 Checking structure:" && \
    ls -la /app/dist/generated

EXPOSE 3000

CMD ["npm", "run", "dev"]
