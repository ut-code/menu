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
    # url = f"https://www.lettuceclub.net/recipe/search/{search_word}/p"
    # url = f"https://www.ebarafoods.com/recipe/results.html?q={search_word}&page="
    # url = f"https://park.ajinomoto.co.jp/recipe/search/?search_word={search_word}&tab=pop&o="
    # url = f"https://www.ntv.co.jp/3min/search/?q={search_word}&sort=0&page="
    # url = f"https://www.salad-cafe.com/?s={search_word}&post_type=recipe"
    # url = f"https://www.mizkan.co.jp/qssearch.jsp?searchGenre=recipe_k&indexname=MenuRecipeIndex&metainfoOption1=2&metainfoOption2=1&metainfoOption3=2&metainfoOption4=2&info_is_and=true&sort=metainfonum1+desc&searchtype=kw&limit=30&contentgroup=MenuRecipeGroup&search={search_word}&metainfo3=%2C1-1%2C&metainfo3=%2C1-2%2C&metainfo3=%2C1-3%2C&metainfo3=%2C1-4%2C&metainfo3=%2C1-5%2C&metainfo3=%2C1-6%2C&metainfo3=%2C1-7%2C&metainfo3=%2C1-8%2C"
    url = f"https://recipe.yamasa.com/search/q?order=popular&s={search_word}"
    for page in range(1, pages_num+1):
        request = requests.get(url) #+str(page))
        if request.status_code < 200 or request.status_code >= 300:
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
    links = soup.select("div.col-sm-6.col-xs-12 a[href]")

    for link in links:
        # link["href"]が"/recipe"から始まるURLのみを取得
        if link["href"].startswith("/recipe"):
            recipe_urls.append("https://recipe.yamasa.com" + link["href"])
        # recipe_urls.append(link["href"])
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
category_names = category_names[:]
for i, category_name in enumerate(category_names):
    recipe_urls = crawlRecipeUrls(search_word=category_name, pages_num=1)
    submitRecipeUrls(recipe_urls=recipe_urls)
    time.sleep(1)
    print(f"{i+1} / {len(category_names)}: {category_name} is done.")