FROM node:18.16.0-alpine as builder
COPY server/ /tmp/app/
RUN cd /tmp/app/ && npm install --unsafe-perm && npm run pkg

FROM bitnami/minideb:buster
COPY --from=builder /tmp/app/server /root/
CMD ["/root/server"]
