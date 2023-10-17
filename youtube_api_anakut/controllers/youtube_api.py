from odoo import http
from odoo.http import request

import json
import requests
import logging

_logger = logging.getLogger(__name__)

class YoutubeAPI(http.Controller):
    @http.route(['/api/youtube/<channel_id>/videos'], type='http', auth='public', methods=['GET'], csrf=False)
    def query_videos(self, **payload):
        try:
            API_KEY = 'AIzaSyDTFpWxQjN8bS5a1oiBeV5OmcvBHB4geaU'
            CHANNEL_ID = payload['channel_id']
            max_results = payload.get('max_results', 10)
            page_token = payload.get('page_token', None)

            end_point = "https://www.googleapis.com/youtube/v3/search"

            # Add part
            end_point += "?part=snippet"

            # Add channel id
            end_point += f"&channelId={CHANNEL_ID}"

            # Add max results
            end_point += f"&maxResults={max_results}"

            # Add order
            end_point += "&order=date"

            # Add key
            end_point += f"&key={API_KEY}"

            # Add next page token
            if page_token:
                end_point += f"&pageToken={page_token}"

            response = requests.get(end_point)
            return json.dumps(response.json())
        except Exception as e:
            return json.dumps({'error': str(e)})
