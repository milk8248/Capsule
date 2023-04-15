FROM node:12.16-slim as builder
COPY server/ /tmp/app/
RUN cd /tmp/app/ && npm install --unsafe-perm && npm run pkg

FROM bitnami/minideb:buster
COPY --from=builder /tmp/app/server /root/
CMD ["/root/server"]
