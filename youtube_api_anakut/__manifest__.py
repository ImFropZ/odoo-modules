# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.
{
    'name' : 'Youtube API anakut',
    'version' : '1.0',
    'summary': 'Youtube API anakut',
    'sequence': -1,
    'description': """
    """,
    'category': 'API',
    'depends' : ['website', 'web'],
    'data': [
        "views/snippets/s_youtube_videos.xml",
        "views/snippets/snippets.xml",
    ],
    'installable': True,
    'application': True,
    'assets': {
        'web.assets_frontend': [
            'youtube_api_anakut/static/src/xml/*.xml'
        ]
    },
    'license': 'LGPL-3',
}
