import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db";
import { IProfessional, ILocation } from '../interfaces/ProfessionalInterface'

interface IProfessionalCreationAtrributes extends Optional<IProfessional, 'id' | 'createdAt' | 'updatedAt'> { };

export class Professional extends Model<IProfessional, IProfessionalCreationAtrributes> {
    public id!: string;
    public name!: string;
    public lastname!: string;
    public dni!: string;
    public phone!: string;
    public license!: string;
    public specialty!: 'veterinario' | 'peluqueria' | 'veterinario y peluqueria';
    public biography!: string;
    public nameEstablishment!: string;
    public street!: string;
    public streetNumber!: string;
    public neighborhood!: string;
    public province!: string;
    public postalCode!: string;
    public location!: string;
    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public locationParseJson() { //parseo a Json
        if (this.location) {
            return JSON.parse(this.location) as ILocation;
        }
        return null
    }
    public imagesUrl!: string;
    public imagesUrlParseJson() { //parseo a Json
        if (this.imagesUrl) {
            return JSON.parse(this.imagesUrl) as string[];
        }
        return []
    }
    public email!: string;
    public password!: string;
    public active!: boolean;
}

Professional.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
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
    lastname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dni: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    license: {
        type: DataTypes.STRING,
        allowNull: false
    },
    specialty: {
        type: DataTypes.ENUM,
        values: ['veterinario', 'peluqueria', 'veterinario y peluqueria'],
        allowNull: false
    },
    biography: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    nameEstablishment: {
        type: DataTypes.STRING,
        allowNull: false
    },
    street: {
        type: DataTypes.STRING,
        allowNull: true
    },
    streetNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    neighborhood: {
        type: DataTypes.STRING,
        allowNull: true
    },
    province: {
        type: DataTypes.STRING,
        allowNull: true
    },
    location: {
        type: DataTypes.TEXT,
        allowNull: true,
        set(value) { // lo convieto lo que llega a Json string
            this.setDataValue('location', JSON.stringify(value));
        },
        get() {
            const raw = this.getDataValue("location");
            return raw ? JSON.parse(raw) : null;
        }
    },
    imagesUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
        set(value) {
            this.setDataValue('imagesUrl', JSON.stringify(value));
        },
        get() {
            const raw = this.getDataValue("imagesUrl");
            return raw ? JSON.parse(raw) : [];
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    postalCode: {
        type: DataTypes.STRING,
        allowNull: true,
    },
},
    {
        sequelize,
        tableName: 'professionals',
        timestamps: true,
        underscored: true,
    }
)

export default Professional;