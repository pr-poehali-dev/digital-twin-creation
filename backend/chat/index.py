"""
Business: AI chat endpoint for digital twin - processes messages, learns behavior, maintains context
Args: event with httpMethod POST, body with message and conversationId
Returns: AI response with learned personality patterns
"""

import json
import os
from typing import Dict, Any, List, Optional
import psycopg2
from psycopg2.extras import RealDictCursor
from openai import OpenAI

def get_db_connection():
    """Create database connection using DATABASE_URL"""
    return psycopg2.connect(os.environ['DATABASE_URL'])

def get_conversation_history(conn, conversation_id: int, limit: int = 10) -> List[Dict[str, str]]:
    """Get recent messages from conversation"""
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT role, content 
            FROM messages 
            WHERE conversation_id = %s 
            ORDER BY created_at DESC 
            LIMIT %s
        """, (conversation_id, limit))
        messages = cur.fetchall()
        return [{"role": msg["role"], "content": msg["content"]} for msg in reversed(messages)]

def get_personality_context(conn, user_id: int = 1) -> str:
    """Build personality context from database"""
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT trait_name, trait_value, description 
            FROM personality_traits 
            WHERE user_id = %s
        """, (user_id,))
        traits = cur.fetchall()
        
        cur.execute("""
            SELECT content 
            FROM knowledge_base 
            WHERE user_id = %s 
            ORDER BY importance DESC, created_at DESC 
            LIMIT 20
        """, (user_id,))
        knowledge = cur.fetchall()
        
        cur.execute("""
            SELECT situation_type, typical_response, confidence_score 
            FROM behavior_patterns 
            WHERE user_id = %s 
            ORDER BY confidence_score DESC, times_observed DESC 
            LIMIT 10
        """, (user_id,))
        behaviors = cur.fetchall()
        
        context = "Ты - цифровой двойник пользователя. Вот его характеристики:\n\n"
        context += "ЛИЧНОСТНЫЕ ЧЕРТЫ:\n"
        for trait in traits:
            context += f"- {trait['trait_name']}: {trait['trait_value']}% ({trait['description']})\n"
        
        if knowledge:
            context += "\n\nЗНАНИЯ О ПОЛЬЗОВАТЕЛЕ:\n"
            for k in knowledge:
                context += f"- {k['content']}\n"
        
        if behaviors:
            context += "\n\nПАТТЕРНЫ ПОВЕДЕНИЯ:\n"
            for b in behaviors:
                context += f"- В ситуации '{b['situation_type']}': {b['typical_response']} (уверенность: {b['confidence_score']:.0%})\n"
        
        context += "\n\nОтвечай как этот человек, используя его стиль общения и мышления. Будь естественным."
        
        return context

def save_message(conn, conversation_id: int, role: str, content: str):
    """Save message to database"""
    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO messages (conversation_id, role, content) 
            VALUES (%s, %s, %s)
        """, (conversation_id, role, content))
        
        cur.execute("""
            UPDATE conversations 
            SET last_message_at = CURRENT_TIMESTAMP 
            WHERE id = %s
        """, (conversation_id,))
    conn.commit()

def create_conversation(conn, user_id: int = 1, title: str = "Новый диалог") -> int:
    """Create new conversation"""
    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO conversations (user_id, title) 
            VALUES (%s, %s) 
            RETURNING id
        """, (user_id, title))
        conversation_id = cur.fetchone()[0]
    conn.commit()
    return conversation_id

def learn_from_interaction(conn, user_id: int, user_message: str, context: str):
    """Learn patterns from user interaction"""
    keywords = {
        'работа': 'professional',
        'отдых': 'leisure',
        'проблема': 'problem_solving',
        'решение': 'decision_making',
        'чувствую': 'emotional',
        'думаю': 'analytical'
    }
    
    situation_type = 'general'
    for keyword, sit_type in keywords.items():
        if keyword in user_message.lower():
            situation_type = sit_type
            break
    
    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO behavior_patterns 
            (user_id, situation_type, context, typical_response, confidence_score) 
            VALUES (%s, %s, %s, %s, 0.3)
            ON CONFLICT DO NOTHING
        """, (user_id, situation_type, context[:500], user_message[:500]))
    conn.commit()

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """Main handler for chat endpoint"""
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'POST':
        try:
            body = json.loads(event.get('body', '{}'))
            user_message = body.get('message', '')
            conversation_id = body.get('conversationId')
            
            if not user_message:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Message is required'})
                }
            
            conn = get_db_connection()
            
            if not conversation_id:
                conversation_id = create_conversation(conn)
            
            personality_context = get_personality_context(conn)
            history = get_conversation_history(conn, conversation_id)
            
            save_message(conn, conversation_id, 'user', user_message)
            
            client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])
            
            messages = [
                {"role": "system", "content": personality_context},
                *history,
                {"role": "user", "content": user_message}
            ]
            
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                temperature=0.7,
                max_tokens=500
            )
            
            ai_response = response.choices[0].message.content
            
            save_message(conn, conversation_id, 'assistant', ai_response)
            
            learn_from_interaction(conn, 1, user_message, user_message)
            
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'response': ai_response,
                    'conversationId': conversation_id
                })
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
