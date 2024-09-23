import { elasticSearchClient } from "../elasticSearchClient"

export async function searchElasticSearch(indexName: string, query: string, cookingTime: string) {
  let cookingTimeQuery
  switch (cookingTime) {
    case "時短":
      cookingTimeQuery = { range: { totalCookingTime: { gt: 0, lte: 15 } } }
      break
    case "普通":
      cookingTimeQuery = { range: { totalCookingTime: { lte: 30 } } }
      break
    case "じっくり":
      cookingTimeQuery = { range: { totalCookingTime: { gt: 30 } } }
      break
    default:
      cookingTimeQuery = { match_all: {} }
  }

  const response = await elasticSearchClient.search({
    index: indexName,
    body: {
      query: {
        bool: {
          must: [
            cookingTimeQuery,
            {
              // 何かしら返ってくるようにmatch_allを入れておく
              match_all: {},
            },
          ],
          should: [
            {
              match: {
                title: {
                  query: query,
                  boost: 1,
                  analyzer: "kuromoji",
                },
              },
            },
          ],
        },
      },
      size: 10,
    },
  })

  return response.hits.hits
}

;(async () => {
  const indexName = "recipes"
  const searchResults = await searchElasticSearch(indexName, "コロッケ", "なんでも")
  console.log(JSON.stringify(searchResults, null, 2))
})()
