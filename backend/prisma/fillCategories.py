"""
参考・引用したサイト(大変助かりました。ありがとうございました)
https://qiita.com/konitech913/items/7ffa7907a6c03c8909fc
https://github.com/supabase-community/supabase-py
https://laboratory.kazuuu.net/fetching-data-from-a-database-using-supabase-py-in-python/
"""

import pandas as pd
import requests, json

# dict型で取得
res = requests.get("https://app.rakuten.co.jp/services/api/Recipe/CategoryList/20170426?applicationId=1032749498491273405")
json_data = json.loads(res.text)

# mediumカテゴリの親カテゴリの辞書
parent_dict = {}

df = pd.DataFrame(columns=["category1", "category2", "category3", "categoryId", "categoryName"])

# 大カテゴリ
for category in json_data["result"]["large"]:
    df = df.append({"category1":category["categoryId"],"category2":"","category3":"","categoryId":category["categoryId"],"categoryName":category["categoryName"]}, ignore_index=True)

# 中カテゴリ
for category in json_data["result"]["medium"]:
    df = df.append({"category1":category["parentCategoryId"],"category2":category["categoryId"],"category3":"","categoryId":str(category["parentCategoryId"])+"-"+str(category["categoryId"]),"categoryName":category["categoryName"]}, ignore_index=True)
    parent_dict[str(category["categoryId"])] = category["parentCategoryId"]

# 小カテゴリ
for category in json_data["result"]["small"]:
    df = df.append({"category1":parent_dict[category["parentCategoryId"]],"category2":category["parentCategoryId"],"category3":category["categoryId"],"categoryId":parent_dict[category["parentCategoryId"]]+"-"+str(category["parentCategoryId"])+"-"+str(category["categoryId"]),"categoryName":category["categoryName"]}, ignore_index=True)

#----------------------------

from supabase import create_client, Client

url: str = "SUPABASE_URL"
key: str = "SUPABASE_ANON_KEY"

supabase: Client = create_client(url, key)

for i in range(len(df)):
    dfi = df.loc[i]
    # category3だけint型らしい...
    supabase.table("Categories").insert({"category1": str(dfi["category1"]), "category2": str(dfi["category2"]), "category3": str(dfi["category3"]), "categoryId": str(dfi["categoryId"]), "categoryName": str(dfi["categoryName"])}).execute()
    # supabase.table("Message").insert({"content": "from supabase-py"}).execute()
