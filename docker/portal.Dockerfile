FROM nginx:1.27-alpine

COPY docker/portal/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/portal/index.html /usr/share/nginx/html/index.html

EXPOSE 8080
