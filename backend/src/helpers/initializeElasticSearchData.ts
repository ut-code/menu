import { elasticSearchClient } from "../elasticSearchClient"

async function deleteIndexIfExists(index: string): Promise<void> {
  const indexExists = await elasticSearchClient.indices.exists({ index })
  if (indexExists) {
    await elasticSearchClient.indices.delete({ index })
    console.log(`Deleted index: ${index}`)
  }
}

async function createIndexAndInsertData(indexName: string) {
  // インデックスの作成
  await elasticSearchClient.indices.create({
    index: indexName,
    body: {
      mappings: {
        properties: {
          title: { type: "text" },
          description: { type: "text" },
          rank: { type: "integer" },
        },
      },
    },
  })

  // 仮データの投入
  const data = [
    { title: "Elasticsearch Introduction", description: "Basics of Elasticsearch", rank: 1 },
    { title: "Advanced Elasticsearch", description: "Advanced techniques in Elasticsearch", rank: 2 },
    { title: "Elasticsearch Tuning", description: "Improving Elasticsearch performance", rank: 3 },
  ]

  for (const item of data) {
    await elasticSearchClient.index({
      index: indexName,
      body: item,
    })
  }

  // インデックスを最新の状態にリフレッシュ
  await elasticSearchClient.indices.refresh({ index: indexName })

  console.log(`Index "${indexName}" created and data inserted.`)
}

;(async () => {
  const indexName = "recipes"
  await deleteIndexIfExists(indexName)
  await createIndexAndInsertData(indexName)
})()
