from supabase import create_client, Client
import time

from crawlTophits import crawlTophits
from extractRecipes import extractRecipes

# ----------------------------------------------------------------
# Supabaseの接続情報（git操作の際は隠す）
# ----------------------------------------------------------------
url: str = "SUPABASE_URL"
key: str = "SUPABASE_ANON_KEY"

supabase: Client = create_client(url, key)


# ----------------------------------------------------------------
# Recipesテーブルにレシピ情報を追加する
# ----------------------------------------------------------------
def addRecipes(recipe_dicts: list[dict]) -> None:
    """
    recipe_dicts: 必要以上の情報が含まれるdict型の配列
    """
    for recipe_dict in recipe_dicts:
        new_recipe_dict = {
            "recipeTitle": recipe_dict["name"],
            "recipeUrl": recipe_dict["recipeUrl"],
            "recipeDescription": recipe_dict["description"],
            "foodImageUrls": recipe_dict["image"],
            "keywords": recipe_dict["keywords"],
            "totalTime": int(recipe_dict["totalTime"]),
            "recipeIngredients": recipe_dict["recipeIngredient"],
        }

        try:
            supabase.table("Recipes").insert(new_recipe_dict).execute()
        except Exception as e:  # エラー出るけど原因不明？なので気にしない
            print(e)
    print(len(recipe_dicts), "件のレシピを追加しました。")


def getCategories() -> list[str]:
    category_names = []
    response = supabase.table("Categories").select("*").execute()
    for category in response.data:
        category_names.append(category["categoryName"])
    return category_names


category_names = getCategories() # max=2434に変更
for category_name in category_names[76:]:
    site_urls = crawlTophits(search_word=category_name+"+レシピ", pages_num=50)
    print(len(site_urls), "件のURLを取得しました。")
    recipe_dicts = extractRecipes(site_urls)
    print(len(recipe_dicts), "件の構造化データを取得しました。")
    addRecipes(recipe_dicts)
    
    time.sleep(3)
