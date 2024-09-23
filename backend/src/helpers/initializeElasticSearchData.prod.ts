import * as fs from "fs"
import { parse } from "csv-parse/sync"

function readCsvFile(filePath: string) {
  const file = fs.readFileSync(filePath, "utf-8")
  const records = parse(file, { columns: true, bom: true })
  return records
}

async function insertData(indexName: string) {
  // 仮データの投入
  const records = readCsvFile("src/helpers/ignore/Recipes_rows.v2.csv")
  const chunkSize = 1000 // Set the chunk size

  const chunkedRecords = []

  for (let i = 0; i < records.length; i += chunkSize) {
    chunkedRecords.push(records.slice(i, i + chunkSize))
  }

  for (let i = 0; i < chunkedRecords.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chunk = chunkedRecords[i].map((row: any) => ({
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
      console.log(`Chunk ${i + 1}/${chunkedRecords.length} inserted.`)
    } else {
      console.error(`Failed to insert chunk ${i + 1}`)
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  console.log(`Index "${indexName}" created and data inserted.`)
}

;(async () => {
  const indexName = "recipes"
  // インデックスの再作成
  const response = await fetch("https://dull-meshi-app-backend.onrender.com/api/recipes/recipes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      index: indexName,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to recreate index")
  }
  console.log(`Index "${indexName}" recreated.`)

  await insertData(indexName)
})()
