# Stage 1: Build app
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY packages ./packages
RUN npm install --frozen-lockfile

COPY . .
RUN npm run build

# Stage 2: Run production
FROM node:20-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production

# copy everything từ builder, bao gồm node_modules
COPY --from=builder /usr/src/app ./

EXPOSE 3070
CMD ["npm", "start"]
