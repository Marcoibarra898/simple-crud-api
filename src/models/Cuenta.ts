import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Usuario } from "./Usuario";
import { Transferencia } from "./Transferencia";

@Entity()
export class Cuenta {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  numeroCuenta!: string;

  @Column()
  tipoCuenta!: string;

  @Column()
  banco!: string;

  @Column("decimal", {
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,                   
      from: (value: string) => parseFloat(value),     
    },
  })
  saldo!: number;;

  @Column({ default: true })
  activa!: boolean;

  @ManyToOne(() => Usuario, usuario => usuario.cuentas)
  @JoinColumn({ name: "usuarioId" })
  usuario!: Usuario;

  @Column()
  usuarioId!: number;

  @OneToMany(() => Transferencia, transferencia => transferencia.cuentaOrigen)
  transferenciasEnviadas!: Transferencia[];

  @OneToMany(() => Transferencia, transferencia => transferencia.cuentaDestino)
  transferenciasRecibidas!: Transferencia[];
}