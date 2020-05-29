# ⚡🐘🕸️ Serverless PostGraphile

A lightweight implementation of PostGraphile on AWS Lambda using Serverless.


## Easy deploy
The `serverless.yml` file is built with a few CLI options so that you can deploy without editing
the config!
```
npm i # install dependencies
npx serverless deploy --database-url postgresql://user:password@host/database
```

### Additional deploy options
You can specify plugins to be loaded with a space delimited list with the `--apend-plugins` CLI
option. The plugins will be automatically installed on deploy. EG:
```
npx serverless deploy \
    --database-url postgresql://user:password@host/database \
    --append-plugins='@graphile/postgis @graphile-contrib/pg-simplify-inflector'
```
