env $(grep -v '^#' .env | xargs) node .output/server/index.mjs
