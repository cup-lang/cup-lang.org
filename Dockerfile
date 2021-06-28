FROM ubuntu

WORKDIR /app

COPY ./cup .

RUN ./cup help