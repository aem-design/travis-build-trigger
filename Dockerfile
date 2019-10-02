FROM        node:10

MAINTAINER  devops <devops@aem.design>

LABEL   container.description="travis pipeline trigger" \
        version="1.0.0" \
        imagename="travis-build-trigger" \
        test.command=" --version" \
        test.command.verify="1.0.0"


WORKDIR /app

COPY ./*.js ./
COPY ./LICENSE ./
COPY ./README.md ./
COPY ./package*.json ./

RUN npm install

ENTRYPOINT [ "node", "travis-trigger-build.js" ]
