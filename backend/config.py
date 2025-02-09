import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-here'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///db.sqlite'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24) 
    FLASK_DEBUG = os.environ.get('FLASK_DEBUG') or '1'
    FLASK_PORT = os.environ.get('FLASK_PORT') or '5000'
    FLASK_HOST = os.environ.get('FLASK_HOST') or '127.0.0.1'
