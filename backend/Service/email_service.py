import re
import string
import os
import nltk
import openai
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer



nltk_data_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'nltk_data'))
nltk.data.path.append(nltk_data_path)
openai_api_key = os.getenv("OPENAI_API_KEY")

if not openai_api_key:
    raise Exception("OPENAI_API_KEY não está configurada!")

openai.api_key = openai_api_key


def classify_email_service(text):
    text = re.sub(r'[\r\n\t]+', ' ', text)
    text = re.sub(r'\s{2,}', ' ', text)

    text = text.translate(str.maketrans('', '', string.punctuation))
    text = text.lower()

    tokens = word_tokenize(text) 

    stop_words = set(stopwords.words('portuguese'))
    filtered_tokens = [word for word in tokens if word not in stop_words]

    lemmatizer = WordNetLemmatizer()
    lemmatized_tokens = [lemmatizer.lemmatize(token) for token in filtered_tokens]

    return ' '.join(lemmatized_tokens)



def classify_and_respond_email_openai(original_text):
    text_lemmatizado = classify_email_service(original_text)



    prompt = f"""
    Analise o seguinte email (pré-processado com NLP):

    "{text_lemmatizado}"

    1. Classifique como "Produtivo" ou "Improdutivo".
    2. Gere uma resposta automática curta, educada e objetiva.

    Responda no seguinte formato JSON:
    {{
        "categoria": "<Produtivo ou Improdutivo>",
        "resposta": "<mensagem sugerida>"
    }}
    """

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Você é um classificador de e-mails e gerador de respostas automáticas."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
            max_tokens=300
        )
        return response['choices'][0]['message']['content']
    except Exception as e:
        return f"Erro na chamada da API OpenAI: {e}"


