import requests
import base64
import os
from dotenv import load_dotenv

files = {
    'upload': open('/tmp/car.jpg', 'rb'),
    #'logo': open('/tmp/logo.jpg', 'rb'), # Addition of a logo, this item is optional
}


load_dotenv()


api_key = os.getenv('API_KEY_PLATE')

response = requests.post(
    'https://blur.platerecognizer.com/v1/blur',
    files=files,
    data={
        'plates': 10,
        'faces': 10,
        #'upload_url': 'https://app.platerecognizer.com/static/demo.jpg' # If necessary, using an image via URL
    },
    headers={"Authorization": f"Token {api_key}"})

if response.status_code == 200:
    res_data = response.json()
    if res_data.get('blur') is None:
        print('Blur on server is not enabled')
        print(res_data)
    else:
        with open('/tmp/blur-car.jpg', 'wb') as f:
            base64_encoded_data = response.json()['blur']['base64']
            decoded_bytes = base64.b64decode(base64_encoded_data)
            f.write(decoded_bytes)
else:
    print(f'Error: {response.text}')
    print(response.text)
