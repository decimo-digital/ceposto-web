FROM node:current-alpine AS base
WORKDIR /base
COPY package*.json ./
RUN npm install
COPY . .

FROM node:current-alpine
ENV NODE_ENV=production
WORKDIR /build
COPY --from=base /base ./
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm run build

EXPOSE 80
ENTRYPOINT [ "npx", "next", "start", "--port", "80" ]