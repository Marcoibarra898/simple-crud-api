export class Transferencia extends Model {
  public id!: number;
  public cuentaOrigenId!: number;
  public cuentaDestinoId!: number;
  public monto!: number;
  public concepto!: string;
  public fecha!: Date;
  public estado!: string;
}

Transferencia.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  cuentaOrigenId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Cuenta,
      key: 'id'
    },
    field: 'cuenta_origen_id'
  },
  cuentaDestinoId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Cuenta,
      key: 'id'
    },
    field: 'cuenta_destino_id'
  },
  monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  concepto: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  estado: {
    type: DataTypes.ENUM('Pendiente', 'Completada', 'Rechazada'),
    allowNull: false,
    defaultValue: 'Pendiente'
  }
}, {
  sequelize,
  tableName: 'transferencias',
  timestamps: false
});
