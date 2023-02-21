"""
参考・引用したサイト(大変助かりました。ありがとうございました)
https://rurukblog.com/post/WebScraping-Google-Top/
"""
import requests, urllib.parse
from bs4 import BeautifulSoup

# schema.org/recipe の構造化データを取得できるサイト
whitelist = [
    "www.kurashiru.com",
    "www.kyounoryouri.jp",
    "www.lettuceclub.net",
    "www.tablemark.co.jp",
    "www.ebarafoods.com",
    "www.marukome.co.jp",
    "park.ajinomoto.co.jp",
    "www.ntv.co.jp/3min/",
    "www.mizkan.co.jp",
    "www.meg-snow.com",
    "www.salad-cafe.com",
    "kumiko-jp.com",
    "dancyu.jp",
    "www.yutori.co.jp",
    # "recipe.yamasa.com", o
    # "www.nipponham.co.jp", o
    # "www.kikkoman.co.jp", o
    # "www.sirogohan.com", o
    # "erecipe.woman.excite.co.jp", x
    # "www.momoya.co.jp", x
    # "www.yamaki.co.jp", x
    # "www.abc-cooking.co.jp", x
    # "www.nisshin-oillio.com", x
    # "www.morinagamilk.co.jp", x
    # "www.j-oil.com", x
    # "www.asahimatsu.co.jp", x
    # "www.itoham.co.jp", x
]

def crawlTophits(search_word, pages_num=16):
    print(f"【検索ワード】{search_word}")

    # ----------------------------------------------------------------
    # Googleから検索結果ページを取得する
    # ----------------------------------------------------------------
    url = f"https://www.google.co.jp/search?hl=ja&num={pages_num}&q={search_word}"
    request = requests.get(url)

    # ----------------------------------------------------------------
    # Googleのページ解析を行う
    # ----------------------------------------------------------------
    soup = BeautifulSoup(request.text, "html.parser")
    search_site_list = soup.select("div.kCrYT > a")  # kCrYTはgoogleで使っているclass名

    # ----------------------------------------------------------------
    # ページ解析と結果の出力
    # ----------------------------------------------------------------
    used = set()
    for site in search_site_list:
        # try:
        #     site_title = site.select("h3.zBAuLc")[0].text
        # except IndexError:
        #     site_title = site.select("img")[0]["alt"]

        site_url = site["href"].replace("/url?q=", "")
        # レシピページではなく検索ページならスキップ
        if "search" in site_url:
            continue

        # urllib.parseを使用してドメインを取得
        domain = urllib.parse.urlparse(site_url).netloc

        if domain in whitelist:
            site_url = checkDomain(domain, site_url)
            if site_url in used:
                continue
            used.add(site_url)

            # 結果を出力する
            print(str(len(used)) + "位: " + site_url)


def checkDomain(domain, url):
    # &以下を削除（原因は不明）
    url = url.replace("%3F", "&")
    url = url.split("&")[0]

    # 今日の料理の場合は、 https://www.kyounoryouri.jp/recipe/数字_ のうち"_"以降を削除する
    if domain == "www.kyounoryouri.jp":
        url = url.split("_")[0]

    return url


search_word = "チキンソテー+レシピ"  # Google検索するキーワードを設定
pages_num = 20  # 上位から何件までのサイトを抽出するか指定する
crawlTophits(search_word, pages_num)
