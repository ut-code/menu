import requests, json
from bs4 import BeautifulSoup

from crawlTophits import crawlTophits


def extractRecipes(urls: list) -> list:
    site_dicts = []
    for url in urls:
        # url先のHTMLから、"<script type="application/ld+json">" のタグで囲まれた場所を取得
        request = requests.get(url)
        soup = BeautifulSoup(request.text, "html.parser")
        datas = soup.select("script[type='application/ld+json']")

        for data in datas:
            # JSON形式の文字列を、Pythonらしく辞書型に変換
            data_dict = json.loads(data.text)
            if "@type" not in data_dict: # Keyがない場合を考えて念のため
                continue

            # 構造化データがRecipeの場合は記録
            if data_dict["@type"].lower() == "recipe":
                site_dicts.append(data_dict)
                break
    return site_dicts


site_urls = crawlTophits(search_word="チキンソテー+レシピ", pages_num=20)
print(extractRecipes(site_urls))
