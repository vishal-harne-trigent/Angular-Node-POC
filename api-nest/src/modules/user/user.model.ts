import { Optional } from "sequelize";
import { Column, DataType, Model, Table } from "sequelize-typescript";

export interface UserAttributes {
    id: number;
    name: string;
    email: string;
    password: string | null;
    phoneNumber: string | null;
    status: string;
    role: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UserCreationAttributes
    extends Optional<
        UserAttributes,
        "id" | "password" | "phoneNumber" | "status" | "role" | "createdAt" | "updatedAt"
    > {}

@Table({ tableName: "users", timestamps: true })
class User
    extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes
{
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    declare id: number;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    declare name: string;

    @Column({
        type: DataType.STRING(150),
        allowNull: false,
        unique: true,
    })
    declare email: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: true,
    })
    declare password: string | null;

    @Column({
        type: DataType.STRING(20),
        allowNull: true,
    })
    declare phoneNumber: string | null;

    @Column({
        type: DataType.STRING(20),
        allowNull: false,
        defaultValue: "active",
    })
    declare status: string;

    @Column({
        type: DataType.STRING(20),
        allowNull: false,
        defaultValue: "employee",
    })
    declare role: string;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

export default User;
