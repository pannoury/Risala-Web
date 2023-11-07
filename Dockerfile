FROM node:20-bookworm

RUN npm install -g pm2

RUN mkdir -p /var/risala
WORKDIR /var/risala
COPY ./app /var/risala
COPY ./server /var/risala

# Install packages for frontend
#RUN cd /var/risala/app
#RUN npm install

# Install packages for server
#RUN cd /var/risala/server
#RUN npm install