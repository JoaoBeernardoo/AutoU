from flask import Flask
from Controller.email_controller import email_bp
from flask_cors import CORS

app = Flask(__name__)

CORS(app)
app.register_blueprint(email_bp, url_prefix='/email')


if __name__ == '__main__':
    app.run(debug=True)
