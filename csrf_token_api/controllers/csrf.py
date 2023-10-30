from odoo import http
from odoo.http import request

import json

class CSRFAPI(http.Controller):
  @http.route(['/api/web/csrf_token'], type='http', auth='public', methods=['GET'], csrf=False)
  def csrf_token(self, **payload):
    try:
      csrf_token = request.csrf_token()
      return json.dumps({'csrf_token': csrf_token})
    except Exception as e:
      return json.dumps({'error': str(e)})