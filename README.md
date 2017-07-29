# NPM

> Private serverless npm registry

### FIXME

npm update
npm unpublish pkg@version

### TODO

npm owner add <user> <package name>
npm access restricted <package_name>

## Setup

#### Client

npm set ca null
npm init --scope=<scope>
npm update --registry=<registry>
npm login --registry=<registry>
npm publish --registry=<registry>

echo "@<scope>:registry=<registry>" >> .npmrc

#### Server

cat << EOF > .npmrc
registry=\${NPM_PROTOCOL}:\${NPM_REGISTRY}
\${NPM_REGISTRY}/:_authToken=\${NPM_TOKEN}
EOF
