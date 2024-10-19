import * as fs from "fs"
import { parse } from "csv-parse/sync"

function readCsvFile(filePath: string) {
  const file = fs.readFileSync(filePath, "utf-8")
  const records = parse(file, { columns: true, bom: true })
  return records
}

interface RecipeRecord {
  id: number
  title: string
  sourceUrl: string
  description: string
  totalCookingTime: string
  materials: string
  foodImageUrl: string
  dish: string
  category: string
  cuisine: string
}

async function insertData(indexName: string) {
  // 仮データの投入
  const records = readCsvFile("src/helpers/ignore/Recipes_rows.v2.csv")
  let chunkSize = 100 // Set the chunk size
  const maxRetries = 5 // 最大リトライ回数
  let retryCount = 0

  let i = 0
  while (i < records.length) {
    const chunk = records.slice(i, Math.min(i + chunkSize, records.length)).map((row: RecipeRecord) => ({
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
    }))

    try {
      const response = await fetch("https://dull-meshi-app-backend.onrender.com/api/recipes/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          index: indexName,
          recipes: chunk,
        }),
      })
      if (response.ok) {
        console.log(`Inserted ${i}-${i + chunk.length} / ${records.length} records`)
        i += chunk.length
        chunkSize = 100 // reset
        await new Promise((resolve) => setTimeout(resolve, 100))
      } else if (response.status === 500) {
        console.error(`Failed to insert ${i}-${i + chunk.length}. Retrying...`)
        await new Promise((resolve) => setTimeout(resolve, 30000))
      } else if (response.status === 413) {
        // Payload Too Large
        chunkSize = Math.max(1, Math.floor(chunkSize / 2))
        console.error(`Failed to insert ${i}-${i + chunk.length}`)
        await new Promise((resolve) => setTimeout(resolve, 1000))
      } else {
        console.error(`Failed to insert ${i}-${i + chunk.length}`)
        console.error(response)
        await new Promise((resolve) => setTimeout(resolve, 30000))
      }
    } catch (error) {
      console.error("Fetch failed:", error)
      retryCount++
      if (retryCount >= maxRetries) {
        console.error("Max retries reached. Aborting.")
        break
      }
      await new Promise((resolve) => setTimeout(resolve, 30000))
    }
  }

  console.log(`Index "${indexName}" created and data inserted.`)
}

;(async () => {
  const indexName = "recipes"
  // インデックスの再作成
  const response = await fetch("https://dull-meshi-app-backend.onrender.com/api/recipes/index/recreate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      index: indexName,
    }),
  })

  if (!response.ok) {
    console.error(response)
    throw new Error("Failed to recreate index")
  }
  console.log(`Index "${indexName}" recreated.`)

  await insertData(indexName)
})()
