"""
参考・引用したサイト(大変助かりました。ありがとうございました)
https://rurukblog.com/post/WebScraping-Google-Top/
"""
import requests, urllib.parse, time
from bs4 import BeautifulSoup

# schema.org/recipe の構造化データを取得できるサイト
whitelist = [
    "www.kurashiru.com",
    "www.kyounoryouri.jp",
    "www.lettuceclub.net",
    "www.tablemark.co.jp",
    "www.ebarafoods.com",
    "park.ajinomoto.co.jp",
    "www.ntv.co.jp/3min/",
    "www.meg-snow.com",
    "www.salad-cafe.com",
    "dancyu.jp",
    "www.yutori.co.jp",
    # "www.marukome.co.jp", o
    # "www.mizkan.co.jp", o
    # "kumiko-jp.com", o
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

# 明示的に型を指定する
def crawlTophits(search_word: str, pages_num: int) -> list:
    """
    search_word: Google検索するキーワードを設定
    pages_num: 上位から何件までのサイトを抽出するか指定する
    """
    print(f"【検索ワード】{search_word}")

    # ----------------------------------------------------------------
    # Googleから検索結果ページを取得する
    # ----------------------------------------------------------------
    url = f"https://www.google.co.jp/search?hl=ja&num={pages_num}&q={search_word}"
    try:
        request = requests.get(url)
    except Exception as e:
        print(e)
        return []
    time.sleep(3)

    # ----------------------------------------------------------------
    # Googleのページ解析を行う
    # ----------------------------------------------------------------
    soup = BeautifulSoup(request.content, "html.parser")
    search_site_list = soup.select("div.kCrYT > a")  # kCrYTはgoogleで使っているclass名

    # ----------------------------------------------------------------
    # ページ解析と結果の出力
    # ----------------------------------------------------------------
    used = set()
    for site in search_site_list:
        site_url = site["href"].replace("/url?q=", "")

        # urllib.parseを使用してドメインを取得
        domain = urllib.parse.urlparse(site_url).netloc
        if domain in whitelist and not ignoreLists(domain, site_url):
            site_url = unifyUrl(domain, site_url)
            if site_url in used:
                continue
            used.add(site_url)

            # 結果を出力する
            # print(str(len(used)) + "位: " + site_url)
    return list(used)


def ignoreLists(domain: str, url: str) -> bool:
    """
    一覧ページを除外する
    """
    if "search" in url:
        return True
    if domain=="park.ajinomoto.co.jp":
        if "corner" in url:
            return True
    elif domain=="www.lettuceclub.net":
        if "ingredient" in url or "category" in url or "coordinator" in url:
            return True
    elif domain=="www.kurashiru.com":
        if "articles" in url:
            return True
    elif domain=="www.kyounoryouri.jp":
        if "category" in url:
            return True

    return False


def unifyUrl(domain: str, url: str) -> str:
    if domain == "www.mizkan.co.jp":
        url = url.split("&")[0]
        url = url.replace("%3F", "?")
        url = url.replace("%3D", "=")
        return url
    
    # &以下を削除（原因は不明）
    url = url.replace("%3F", "&")
    url = url.split("&")[0]

    # 今日の料理の場合は、 https://www.kyounoryouri.jp/recipe/数字_ のうち"_"以降を削除する
    if domain == "www.kyounoryouri.jp":
        url = url.split("_")[0]
        return url

    return url


# print(crawlTophits(search_word="チキンソテー+レシピ", pages_num=100))
