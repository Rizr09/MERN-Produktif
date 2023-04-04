import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;
const People = db.define('people', {
    name: {
        type: DataTypes.STRING
    },
    location: {
        type: DataTypes.STRING
    },
}, {
    freezeTableName: true
});

export default People;