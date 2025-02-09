from flask import Blueprint
from controllers.auth_controller import AuthController

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    return AuthController.register()

@auth_bp.route('/login', methods=['POST'])
def login():
    return AuthController.login()

@auth_bp.route('/me', methods=['GET'])
@AuthController.token_required
def get_user(current_user):
    return {'user': current_user.serialize()}

# Example protected route
@auth_bp.route('/protected', methods=['GET'])
@AuthController.token_required
def protected(current_user):
    return {'message': f'Hello {current_user.username}!'} 