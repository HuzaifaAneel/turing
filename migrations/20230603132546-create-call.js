module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('calls', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			call_sid: {
				type: Sequelize.STRING,
				allowNull: false
			},
			from: {
				type: Sequelize.STRING,
				allowNull: false
			},
			to: {
				type: Sequelize.STRING,
				allowNull: false
			},
			status: {
				type: Sequelize.STRING,
				allowNull: false
			},
			duration: {
				type: Sequelize.INTEGER,
				allowNull: true
			},
			voicemail_url: {
				type: Sequelize.STRING,
				allowNull: true
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE
			},
			deleted_at: {
				allowNull: true,
				type: Sequelize.DATE
			}
		});
	},
	down: async (queryInterface) => {
		await queryInterface.dropTable('calls');
	}
};
