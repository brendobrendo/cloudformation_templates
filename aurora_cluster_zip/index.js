const AWS = require('aws-sdk');
const mysql = require('mysql2/promise');
const secretsManager = new AWS.SecretsManager();

exports.handler = async (event) => {
    const host = process.env.DB_HOST
    let secret;

    try {
        const secretValue = await secretsManager.getSecretValue({ SecretId: 'DogNamesDBClusterSecret' }).promise();
        if ('SecretString' in secretValue) {
            secret = JSON.parse(secretValue.SecretString);
        }
    } catch (error) {
        console.log(`Error fetching secret: ${error}`);
        throw error;
    }

    const { username, password, port } = secret;
    const database = 'DogNames';

    try {
            const connection = await mysql.createConnection({
            host: host,
            user: username,
            password: password,
            database: database,
            port: port
        });

        await connection.execute('INSERT INTO DogNames (Name) VALUES (?)', [event.dogName]);
        await connection.end();

        return { statusCode: 200, body: 'Dog name added successfully'};
    } catch (dbError) {
        console.log(`Database connection error: ${dbError}`);
        throw dbError;
    }
}