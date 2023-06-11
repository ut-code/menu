from __future__ import annotations
from supabase import create_client, Client
from dotenv import load_dotenv
from bs4 import BeautifulSoup
import os, requests, time, json, isodate, datetime


# ----------------------------------------------------------------
# Supabaseの接続情報（git操作の際は隠す）
# ----------------------------------------------------------------
load_dotenv()
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_ANON_KEY")

supabase: Client = create_client(url, key)


# ----------------------------------------------------------------
# スクレイピング用の関数
# ----------------------------------------------------------------
def getRecipeUrls() -> list[dict]:
    """UrlsテーブルからURLを取得する

    Parameters
    ----------
    None

    Returns
    -------
    category_names : list[str]
    """
    recipe_urls = []
    response = supabase.table("Urls").select("*").execute()
    for recipe in response.data:
        recipe_urls.append(recipe)
    return recipe_urls


def fixJsonLoadError(data_text: str) -> str or None:
    """json.loads()でエラーが出る場合に修正する
    
    Parameters
    ----------
    data_text : str
    
    Returns
    -------
    data_text : str or None
    """

    # 空白を削除
    data_text = data_text.replace(" ", "")

    # "/r" "/n" "/t" を削除
    data_text = data_text.replace("\r", "")
    data_text = data_text.replace("\n", "")
    data_text = data_text.replace("\t", "")
    
    # <ahrefが含まれる場合はNoneを返す
    if '<ahref' in data_text:
        return None

    # 最初の文字が '{"' ではない場合は、その手前までの文字を取得
    if len(data_text) > 2 and data_text[:2] != '{"':
        prefix_num = data_text.find('{"')
        data_text = data_text[prefix_num:-prefix_num]
    
    return data_text


def findStructuredData(soup: BeautifulSoup) -> dict:
    """構造化データを取得する

    Parameters
    ----------
    soup : BeautifulSoup

    Returns
    -------
    structured_data : dict
    """
    structured_data = {}
    datas = soup.select("script[type='application/ld+json']")
    for data in datas:
        # json形式のデータを辞書型に変換
        data = fixJsonLoadError(data.text)
        if data is None:
            continue
        data = json.loads(data)
        if type(data) == dict and "@type" in data and data["@type"].lower() == "recipe":
            structured_data = data
            break
    return structured_data


def convertUrlToSoup(url: str) -> BeautifulSoup:
    """URLを取得する

    Parameters
    ----------
    urls : str
    

    Returns
    -------
    soup : BeautifulSoup
    """
    request = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
    assert request.status_code==200
    soup = BeautifulSoup(request.content, "html.parser")
    return soup


def calcTotalTime(recipe: dict) -> int:
    """timeを分表記に変換する

    Parameters
    ----------
    recipe : dict

    Returns
    -------
    totalTime : int
    """
    if "totalTime" in recipe:
        # totalTime は表記が ISO 8601 形式なので datatime.timedelta 形式に変換
        td: datetime.timedelta = isodate.parse_duration(recipe["totalTime"])

        # timedeltaを分に変換
        return td.seconds // 60

    elif "cookTime" in recipe and "prepTime" in recipe:
        # cookTime, prepTime は表記が ISO 8601 形式なので datatime.timedelta 形式に変換
        td1: datetime.timedelta = isodate.parse_duration(recipe["cookTime"])
        td2: datetime.timedelta = isodate.parse_duration(recipe["prepTime"])

        # timedeltaを分に変換
        return (td1.seconds + td2.seconds) // 60

    else:
        # totalTimeも cookTime + prepTime もない場合は追加しない
        # が、そこまで totalTime の有無に厳しくする必要があるかは不明
        return -1


def fixRecipeMaterial(recipe_material: list[str]) -> list[str]:
    """材料の表記を修正する
    
    Parameters
    ----------
    recipe_material : list[str]
    
    Returns
    -------
    recipe_material : list[str]
    """
    res = []
    for material in recipe_material:
        # 先頭が"・"の場合は削除
        material = material.replace("・", "")
        # 先頭が"★"の場合は削除
        material = material.replace("★", "")
        # 先頭が"☆"の場合は削除
        material = material.replace("☆", "")
        res.append(material)
    return res


def fixRecipeKeywords(recipe: dict) -> list[str]:
    """キーワードの表記を修正する
    
    Parameters
    ----------
    recipe : dict
    
    Returns
    -------
    keywords : list[str]
    """
    if "keywords" in recipe:
        if type(recipe["keywords"]) == list:
            return recipe["keywords"]
        else:
            return recipe["keywords"].split(",")
    else:
        return []


def submitRecipe(recipe: dict, recipe_url: str) -> None:
    """レシピの情報をSupabaseに登録する

    Parameters
    ----------
    recipe : dict
    recipe_url : str
    
    Returns
    -------
    None
    """
    response = supabase.table("Recipes").insert([
        {
            "recipeDescription": recipe["description"],
            "keywords": fixRecipeKeywords(recipe),
            "totalTime": calcTotalTime(recipe),
            "recipeTitle": recipe["name"],
            "recipeUrl": recipe_url,
            "foodImageUrls": recipe["image"] if type(recipe["image"]) == list else [recipe["image"]],
            "recipeMaterial": fixRecipeMaterial(recipe["recipeIngredient"]),
        }
    ]).execute()
    print(f"inserted {response.data[0]['recipeTitle']}")


recipe_urls = getRecipeUrls()
for i, recipe_url in enumerate(recipe_urls):
    soup = convertUrlToSoup(recipe_url["url"])
    if recipe_url["structured"]:
        data = findStructuredData(soup)
        if data == {}:
            continue
        print(data)
        submitRecipe(recipe=data, recipe_url=recipe_url["url"])
    else:
        pass
    
    print(f"{i+1}/{len(recipe_urls)} is done")
    time.sleep(1)
