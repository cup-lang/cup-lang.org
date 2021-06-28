FROM ubuntu

WORKDIR /playground

COPY playground .

CMD ./cup build -i prog