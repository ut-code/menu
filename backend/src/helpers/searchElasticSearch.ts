import { elasticSearchClient } from "../elasticSearchClient"

export async function searchElasticSearch(indexName: string, materials: string[], dish: string, cookingTime: string) {
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
            // {
            //   // 何かしら返ってくるようにmatch_allを入れておく
            //   match_all: {},
            // },
          ],
          should: [
            {
              term: {
                dish: {
                  value: dish,
                  boost: 1,
                },
              },
            },
            {
              match: {
                "materials.readingform": {
                  query: materials.join(" "), // 配列を文字列に変換
                  boost: 1,
                  fuzziness: "AUTO",
                },
              },
            },
            {
              match: {
                "title.readingform": {
                  query: materials.join(" "), // 配列を文字列に変換
                  boost: 0.5,
                  fuzziness: "AUTO",
                },
              },
            },
            {
              match: {
                "description.readingform": {
                  query: materials.join(" "), // 配列を文字列に変換
                  boost: 0.2,
                  fuzziness: "AUTO",
                },
              },
            },
          ],
        },
      },
      size: 3,
    },
  })

  return response.hits.hits
}

;(async () => {
  const indexName = "recipes"
  const materials = ["豆腐"]
  const dish = "主菜"
  const cookingTime = "なんでも"
  const searchResults = await searchElasticSearch(indexName, materials, dish, cookingTime)
  console.log(JSON.stringify(searchResults, null, 2))
})()
