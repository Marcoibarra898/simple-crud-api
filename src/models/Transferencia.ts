import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Cuenta } from "./Cuenta";

@Entity()
export class Transferencia {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Cuenta, cuenta => cuenta.transferenciasEnviadas)
  @JoinColumn({ name: "cuentaOrigenId" })
  cuentaOrigen!: Cuenta;

  @Column()
  cuentaOrigenId!: number;

  @ManyToOne(() => Cuenta, cuenta => cuenta.transferenciasRecibidas)
  @JoinColumn({ name: "cuentaDestinoId" })
  cuentaDestino!: Cuenta;

  @Column()
  cuentaDestinoId!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  monto!: number;

  @Column()
  concepto!: string;

  @CreateDateColumn()
  fecha!: Date;

  @Column({ default: "Pendiente" })
  estado!: string;
}