const {
	Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class call extends Model {
		static associate() {
			// define association here
		}
	}

	call.init({
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		call_sid: {
			type: DataTypes.STRING,
			allowNull: false
		},
		from: {
			type: DataTypes.STRING,
			allowNull: false
		},
		to: {
			type: DataTypes.STRING,
			allowNull: false
		},
		status: {
			type: DataTypes.STRING,
			allowNull: false
		},
		duration: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		voicemail_url: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		sequelize,
		modelName: 'call',
		paranoid: true,
		underscored: true
	});
	return call;
};
