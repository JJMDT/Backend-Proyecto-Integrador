import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db";
import { User as UserInterface } from "../interfaces";

// Atributos opcionales para la creación (Sequelize manejará id, createdAt, updatedAt)
interface UserCreationAttributes extends Optional<UserInterface, 'id' | 'createdAt' | 'updatedAt' | 'rol'> {}

class User extends Model<UserInterface, UserCreationAttributes> implements UserInterface {
  public id!: string;
  public name!: string;
  public lastname!: string;
  public dni!: string;
  public email!: string;
  public password!: string;
  public rol!: "admin" | "user" | "professional";

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Métodos de instancia útiles
  public getFullName(): string {
    return `${this.name} ${this.lastname}`;
  }

  public isAdmin(): boolean {
    return this.rol === "admin";
  }

  public isProfessional(): boolean {
    return this.rol === "professional";
  }

  public isUser(): boolean {
    return this.rol === "user";
  }

  // Método para obtener respuesta sin password (para enviar al frontend)
  public toResponse() {
    const { password, ...userWithoutPassword } = this.toJSON();
    return userWithoutPassword;
  }



}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "El apellido no puede estar vacío" },
        len: {
          args: [2, 50],
          msg: "El apellido debe tener entre 2 y 50 caracteres",
        },
      },
    },
    dni: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "El DNI no puede estar vacío" },
        isNumeric: { msg: "El DNI debe contener solo números" },
        len: { args: [7, 10], msg: "El DNI debe tener entre 7 y 10 dígitos" },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "El email no puede estar vacío" },
        isEmail: { msg: "El email debe ser válido" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "La contraseña no puede estar vacía" },
        len: {
          args: [6, 100],
          msg: "La contraseña debe tener al menos 6 caracteres",
        },
      },
    },
    rol: {
      type: DataTypes.ENUM("admin", "user", "professional"),
      allowNull: false,
      defaultValue: "user",
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
    modelName: "User",
    tableName: "users",
    timestamps: true,
    underscored: true,
  }
);

export default User;
