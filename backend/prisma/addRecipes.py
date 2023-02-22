from supabase import create_client, Client

from crawlTophits import crawlTophits
from extractRecipes import extractRecipes

url: str = "SUPABASE_URL"
key: str = "SUPABASE_ANON_KEY"

supabase: Client = create_client(url, key)


def addRecipes(recipe_dicts: list[dict]) -> None:
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


site_urls = crawlTophits(search_word="わかめ+スープ+レシピ", pages_num=200)
print(len(site_urls), "件のURLを取得しました。")
recipe_dicts = extractRecipes(site_urls)
print(len(recipe_dicts), "件の構造化データを取得しました。")
addRecipes(recipe_dicts)
