FROM node:current-alpine AS base
WORKDIR /base
COPY package*.json ./
RUN npm install
COPY . .

FROM node:current-alpine as builder
ENV NODE_ENV=production
WORKDIR /build
COPY --from=base /base ./
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm run build

FROM smaso/ubuntu_node:latest
COPY --from=builder /build/.next /.next
COPY package.json /package.json

EXPOSE 80
ENTRYPOINT [ "npx", "next", "start", '-p', '80']