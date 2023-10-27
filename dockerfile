FROM martyzaum/node18.17.1

RUN apt-get update -y
RUN apt-get install libreoffice -y
RUN apt-get install unoconv -y

WORKDIR /app

COPY . .

CMD ["npm", "start"]
