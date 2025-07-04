# Classificador de E-mails - AutoU

Este projeto é um classificador de e-mails que identifica se um conteúdo é **Produtivo** ou **Improdutivo**, utilizando pré-processamento de texto e uma API externa de IA.

---

## 🧠 Funcionalidades

- Upload ou digitação de e-mails.
- Pré-processamento de texto (limpeza, tokenização, stopwords, lematização).
- Classificação via API externa de Inteligência Artificial.
- Exibição clara do resultado ao usuário.

---

## 🗂️ Estrutura do Projeto

O projeto foi dividido em duas camadas principais:

### `frontend/`

- Interface web com HTML, CSS e JS puro.
- Experiência de usuário focada em simplicidade e clareza.
- Modal de upload e feedback visual de classificação.

### `backend/`

- Escrita em Python.
- Arquitetura em camadas baseada em MVC:
  - `controller/` – Define os pontos de entrada da aplicação.
  - `service/` – Responsável pelo pré-processamento de texto e integração com a API externa.
  - `repository/` – (Simulado) Mantido por boas práticas, mesmo sem conexão real com banco de dados.
  - `model/` – (Simulado) Representa as estruturas de dados utilizadas.

---

## 💻 Tecnologias Usadas

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** Python 3.12
  - `nltk` para NLP (tokenização, stopwords, lematização)
  - `requests` para chamadas HTTP
- **API externa:** OpenAI

## 🧼 Boas Práticas Adotadas

- Organização de código por responsabilidade (camadas).
- Convenção `snake_case` para funções e variáveis no backend.
- Comentários e nomes de variáveis em inglês, visando boas práticas e portabilidade.
- Arquitetura escalável, ainda que simplificada, com separação entre Controller, Service e Model.

## Obs

- Na primeira vez de uso pode demorar um pouco porque como se trata de um servidor gratuito, quando não tem pessoas usando ele "dorme" e depois precisa se reinicializar.
