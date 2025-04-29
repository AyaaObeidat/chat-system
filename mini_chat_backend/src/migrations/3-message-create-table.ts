import { DataType, Sequelize } from "sequelize-typescript";

export const up = async ({context}:{context:Sequelize}) => {
    const queryInterface = context.getQueryInterface();
    await queryInterface.createTable('Messages',{
        id:{
            primaryKey:true,
            allowNull:false,
            type:DataType.UUID,
            defaultValue:DataType.UUIDV4
        },
        content:{
            allowNull:false,
            type:DataType.STRING,
        },
        userId:{
            allowNull:false,
            type:DataType.UUID,
            defaultValue:DataType.UUIDV4,
            references:{
                model:'Users',
                key:'id'
            }
        },

        conversationId:{
            allowNull:false,
            type:DataType.UUID,
            defaultValue:DataType.UUIDV4,
            references:{
                model:'Conversations',
                key:'id'
            }
        },

        CreatedAt:{
            allowNull:false,
            type:DataType.DATE
        },

        UpdatedAt:{
            allowNull:false,
            type:DataType.DATE
        }
    });
}

export const down = async ({context}:{context:Sequelize}) => {
    const queryInterface = context.getQueryInterface();
    await queryInterface.dropTable('Messages');
}