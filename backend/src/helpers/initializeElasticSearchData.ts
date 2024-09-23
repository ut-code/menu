import * as fs from "fs"
import { parse } from "csv-parse/sync"
import { elasticSearchClient } from "../elasticSearchClient"
// import { analyzerSettings } from "./settings"

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
    settings: {
      analysis: {
        analyzer: {
          keyword_analyzer: {
            type: "custom",
            char_filter: ["normalize", "whitespaces"],
            tokenizer: "keyword",
            filter: ["lowercase", "trim", "maxlength"],
          },
          readingform_index_analyzer: {
            type: "custom",
            char_filter: ["normalize", "whitespaces"],
            tokenizer: "japanese_normal",
            filter: ["lowercase", "trim", "readingform", "asciifolding", "maxlength", "engram"],
          },
          readingform_search_analyzer: {
            type: "custom",
            char_filter: ["normalize", "whitespaces", "katakana", "romaji"],
            tokenizer: "japanese_normal",
            filter: ["lowercase", "trim", "maxlength", "readingform", "asciifolding"],
          },
        },
        char_filter: {
          normalize: {
            type: "icu_normalizer",
            name: "nfkc",
            mode: "compose",
          },
          katakana: {
            type: "mapping",
            mappings: [
              "ぁ=>ァ",
              "ぃ=>ィ",
              "ぅ=>ゥ",
              "ぇ=>ェ",
              "ぉ=>ォ",
              "っ=>ッ",
              "ゃ=>ャ",
              "ゅ=>ュ",
              "ょ=>ョ",
              "が=>ガ",
              "ぎ=>ギ",
              "ぐ=>グ",
              "げ=>ゲ",
              "ご=>ゴ",
              "ざ=>ザ",
              "じ=>ジ",
              "ず=>ズ",
              "ぜ=>ゼ",
              "ぞ=>ゾ",
              "だ=>ダ",
              "ぢ=>ヂ",
              "づ=>ヅ",
              "で=>デ",
              "ど=>ド",
              "ば=>バ",
              "び=>ビ",
              "ぶ=>ブ",
              "べ=>ベ",
              "ぼ=>ボ",
              "ぱ=>パ",
              "ぴ=>ピ",
              "ぷ=>プ",
              "ぺ=>ペ",
              "ぽ=>ポ",
              "ゔ=>ヴ",
              "あ=>ア",
              "い=>イ",
              "う=>ウ",
              "え=>エ",
              "お=>オ",
              "か=>カ",
              "き=>キ",
              "く=>ク",
              "け=>ケ",
              "こ=>コ",
              "さ=>サ",
              "し=>シ",
              "す=>ス",
              "せ=>セ",
              "そ=>ソ",
              "た=>タ",
              "ち=>チ",
              "つ=>ツ",
              "て=>テ",
              "と=>ト",
              "な=>ナ",
              "に=>ニ",
              "ぬ=>ヌ",
              "ね=>ネ",
              "の=>ノ",
              "は=>ハ",
              "ひ=>ヒ",
              "ふ=>フ",
              "へ=>ヘ",
              "ほ=>ホ",
              "ま=>マ",
              "み=>ミ",
              "む=>ム",
              "め=>メ",
              "も=>モ",
              "や=>ヤ",
              "ゆ=>ユ",
              "よ=>ヨ",
              "ら=>ラ",
              "り=>リ",
              "る=>ル",
              "れ=>レ",
              "ろ=>ロ",
              "わ=>ワ",
              "を=>ヲ",
              "ん=>ン",
            ],
          },
          romaji: {
            type: "mapping",
            mappings: [
              "キャ=>kya",
              "キュ=>kyu",
              "キョ=>kyo",
              "シャ=>sha",
              "シュ=>shu",
              "ショ=>sho",
              "チャ=>cha",
              "チュ=>chu",
              "チョ=>cho",
              "ニャ=>nya",
              "ニュ=>nyu",
              "ニョ=>nyo",
              "ヒャ=>hya",
              "ヒュ=>hyu",
              "ヒョ=>hyo",
              "ミャ=>mya",
              "ミュ=>myu",
              "ミョ=>myo",
              "リャ=>rya",
              "リュ=>ryu",
              "リョ=>ryo",
              "ファ=>fa",
              "フィ=>fi",
              "フェ=>fe",
              "フォ=>fo",
              "ギャ=>gya",
              "ギュ=>gyu",
              "ギョ=>gyo",
              "ジャ=>ja",
              "ジュ=>ju",
              "ジョ=>jo",
              "ヂャ=>ja",
              "ヂュ=>ju",
              "ヂョ=>jo",
              "ビャ=>bya",
              "ビュ=>byu",
              "ビョ=>byo",
              "ヴァ=>va",
              "ヴィ=>vi",
              "ヴ=>v",
              "ヴェ=>ve",
              "ヴォ=>vo",
              "ァ=>a",
              "ィ=>i",
              "ゥ=>u",
              "ェ=>e",
              "ォ=>o",
              "ッ=>t",
              "ャ=>ya",
              "ュ=>yu",
              "ョ=>yo",
              "ガ=>ga",
              "ギ=>gi",
              "グ=>gu",
              "ゲ=>ge",
              "ゴ=>go",
              "ザ=>za",
              "ジ=>ji",
              "ズ=>zu",
              "ゼ=>ze",
              "ゾ=>zo",
              "ダ=>da",
              "ヂ=>ji",
              "ヅ=>zu",
              "デ=>de",
              "ド=>do",
              "バ=>ba",
              "ビ=>bi",
              "ブ=>bu",
              "ベ=>be",
              "ボ=>bo",
              "パ=>pa",
              "ピ=>pi",
              "プ=>pu",
              "ペ=>pe",
              "ポ=>po",
              "ア=>a",
              "イ=>i",
              "ウ=>u",
              "エ=>e",
              "オ=>o",
              "カ=>ka",
              "キ=>ki",
              "ク=>ku",
              "ケ=>ke",
              "コ=>ko",
              "サ=>sa",
              "シ=>shi",
              "ス=>su",
              "セ=>se",
              "ソ=>so",
              "タ=>ta",
              "チ=>chi",
              "ツ=>tsu",
              "テ=>te",
              "ト=>to",
              "ナ=>na",
              "ニ=>ni",
              "ヌ=>nu",
              "ネ=>ne",
              "ノ=>no",
              "ハ=>ha",
              "ヒ=>hi",
              "フ=>fu",
              "ヘ=>he",
              "ホ=>ho",
              "マ=>ma",
              "ミ=>mi",
              "ム=>mu",
              "メ=>me",
              "モ=>mo",
              "ヤ=>ya",
              "ユ=>yu",
              "ヨ=>yo",
              "ラ=>ra",
              "リ=>ri",
              "ル=>ru",
              "レ=>re",
              "ロ=>ro",
              "ワ=>wa",
              "ヲ=>o",
              "ン=>n",
            ],
          },
          whitespaces: {
            type: "pattern_replace",
            pattern: "\\s{2,}",
            replacement: "\u0020",
          },
        },
        filter: {
          readingform: {
            type: "kuromoji_readingform",
            use_romaji: true,
          },
          engram: {
            type: "edge_ngram",
            min_gram: 1,
            max_gram: 36,
          },
          maxlength: {
            type: "length",
            max: 36,
          },
        },
        tokenizer: {
          japanese_normal: {
            mode: "normal",
            type: "kuromoji_tokenizer",
          },
        },
      },
    },
    body: {
      mappings: {
        properties: {
          id: { type: "text" },
          title: {
            type: "text",
            analyzer: "keyword_analyzer",
            fields: {
              readingform: {
                type: "text",
                analyzer: "readingform_index_analyzer",
                search_analyzer: "readingform_search_analyzer",
              },
            },
          },
          sourceUrl: { type: "text" },
          description: {
            type: "text",
            analyzer: "keyword_analyzer",
            fields: {
              readingform: {
                type: "text",
                analyzer: "readingform_index_analyzer",
                search_analyzer: "readingform_search_analyzer",
              },
            },
          },
          totalCookingTime: { type: "long" },
          materials: {
            type: "text",
            analyzer: "keyword_analyzer",
            fields: {
              readingform: {
                type: "text",
                analyzer: "readingform_index_analyzer",
                search_analyzer: "readingform_search_analyzer",
              },
            },
          },
          foodImageUrl: { type: "text" },
          dish: { type: "text" },
          category: { type: "text" },
          cuisine: { type: "text" },
        },
      },
    },
  })

  // 仮データの投入
  const records = readCsvFile("src/helpers/ignore/Recipes_rows.v2.csv")
  const filteredRecords = records.slice(0, 10)
  console.log(filteredRecords)

  // Bulk操作用のデータを作成
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bulkOperations = filteredRecords.flatMap((row: any) => [
    { index: { _index: indexName } }, // インデックス操作
    {
      id: row.id,
      title: row.title,
      sourceUrl: row.sourceUrl,
      description: row.description,
      totalCookingTime: parseInt(row.totalCookingTime, 10),
      materials: JSON.parse(row.materials),
      foodImageUrl: row.foodImageUrl,
      dish: row.dish,
      category: row.category,
      cuisine: row.cuisine,
    }, // 各レコードのデータ
  ])

  try {
    const bulkResponse = await elasticSearchClient.bulk({
      body: bulkOperations,
    })

    if (bulkResponse.errors) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const erroredDocuments = bulkResponse.items.filter((item: any) => item.index && item.index.error)
      console.error("Bulk insert errors:", erroredDocuments)
    } else {
      console.log("Bulk insert successful")
    }
  } catch (error) {
    console.error("Error during bulk insert:", error)
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
