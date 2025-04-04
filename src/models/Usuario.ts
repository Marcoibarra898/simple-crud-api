import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from "typeorm";
import "reflect-metadata";
import { Cuenta } from "./Cuenta";

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column()
  apellido!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  telefono!: string;

  @CreateDateColumn()
  fechaRegistro!: Date;

  @OneToMany(() => Cuenta, cuenta => cuenta.usuario)
  cuentas!: Cuenta[];;
}