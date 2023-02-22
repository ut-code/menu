import requests, re, json, datetime, isodate, sys, time
from bs4 import BeautifulSoup

from crawlTophits import crawlTophits


def is_json(json_str):
    """
    json_strがjson.loads可能か判定
    """
    result = False
    try:
        json.loads(json_str)
        result = True
    except json.JSONDecodeError as jde:
        print("[", json_str, "] is not in json format. \n", sys.exc_info())

    return result


def fixjson(data_text):
    """
    json形式の文字列に整えて、Pythonらしく辞書型に変換
    """

    # 空白を削除
    data_text = data_text.replace(" ", "")

    # "/r" "/n" "/t" を削除
    data_text = data_text.replace("\r", "")
    data_text = data_text.replace("\n", "")
    data_text = data_text.replace("\t", "")

    # レシピ形式じゃなかったら標準化しにくいので無視
    if '"@type":"recipe"' not in data_text and '"@type":"Recipe"' not in data_text:
        return None

    # 最初の文字が '{"' ではない場合は、その手前までの文字を取得
    if len(data_text) > 2 and data_text[:2] != '{"':
        prefix_num = data_text.find('{"')
        data_text = data_text[prefix_num:-prefix_num]

    # json形式に合わせるため、すべての末尾のカンマを削除
    # data_text = re.sub(r",\s*}", "}", data_text)
    # data_text = re.sub(r",\s*]", "]", data_text)

    if not is_json(data_text):
        return None
    else:
        return json.loads(data_text)


def extractRecipes(urls: list) -> list:
    recipe_dicts = []
    for url in urls:
        # ----------------------------------------------------------------
        # url先のHTMLから、"<script type="application/ld+json">" のタグで囲まれた場所を取得
        # ----------------------------------------------------------------
        request = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
        time.sleep(3)
        soup = BeautifulSoup(request.content, "html.parser")
        datas = soup.select("script[type='application/ld+json']")

        for data in datas:
            # ----------------------------------------------------------------
            # json形式の文字列を、Pythonらしく辞書型に変換
            # ----------------------------------------------------------------
            data_dict = fixjson(data.text)
            if not data_dict:
                continue

            # ----------------------------------------------------------------
            # 構造化データがRecipeの場合に記録
            # ----------------------------------------------------------------
            if type(data_dict) != dict:
                continue
            if "@type" not in data_dict.keys():  # Keyがない場合を考えて念のため
                continue
            if data_dict["@type"].lower() != "recipe":
                continue

            # ----------------------------------------------------------------
            # dict型に直す際に形式をなるべく整える
            # ----------------------------------------------------------------
            if "recipeIngredient" not in data_dict.keys():
                continue
            
            # URLはdata_dictに含まれないので別途追加
            data_dict["recipeUrl"] = url

            # image の型がstrならlist[str]に変換
            if "image" in data_dict.keys():
                if type(data_dict["image"]) == str:
                    data_dict["image"] = [data_dict["image"]]
            else:
                continue

            # keywords はカンマ区切りなのでリストに変換
            if "keywords" in data_dict:
                data_dict["keywords"] = data_dict["keywords"].split(",")
            else:  # keywordsがない場合は空リストを追加
                data_dict["keywords"] = []

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
                data_dict["totalTime"] = -1
                pass

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
