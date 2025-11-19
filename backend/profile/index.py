"""
Business: Get and update user profile, personality traits, knowledge base
Args: event with httpMethod GET/POST/PUT, body for updates
Returns: User profile data with personality and knowledge
"""

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    """Create database connection"""
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """Main handler for profile endpoint"""
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'GET':
        try:
            conn = get_db_connection()
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("SELECT * FROM user_profile WHERE id = 1")
                profile = cur.fetchone()
                
                cur.execute("""
                    SELECT trait_name, trait_value, description 
                    FROM personality_traits 
                    WHERE user_id = 1 
                    ORDER BY trait_value DESC
                """)
                traits = cur.fetchall()
                
                cur.execute("""
                    SELECT category, COUNT(*) as count 
                    FROM knowledge_base 
                    WHERE user_id = 1 
                    GROUP BY category
                """)
                knowledge_stats = cur.fetchall()
                
                cur.execute("""
                    SELECT COUNT(*) as total_conversations,
                           COUNT(DISTINCT DATE(started_at)) as active_days
                    FROM conversations 
                    WHERE user_id = 1
                """)
                stats = cur.fetchone()
                
                cur.execute("""
                    SELECT situation_type, COUNT(*) as count, 
                           AVG(confidence_score) as avg_confidence
                    FROM behavior_patterns 
                    WHERE user_id = 1 
                    GROUP BY situation_type 
                    ORDER BY count DESC
                """)
                behavior_stats = cur.fetchall()
            
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'profile': dict(profile) if profile else None,
                    'traits': [dict(t) for t in traits],
                    'knowledgeStats': [dict(k) for k in knowledge_stats],
                    'stats': dict(stats) if stats else {},
                    'behaviorStats': [dict(b) for b in behavior_stats]
                }, default=str)
            }
            
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': str(e)})
            }
    
    if method == 'PUT':
        try:
            body = json.loads(event.get('body', '{}'))
            conn = get_db_connection()
            
            if 'profile' in body:
                profile_data = body['profile']
                with conn.cursor() as cur:
                    cur.execute("""
                        UPDATE user_profile 
                        SET name = %s, birth_date = %s, location = %s, 
                            occupation = %s, bio = %s, updated_at = CURRENT_TIMESTAMP
                        WHERE id = 1
                    """, (
                        profile_data.get('name'),
                        profile_data.get('birth_date'),
                        profile_data.get('location'),
                        profile_data.get('occupation'),
                        profile_data.get('bio')
                    ))
                conn.commit()
            
            if 'traits' in body:
                with conn.cursor() as cur:
                    for trait in body['traits']:
                        cur.execute("""
                            UPDATE personality_traits 
                            SET trait_value = %s, updated_at = CURRENT_TIMESTAMP
                            WHERE user_id = 1 AND trait_name = %s
                        """, (trait['value'], trait['name']))
                conn.commit()
            
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True})
            }
            
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': str(e)})
            }
    
    if method == 'POST':
        try:
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            conn = get_db_connection()
            
            if action == 'add_knowledge':
                with conn.cursor() as cur:
                    cur.execute("""
                        INSERT INTO knowledge_base 
                        (user_id, category, topic, content, importance) 
                        VALUES (1, %s, %s, %s, %s)
                    """, (
                        body.get('category'),
                        body.get('topic'),
                        body.get('content'),
                        body.get('importance', 3)
                    ))
                conn.commit()
                
            elif action == 'add_preference':
                with conn.cursor() as cur:
                    cur.execute("""
                        INSERT INTO preferences 
                        (user_id, category, item, preference_type, intensity, notes) 
                        VALUES (1, %s, %s, %s, %s, %s)
                    """, (
                        body.get('category'),
                        body.get('item'),
                        body.get('type', 'like'),
                        body.get('intensity', 3),
                        body.get('notes')
                    ))
                conn.commit()
            
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True})
            }
            
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': str(e)})
            }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }
