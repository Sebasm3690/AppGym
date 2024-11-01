import requests
from requests_oauthlib import OAuth1

# Your FatSecret credentials from the developer portal
CONSUMER_KEY = "2b0fc94fe201432d97e0403929aa1459"
CONSUMER_SECRET = "fcd67c7af3834a76a1f6adc23483ede1"

# OAuth1 setup for obtaining the Request Token

oauth = OAuth1(CONSUMER_KEY, client_secret=CONSUMER_SECRET)

# FatSecret API URL for OAuth request token
request_token_url = "https://fatsecret4.p.rapidapi.com/oauth/request_token"

# Make the request to obtain OAuth tokens
response = requests.post(request_token_url, auth=oauth)

if response.status_code == 200:
    credentials = dict(x.split('=') for x in response.text.split('&'))
    oauth_token = credentials['oauth_token']
    oauth_token_secret = credentials['oauth_token_secret']
    
    print(f"OAuth Token: {oauth_token}")
    print(f"OAuth Token Secret: {oauth_token_secret}")
else:
    print(f"Failed to obtain tokens: {response.status_code}")
