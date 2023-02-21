import requests, json, datetime, isodate
from bs4 import BeautifulSoup

from crawlTophits import crawlTophits


def extractRecipes(urls: list) -> list:
    recipe_dicts = []
    for url in urls:
        # ----------------------------------------------------------------
        # url先のHTMLから、"<script type="application/ld+json">" のタグで囲まれた場所を取得
        # ----------------------------------------------------------------
        request = requests.get(url)
        soup = BeautifulSoup(request.text, "html.parser")
        datas = soup.select("script[type='application/ld+json']")

        for data in datas:
            # JSON形式の文字列を、Pythonらしく辞書型に変換
            data_dict = json.loads(data.text)

            # ----------------------------------------------------------------
            # 構造化データがRecipeの場合に記録
            # ----------------------------------------------------------------
            if "@type" not in data_dict:  # Keyがない場合を考えて念のため
                continue
            if data_dict["@type"].lower() != "recipe":
                continue
            
            # ----------------------------------------------------------------
            # dict型に直す際に形式をなるべく整える
            # ----------------------------------------------------------------
            # URLはdata_dictに含まれないので別途追加
            data_dict["recipeUrl"] = url

            # keywords はカンマ区切りなのでリストに変換
            if "keywords" in data_dict:
                data_dict["keywords"] = data_dict["keywords"].split(",")

            if "totalTime" in data_dict:
                # totalTime は表記が ISO 8601 形式なので datatime.timedelta 形式に変換
                td: datetime.timedelta = isodate.parse_duration(data_dict["totalTime"])

                # timedeltaを分に変換
                data_dict["totalTime"] = td.seconds // 60

            elif "cookTime" in data_dict and "prepTime" in data_dict:
                # cookTime, prepTime は表記が ISO 8601 形式なので datatime.timedelta 形式に変換
                td1: datetime.timedelta = isodate.parse_duration(data_dict["cookTime"])
                td2: datetime.timedelta = isodate.parse_duration(data_dict["prepTime"])

                # timedeltaを分に変換
                data_dict["totalTime"] = (td1.seconds + td2.seconds) // 60

            else:
                # totalTimeも cookTime + prepTime もない場合は追加しない
                # が、そこまで totalTime の有無に厳しくする必要があるかは不明
                continue

            # recipeIngredient に余計な記号が入っていたら削除
            new = []
            for ingredient in data_dict["recipeIngredient"]:
                # 先頭が"・"の場合は削除
                ingredient = ingredient.replace("・", "")
                # 先頭が"★"の場合は削除
                ingredient = ingredient.replace("★", "")
                # 先頭が"☆"の場合は削除
                ingredient = ingredient.replace("☆", "")

                new.append(ingredient)
            data_dict["recipeIngredient"] = new

            recipe_dicts.append(data_dict)
            break
    return recipe_dicts


# site_urls = crawlTophits(search_word="チキンソテー+レシピ", pages_num=20)
# recipe_dicts = extractRecipes(site_urls)
# for key, value in recipe_dicts[1].items():
#     print(f"{key}: {value}")
