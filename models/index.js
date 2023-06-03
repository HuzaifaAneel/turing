const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
require('dotenv').config();

const basename = path.basename(__filename);
const db = {};

const config = {
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	host: process.env.DB_HOST,
	dialect: process.env.DB_DIALECT
};

let sequelize;
if (config.use_env_variable) {
	sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
	config.define = {
		createdAt: 'created_at',
		updatedAt: 'updated_at',
		deletedAt: 'deleted_at'
	};

	sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
	.readdirSync(__dirname)
	.filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
	.forEach((file) => {
		const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
		db[model.name] = model;
	});

Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
