from supabase import create_client, Client

from crawlTophits import crawlTophits
from extractRecipes import extractRecipes

url: str = "SUPABASE_URL"
key: str = "SUPABASE_ANON_KEY"

supabase: Client = create_client(url, key)


def addRecipes(recipe_dicts: list) -> None:
    for recipe_dict in recipe_dicts:
        supabase.table("Recipes").insert(
            {
                "recipeTitle": recipe_dict["name"],
                "recipeUrl": recipe_dict["recipeUrl"],
                "recipeDescription": recipe_dict["description"],
                "foodImageUrl": recipe_dict["image"],
                "keywords": recipe_dict["keywords"],
                "totalTime": recipe_dict["totalTime"],
                "recipeIngredients": recipe_dict["recipeIngredient"],
            }
        ).execute()


site_urls = crawlTophits(search_word="チキンソテー+レシピ", pages_num=20)
recipe_dicts = extractRecipes(site_urls)
addRecipes(recipe_dicts)
