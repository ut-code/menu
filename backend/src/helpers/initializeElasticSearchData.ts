import * as fs from "fs"
import { parse } from "csv-parse/sync"
import { elasticSearchClient } from "../elasticSearchClient"

async function deleteIndexIfExists(index: string): Promise<void> {
  const indexExists = await elasticSearchClient.indices.exists({ index })
  if (indexExists) {
    await elasticSearchClient.indices.delete({ index })
    console.log(`Deleted index: ${index}`)
  }
}

function readCsvFile(filePath: string) {
  const file = fs.readFileSync(filePath, "utf-8")
  const records = parse(file, { columns: true, bom: true })
  return records
}

async function createIndexAndInsertData(indexName: string) {
  // インデックスの作成
  await elasticSearchClient.indices.create({
    index: indexName,
    body: {
      mappings: {
        properties: {
          id: { type: "text" },
          title: { type: "text", analyzer: "kuromoji" },
          sourceUrl: { type: "text" },
          description: { type: "text", analyzer: "kuromoji" },
          totalCookingTime: { type: "long" },
          materials: { type: "text", analyzer: "kuromoji" },
          foodImageUrl: { type: "text" },
          dish: { type: "text", analyzer: "kuromoji" },
          category: { type: "text", analyzer: "kuromoji" },
          cuisine: { type: "text", analyzer: "kuromoji" },
        },
      },
    },
  })

  // 仮データの投入
  const records = readCsvFile("src/helpers/ignore/Recipes_rows.v2.csv")
  const filteredRecords = records.slice(0, 10)
  console.log(filteredRecords)

  for (const row of filteredRecords) {
    await elasticSearchClient.index({
      index: indexName,
      body: {
        id: row.id,
        title: row.title,
        sourceUrl: row.sourceUrl,
        description: row.description,
        totalCookingTime: parseInt(row.totalCookingTime),
        materials: JSON.parse(row.materials),
        foodImageUrl: row.foodImageUrl,
        dish: row.dish,
        category: row.category,
        cuisine: row.cuisine,
      },
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
