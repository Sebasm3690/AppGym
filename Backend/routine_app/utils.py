import requests
from datetime import datetime
import pytz

FATSECRET_CLIENT_ID = "2b0fc94fe201432d97e0403929aa1459"
FATSECRET_CLIENT_SECRET = "fcd67c7af3834a76a1f6adc23483ede1"

def get_fatsecret_token():
    url = "https://oauth.fatsecret.com/connect/token"
    data = {
        "grant_type": "client_credentials",
        "client_id": FATSECRET_CLIENT_ID,
        "client_secret": FATSECRET_CLIENT_SECRET,
        "scope": "premier basic",
    }
    response = requests.post(url, data=data)
    if response.status_code == 200:
        return f"Bearer {response.json().get('access_token')}"
    else:
        print(f"Token Error: {response.status_code}, {response.json()}")
        return None

def search_food(query):
    token = get_fatsecret_token()
    if not token:
        print("Failed to retrieve token")
        return

    url = "https://platform.fatsecret.com/rest/foods/search/v3"
    headers = {"Authorization": token}
    params = {
        "search_expression": query,
        "page_number": "0",
        "format": "json",
    }

    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        print("Success:")#, response.json())
    else:
        print(f"Error: {response.status_code}, Details: {response.json()}")

# Test the function
search_food("apple")



def get_ecuador_datetime():
    """Returns the current datetime in Ecuador timezone."""
    ecuador_timezone = pytz.timezone('America/Guayaquil')
    return datetime.now(ecuador_timezone)
