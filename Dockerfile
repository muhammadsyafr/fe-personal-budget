FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM alpine:3.19
RUN apk add --no-cache caddy
COPY --from=build /app/dist /srv
EXPOSE 80 443
CMD ["caddy", "file-server", "--root", "/srv", "--listen", ":80"]
