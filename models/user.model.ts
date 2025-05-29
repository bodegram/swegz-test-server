import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  middlename?: string;
  email: string;
  password: string;
  balance: number;
  pin:number;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    middlename: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    pin: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>('User', UserSchema);
