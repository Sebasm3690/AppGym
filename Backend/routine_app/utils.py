import requests
from django.conf import settings
from django.core.cache import cache

def get_fatsecret_token():
    # 1. Check if we already have a valid token saved in the cache
    token = cache.get('fatsecret_access_token')
    if token:
        return token

    # 2. If no token exists, request a new one from FatSecret
    token_url = 'https://oauth.fatsecret.com/connect/token'
    data = {'grant_type': 'client_credentials'}
    
    # Grab the keys from your .env file
    client_id = settings.FATSECRET_CLIENT_ID
    client_secret = settings.FATSECRET_CLIENT_SECRET
    
    try:
        response = requests.post(token_url, data=data, auth=(client_id, client_secret))
        
        if response.status_code == 200:
            token_data = response.json()
            access_token = token_data['access_token']
            
            # FatSecret tokens usually expire in 24 hours (86400 seconds). 
            # We cache it for slightly less time to be safe.
            expires_in = token_data.get('expires_in', 86400)
            cache.set('fatsecret_access_token', access_token, timeout=expires_in - 300)
            
            return access_token
        else:
            print(f"Failed to get FatSecret token: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        print(f"Error connecting to FatSecret API: {e}")
        return None