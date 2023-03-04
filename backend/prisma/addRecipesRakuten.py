from supabase import create_client, Client
import time
import requests
import json

# ----------------------------------------------------------------
# Supabaseの接続情報（git操作の際は隠す）
# ----------------------------------------------------------------
url: str = "SUPABASE_URL"
key: str = "SUPABASE_ANON_KEY"

supabase: Client = create_client(url, key)


# CategoriesテーブルからcategoryIdを取得する
response = supabase.table("Categories").select("categoryId").execute()
res_json = response.json()
data = json.loads(res_json)
categoryIds = data["data"]

# ----------------------------------------------------------------
# Recipesテーブルにレシピ情報を追加する
# ----------------------------------------------------------------
rakutenUrl = "https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426?applicationId=1032749498491273405&categoryId="
for categoryId in categoryIds:
    time.sleep(3)
    # レシピ情報を取得
    response = requests.get(rakutenUrl + categoryId["categoryId"])
    # レシピ情報をJSON形式に変換
    data = json.loads(response.text)
    if "result" not in data.keys():
        continue
    recipes = data["result"]

    for recipe in recipes:
        totalTime = recipe["recipeIndication"]
        if "約" in totalTime:
            totalTime = totalTime.replace("約", "")
        if "分" in totalTime:
            totalTime = totalTime.replace("分", "")
        
        # totalTimeが数字だったらint型に変換
        if totalTime.isdecimal():
            totalTime = int(totalTime)
        else:
            totalTime = -1
        
        # レシピ情報を追加
        try:
            supabase.table("RecipesTmp").insert(
                {
                    "recipeTitle": recipe["recipeTitle"],
                    "recipeUrl": recipe["recipeUrl"],
                    "recipeDescription": recipe["recipeDescription"],
                    "foodImageUrls": [recipe["foodImageUrl"]],
                    "keywords": [],  # recipeDescriptionから抽出したらいい?
                    "totalTime": totalTime,
                    "recipeMaterial": recipe["recipeMaterial"],
                }
            ).execute()
            time.sleep(1)
        except:
            print("error")
