from __future__ import annotations
from supabase import create_client, Client
from dotenv import load_dotenv
from bs4 import BeautifulSoup
import os, requests, time


# ----------------------------------------------------------------
# Supabaseの接続情報（git操作の際は隠す）
# ----------------------------------------------------------------
load_dotenv()
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_ANON_KEY")

supabase: Client = create_client(url, key)


# ----------------------------------------------------------------
# クロール用の関数
# ----------------------------------------------------------------
def getCategories() -> list[str]:
    """Categoriesテーブルからカテゴリ名を取得する

    Parameters
    ----------
    None

    Returns
    -------
    category_names : list[str]
    """
    category_names = []
    response = supabase.table("Categories").select("*").execute()
    for category in response.data:
        category_names.append(category["categoryName"])
    return category_names


def crawlRecipeUrls(search_word: str, pages_num: int) -> list[str]:
    """カテゴリ名を指定してレシピのURLを取得する

    Parameters
    ----------
    search_word : str
    pages_num: int

    Returns
    -------
    recipe_urls : list[str]
    """
    recipe_urls = []
    # url = f"http://www.kyounoryouri.jp/search/recipe?keyword={search_word}&pg="
    url = f"https://www.lettuceclub.net/recipe/search/{search_word}/p"
    for page in range(1, pages_num+1):
        request = requests.get(url+str(page))
        if request.status_code==404 or request.status_code==301:
            break
        assert request.status_code==200
        soup = BeautifulSoup(request.content, "html.parser")
        recipe_urls += scrapeRecipeUrls(soup) 
    return recipe_urls


def scrapeRecipeUrls(soup: BeautifulSoup) -> list[str]:
    """BeautifulSoupオブジェクトからレシピのURLを取得する
    
    Parameters
    ----------
    soup : BeautifulSoup

    Returns
    -------
    recipe_urls : list[str]
    """
    recipe_urls = []
    # <div class="recipe--category-recipe"> から <a> タグを取得
    links = soup.select("li.p-items__item a[href]")
    for link in links:
        # link["href"]が"/recipe"から始まるURLのみを取得
        if link["href"].startswith("/recipe"):
            recipe_urls.append("https://www.lettuceclub.net" + link["href"])
    return recipe_urls


def submitRecipeUrls(recipe_urls: list[str]) -> None:
    """レシピのURLをSupabaseに登録する

    Parameters
    ----------
    recipe_urls : list[str]

    Returns
    -------
    None
    """
    for recipe_url in recipe_urls:
        supabase.table("Urls").insert({"url": recipe_url, "structured": True}).execute()

category_names = getCategories()
for i, category_name in enumerate(category_names):
    recipe_urls = crawlRecipeUrls(search_word=category_name, pages_num=1)
    submitRecipeUrls(recipe_urls=recipe_urls)
    time.sleep(1)
    print(f"{i+1} / {len(category_names)}: {category_name} is done.")