export class Cuenta extends Model {
  public id!: number;
  public usuarioId!: number;
  public numeroCuenta!: string;
  public tipoCuenta!: string;
  public banco!: string;
  public saldo!: number;
  public activa!: boolean;
}

Cuenta.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  usuarioId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id'
    },
    field: 'usuario_id'
  },
  numeroCuenta: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    field: 'numero_cuenta'
  },
  tipoCuenta: {
    type: DataTypes.ENUM('Ahorro', 'Corriente'),
    allowNull: false,
    field: 'tipo_cuenta'
  },
  banco: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  saldo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  activa: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  tableName: 'cuentas',
  timestamps: false
});
