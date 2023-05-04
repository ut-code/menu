
from supabase import create_client, Client
import pandas as pd

# ----------------------------------------------------------------
# Supabaseの接続情報（git操作の際は隠す）
# ----------------------------------------------------------------
url: str = "SUPABASE_URL"
key: str = "SUPABASE_ANON_KEY"

supabase: Client = create_client(url, key)

def translate() -> None:
    response = supabase.table("RecipesTmp").select("id, recipeTitle, recipeMaterial").execute()
    df = pd.DataFrame(response.data)

    # dfのrecipeTitle, recipeMaterialを翻訳してほしい
    return df

translate()

