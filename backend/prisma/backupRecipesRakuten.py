from supabase import create_client, Client
import json, csv

# ----------------------------------------------------------------
# Supabaseの接続情報（git操作の際は隠す）
# ----------------------------------------------------------------
url: str = "SUPABASE_URL"
key: str = "SUPABASE_ANON_KEY"

supabase: Client = create_client(url, key)

for table_name in ["Categories", "Message", "Recipes", "RecipesTmp"]:
    response = supabase.table(table_name).select("*").execute()
    res_json = response.json()
    data = json.loads(res_json)
    data = data["data"]

    # CSVファイルを作成
    with open(f"{table_name}.csv", "w", encoding="utf-8") as f:
        # ヘッダーを書き込み
        writer = csv.writer(f)
        writer.writerow(data[0].keys())
        # データを書き込み
        for row in data:
            writer.writerow(row.values())
