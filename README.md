# NPM

> Serverless npm registry

## Setup

#### Docker
```
docker build -t chr33s/npm .
docker run -d -t -i -p 8080:8080 --name npm chr33s/npm
```

#### Functions
```
gcloud beta functions deploy npm  --trigger-http --stage-bucket [bucket]
gcloud beta functions describe npm
gcloud beta functions logs read npm
```

#### Client

```
npm set ca null
npm config set registry <registry>
npm login --always-auth=true --scope=<scope>?
```

***optional:** scoped registry
```
echo "@<scope>:registry=<registry>" >> .npmrc
```

#### Server

```
export NPM_PROTOCOL=https
export NPM_REGISTRY=npm.domain
export NPM_TOKEN=$(echo "chr33s:p@ssw0rd" | base64)

cat << EOF > ~/.npmrc
registry=\${NPM_PROTOCOL}:\${NPM_REGISTRY}
\${NPM_REGISTRY}/:_authToken=\${NPM_TOKEN}
EOF
```
