from flask import Blueprint, request, jsonify
from Service.email_service import classify_email_service
from Service.email_service import classify_and_respond_email_openai
import json

email_bp = Blueprint('email', __name__)

@email_bp.route('/classify-email', methods=['POST'])
def classify_email():
    try:
        data = request.json
        email_text = data.get('email_text')

        if not email_text:
            return jsonify({'error': 'Campo está vazio ou ausente'}), 400

        
        result_raw = classify_and_respond_email_openai(email_text)

        try:
            result = json.loads(result_raw)
        except json.JSONDecodeError:
            print(f"Erro ao fazer JSON parse da resposta: {result_raw}")
            return jsonify({'error': 'Erro ao interpretar resposta da API'}), 500

        categoria = result.get('categoria', 'Não identificado')
        resposta = result.get('resposta', '')

        return jsonify({
            'categoria': categoria,
            'resposta_sugerida': resposta
        })

    except Exception as e:
        print(f"Erro inesperado no backend: {e}")
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500