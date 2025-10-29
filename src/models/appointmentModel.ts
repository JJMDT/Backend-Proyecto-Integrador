import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db";
import { IAppointment } from "../interfaces/AppointmentInterface";

// Atributos opcionales para la creación (Sequelize manejará id, createdAt, updatedAt)
interface AppointmentCreationAttributes extends Optional<IAppointment, 'id' | 'createdAt' | 'updatedAt'> {}

class Appointment extends Model<IAppointment, AppointmentCreationAttributes> implements IAppointment {
  public id!: string;
  public idUser!: string;
  public idService!: string;
  public date!: Date;
  public time!: string;
  public phone!: string;
  public petname!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Métodos de instancia útiles
  public isToday(): boolean {
    const today = new Date();
    const appointmentDate = new Date(this.date);
    return appointmentDate.toDateString() === today.toDateString();
  }

  // Método para verificar si el appointment es en el futuro
  public isFuture(): boolean {
    const now = new Date();
    const appointmentDateTime = new Date(`${this.date.toDateString()} ${this.time}`);
    return appointmentDateTime > now;
  }

  // Método para obtener fecha y hora formateada
  public getFormattedDateTime(): string {
    return `${this.date.toLocaleDateString()} ${this.time}`;
  }
}

Appointment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    idUser: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'id_user', // Especifica explícitamente el nombre de la columna en la BD
      references: {
        model: 'users',
        key: 'id',
      },
      validate: {
        notEmpty: { msg: "El ID del usuario no puede estar vacío" },
      },
    },
    idService: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'id_service', // Especifica explícitamente el nombre de la columna en la BD
      references: {
        model: 'services',
        key: 'id', // Referencia a la PK correcta de services
      },
      validate: {
        notEmpty: { msg: "El ID del servicio no puede estar vacío" },
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: { msg: "La fecha del turno no puede estar vacía" },
        isAfter: {
          args: new Date().toISOString().split('T')[0],
          msg: "La fecha del turno debe ser futura"
        }
      },
    },
    time: {
      type: DataTypes.STRING(5),
      allowNull: false,
      validate: {
        notEmpty: { msg: "La hora del turno no puede estar vacía" },
        is: {
          args: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
          msg: "La hora debe tener formato HH:MM (ej: 09:30)"
        }
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: { msg: "El teléfono no puede estar vacío" },
        len: {
          args: [8, 20],
          msg: "El teléfono debe tener entre 8 y 20 caracteres"
        }
      }
    },
    petname: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "El nombre de la mascota no puede estar vacío" },
        len: {
          args: [2, 100],
          msg: "El nombre de la mascota debe tener entre 2 y 100 caracteres"
        }
      }
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
    modelName: "Appointment",
    tableName: "shifts", // Nombre de tabla según tu diagrama
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['id_user'],
        name: 'idx_shifts_user_id'
      },
      {
        fields: ['id_service'],
        name: 'idx_shifts_service_id'
      },
      {
        fields: ['date', 'time'],
        name: 'idx_shifts_datetime'
      }
    ]
  }
);

export default Appointment;