import apm from "elastic-apm-node"

const serviceName = process.env.ELASTIC_APM_SERVICE_NAME ?? ""
export const serverUrl = process.env.ELASTIC_APM_SERVER_URL ?? ""

export const elasticSearchClient = apm.start({
  serviceName: serviceName,
  serverUrl: serverUrl,
})
