# NPM

> Private serverless npm registry

### TODO

- [ ] npm owner
  - [ ] add [user] [package]  // ? /-/user/[user]
  - [ ] rm [user] [package]  // DELETE /-/user/[user]
- [ ] npm access
  - [ ] grant [permission] [scope] [package] // PUT
  - [ ] revoke [scope] [package]  // DELETE
  - [ ] public [package] // POST /-/package/[package]/access
  - [ ] restricted [package]  // POST /-/package/[package]/access
  - [ ] ls-collaborators // GET /-/package/[package]/collaborators
  - [ ] ls-packages // GET /-/org/[user]/package

## Setup

```
gcloud beta functions deploy npm --stage-bucket [bucket] --trigger-http
gcloud beta functions describe npm
gcloud beta functions logs read npm
```

#### Client

```
npm set ca null

npm init --scope=<scope>   
npm update --registry=<registry>
npm login --registry=<registry>
npm publish --registry=<registry>

echo "@<scope>:registry=<registry>" >> .npmrc  
```

#### Server

```
cat << EOF > .npmrc
registry=\${NPM_PROTOCOL}:\${NPM_REGISTRY}
\${NPM_REGISTRY}/:_authToken=\${NPM_TOKEN}
EOF
```
