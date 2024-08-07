/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/": {
    /**
     * Health Check
     * @description Returns 'Hello, World!' to indicate the service is running.
     */
    get: {
      responses: {
        /** @description Service is running */
        200: {
          content: {
            "text/plain": string
          }
        }
      }
    }
  }
  "/api/elasticsearch/health": {
    /**
     * Elasticsearch Health Check
     * @description Checks the health of the Elasticsearch cluster.
     */
    get: {
      responses: {
        /** @description Elasticsearch is up! */
        200: {
          content: {
            "application/json": components["schemas"]["ElasticsearchHealth"]
          }
        }
        /** @description Elasticsearch is down */
        500: {
          content: {
            "application/json": components["schemas"]["Error"]
          }
        }
      }
    }
  }
}

export type webhooks = Record<string, never>

export interface components {
  schemas: {
    Error: {
      /** @description Error message */
      message: string
    }
    ElasticsearchHealth: {
      epoch?: string
      timestamp?: string
      cluster?: string
      status?: string
      "node.total"?: string
      "node.data"?: string
      shards?: string
      pri?: string
      relo?: string
      init?: string
      unassign?: string
      pending_tasks?: string
      max_task_wait_time?: string
      active_shards_percent?: string
    }[]
  }
  responses: never
  parameters: never
  requestBodies: never
  headers: never
  pathItems: never
}

export type $defs = Record<string, never>

export type external = Record<string, never>

export type operations = Record<string, never>
