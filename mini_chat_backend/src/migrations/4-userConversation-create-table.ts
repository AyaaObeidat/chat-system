import { DataType, Sequelize } from 'sequelize-typescript';

export const up = async ({ context }: { context: Sequelize }) => {
  const queryInterface = context.getQueryInterface();
  await queryInterface.createTable('UserConversations', {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
    },

    user_id: {
      allowNull: false,
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
      references: {
        model: 'Users',
        key: 'id',
      },
    },

    conversation_id: {
      allowNull: false,
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
      references: {
        model: 'Conversations',
        key: 'id',
      },
    },

    created_at: {
      allowNull: false,
      type: DataType.DATE,
    },

    updated_at: {
      allowNull: false,
      type: DataType.DATE,
    },
  });
};

export const down = async ({ context }: { context: Sequelize }) => {
  const queryInterface = context.getQueryInterface();
  await queryInterface.dropTable('UserConversations');
};
