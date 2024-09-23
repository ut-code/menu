// import * as fs from "fs"
// import { parse } from "csv-parse/sync"

// function readCsvFile(filePath: string) {
//   const file = fs.readFileSync(filePath, "utf-8")
//   const records = parse(file, { columns: true, bom: true })
//   return records
// }

// async function createIndexAndInsertData(indexName: string) {
//   // インデックスの再作成
//   // fetchAPIでリクエストを送信する
//   const response = await fetch("https://dull-meshi-app-backend.onrender.com/api/recipes/recipe", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       index: indexName,
//     }),
//   })

//   if (!response.ok) {
//     throw new Error("Failed to recreate index")
//   }
//   console.log(`Index "${indexName}" recreated.`)

//   // 仮データの投入
//   // const records = readCsvFile("src/helpers/ignore/Recipes_rows.v2.csv")
//   // const filteredRecords = records.slice(0, 10)
//   // console.log(filteredRecords)

//   // for (const row of filteredRecords) {
//   //   await elasticSearchClient.index({
//   //     index: indexName,
//   //     body: {
//   //       id: row.id,
//   //       title: row.title,
//   //       sourceUrl: row.sourceUrl,
//   //       description: row.description,
//   //       totalCookingTime: parseInt(row.totalCookingTime),
//   //       materials: JSON.parse(row.materials),
//   //       foodImageUrl: row.foodImageUrl,
//   //       dish: row.dish,
//   //       category: row.category,
//   //       cuisine: row.cuisine,
//   //     },
//   //   })
//   // }

//   // // インデックスを最新の状態にリフレッシュ
//   // await elasticSearchClient.indices.refresh({ index: indexName })

//   // console.log(`Index "${indexName}" created and data inserted.`)
// }

;(async () => {
  const indexName = "recipes"
  // インデックスの再作成
  const response = await fetch("https://dull-meshi-app-backend.onrender.com/api/recipes/recipe", {
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
})()
