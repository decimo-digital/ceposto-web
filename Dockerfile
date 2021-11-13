FROM smaso/ubuntu_node:latest AS base
WORKDIR /base
COPY package*.json ./
RUN npm install
COPY . .

FROM smaso/ubuntu_node:latest as builder
WORKDIR /build
COPY --from=base /base ./
RUN npm run build

EXPOSE 3000
ENTRYPOINT [ "npm", "run", "start"]