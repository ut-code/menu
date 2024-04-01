import { Client } from "@elastic/elasticsearch"

const serverUrl = process.env.ELASTIC_APM_SERVER_URL ?? "http://localhost:9200"

export const elasticSearchClient = new Client({
  node: serverUrl,
})
