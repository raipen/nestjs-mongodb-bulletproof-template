export default () => {
    const env = process.env.NODE_ENV || 'development' as 'development' | 'production' | 'test';
    if(env !== 'development' && env !== 'production' && env !== 'test') {
        throw new Error('NODE_ENV must be one of: development, production, test');
    }
    if(env === 'test') return { env };

    const database = {
        url: process.env.MONGODB_URL,
        dbName: process.env.MONGODB_DBNAME_MAIN || 'nest-temp',
        username: process.env.MONGODB_USERNAME,
        password: process.env.MONGODB_PASSWORD
    };
    if (!database.url) {
        throw new Error('MONGODB_URL is required');
    }
    if(!database.username) {
        throw new Error('MONGODB_USERNAME is required');
    }
    if(!database.password) {
        throw new Error('MONGODB_PASSWORD is required');
    }

    if(env === 'development') return { env, database };

    const firebase = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    };

    if(!firebase.projectId) {
        throw new Error('FIREBASE_PROJECT_ID is required');
    }

    if(!firebase.privateKey) {
        throw new Error('FIREBASE_PRIVATE_KEY is required');
    }

    if(!firebase.clientEmail) {
        throw new Error('FIREBASE_CLIENT_EMAIL is required');
    }

    return { env, database, firebase };
}
