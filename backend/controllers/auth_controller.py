from flask import request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from models.user import User
from extensions import db
import jwt
from datetime import datetime, timedelta
from functools import wraps

class AuthController:
    @staticmethod
    def register():
        try:
            data = request.get_json()
            
            if not all(key in data for key in ['username', 'email', 'password']):
                return jsonify({'message': 'Missing required fields'}), 400
            
            if User.query.filter_by(email=data['email']).first():
                return jsonify({'message': 'Email already registered'}), 409
            
            if User.query.filter_by(username=data['username']).first():
                return jsonify({'message': 'Username already taken'}), 409
            
            hashed_password = generate_password_hash(data['password'], method='sha256')
            new_user = User(
                username=data['username'],
                email=data['email'],
                password=hashed_password
            )
            
            db.session.add(new_user)
            db.session.commit()
            
            return jsonify({
                'message': 'User created successfully',
                'user': new_user.serialize()
            }), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'message': 'Error creating user', 'error': str(e)}), 500

    @staticmethod
    def login():
        try:
            data = request.get_json()
            
            if not all(key in data for key in ['email', 'password']):
                return jsonify({'message': 'Missing email or password'}), 400
            
            user = User.query.filter_by(email=data['email']).first()
            
            if not user:
                return jsonify({'message': 'User not found'}), 404
            
            if check_password_hash(user.password, data['password']):
                token = jwt.encode({
                    'user_id': user.id,
                    'exp': datetime.utcnow() + timedelta(hours=24)
                }, current_app.config['SECRET_KEY'])
                
                return jsonify({
                    'token': token,
                    'user': user.serialize()
                }), 200
            
            return jsonify({'message': 'Invalid credentials'}), 401
            
        except Exception as e:
            return jsonify({'message': 'Error during login', 'error': str(e)}), 500

    @staticmethod
    def token_required(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = None
            
            if 'Authorization' in request.headers:
                auth_header = request.headers['Authorization']
                try:
                    token = auth_header.split(" ")[1]
                except IndexError:
                    return jsonify({'message': 'Invalid token format'}), 401
            
            if not token:
                return jsonify({'message': 'Token is missing'}), 401
            
            try:
                data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
                current_user = User.query.get(data['user_id'])
                if not current_user:
                    return jsonify({'message': 'User not found'}), 404
            except jwt.ExpiredSignatureError:
                return jsonify({'message': 'Token has expired'}), 401
            except jwt.InvalidTokenError:
                return jsonify({'message': 'Invalid token'}), 401
            
            return f(current_user, *args, **kwargs)
        
        return decorated 