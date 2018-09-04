FROM eu.gcr.io/tippiq-platform/node-ruby-base

ARG NPM_CONFIG_REGISTRY=https://registry.npmjs.org

RUN echo '{ "allow_root": true }' > /root/.bowerrc

ENV NODE_ENV=production

WORKDIR /opt/app

COPY . .

# TODO remove when address-importer is extracted to its own repo
RUN cd tools/address-importer && npm install

RUN mkdir logs

RUN NODE_ENV=development npm install && npm prune

EXPOSE 3000

CMD ["npm", "start"]
