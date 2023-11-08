FROM node:20-bookworm

RUN npm install -g pm2

RUN mkdir -p /var/risala/app
RUN mkdir -p /var/risala/server
WORKDIR /var/risala
COPY ./app /var/risala/app
COPY ./server /var/risala/backend

# Install packages for frontend
RUN cd /var/risala/app
#RUN npm install
#RUN npm run build

# Install packages for server
RUN cd /var/risala/server
#RUN npm install