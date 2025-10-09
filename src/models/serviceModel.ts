import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db";
import { Service as ServiceInterface } from "../interfaces/ServiceInterface";

// Atributos opcionales para la creación (Sequelize manejará idService, createdAt, updatedAt)
interface ServiceCreationAttributes extends Optional<ServiceInterface, 'idService' | 'createdAt' | 'updatedAt'> {}
class Service extends Model<ServiceInterface, ServiceCreationAttributes> implements ServiceInterface {
    public idService!: string;
    public idProfessional!: string;
    public name!: string;
    public description!: string;
    public price!: number;

    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    
    public getService(): string {
        return `Servicio: ${this.name}, Descripción: ${this.description}, Precio: ${this.price}`;
    }
}

Service.init(
    {
        idService: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        idProfessional: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: "El nombre no puede estar vacío" },
                len: {
                    args: [2, 50],
                    msg: "El nombre debe tener entre 2 y 50 caracteres",
                },
            },
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { 
                notEmpty: { msg: "La descripción no puede estar vacía" },
                len: {
                    args: [10, 500],
                    msg: "La descripción debe tener entre 10 y 500 caracteres",
                },
            },
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                isFloat: { msg: "El precio debe ser un número válido" },
                min: {
                    args: [0],
                    msg: "El precio no puede ser negativo",
                },
                notEmpty: { msg: "El precio no puede estar vacio"},
            },
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    }, 
    {
        sequelize,
        modelName: "Service",
        tableName: "services",
        timestamps: true,
        underscored: true,
    }          
);

export default Service;
