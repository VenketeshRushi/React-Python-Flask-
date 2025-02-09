from flask import Flask
from extensions import db, migrate, cors
from routes.auth_routes import auth_bp
from config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    # Create tables
    with app.app_context():
        db.create_all()

    @app.route('/')
    def check():
        return {'status': 'ok'}    


    @app.route('/health')
    def health_check():
        return {'status': 'healthy'}

    return app

app = create_app()

if __name__ == '__main__':
    app.run( 
        debug=Config.FLASK_DEBUG,
        host=Config.FLASK_HOST,
        port=int(Config.FLASK_PORT)
    )