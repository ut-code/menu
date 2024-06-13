import { Client } from "@elastic/elasticsearch"

const useDockerContainer = process.env.USE_DOCKER_CONTAINER === "true"
const serverUrl = useDockerContainer
  ? "http://localhost:9200"
  : process.env.ELASTIC_APM_SERVER_URL ?? "http://localhost:9200"

export const elasticSearchClient = new Client({
  node: serverUrl,
})
