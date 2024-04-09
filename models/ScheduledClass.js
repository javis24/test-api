import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

const {DataTypes} = Sequelize;

const ScheduledClass = db.define('scheduled_classes',{
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    classDate:{
        type: DataTypes.DATE,
        allowNull: false
    },
    startTime:{
        type: DataTypes.TIME,
        allowNull: false
    },
    endTime:{
        type: DataTypes.TIME,
        allowNull: false
    },
    branch:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            isIn: [['GomezPalacio', 'Saltillo400', 'Independencia', 'Ibero', 'Durango']]
        }
    },
    userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    }
},{
    freezeTableName: true
});

Users.hasMany(ScheduledClass);
ScheduledClass.belongsTo(Users, {foreignKey: 'userId'});

export default ScheduledClass;
