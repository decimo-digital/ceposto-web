FROM node:current-alpine AS base
WORKDIR /base
COPY package*.json ./
RUN npm install
COPY . .

FROM base AS build
ENV NODE_ENV=production
WORKDIR /build
COPY --from=base /base ./
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm run build

FROM node:current-alpine AS production

WORKDIR /app
COPY --from=build /build/package*.json ./
COPY --from=build /build/.next ./.next
RUN npm install next


EXPOSE 80
#CMD npx next start --port 80
ENTRYPOINT [ "npx", "next", "start", "--port", "80" ]