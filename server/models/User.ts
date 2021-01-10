import mongoose, {Schema, Document, Model} from 'mongoose';
import crypto from 'crypto';
import {config} from '../config';
const beautifyUnique = require('mongoose-beautiful-unique-validation');

export interface IUserDocument extends Document {
  email: string;
  passwordHash: string;
  salt: string;
  displayName: string;
  roles: string[];
  checkPassword: (password: string) => Promise<boolean>;
  setPassword: (password: string) => Promise<void>;
}

interface IUserModel extends Model<IUserDocument> {
  
}

const userSchema: Schema<IUserDocument> = new mongoose.Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: 'E-mail пользователя не должен быть пустым.',
      validate: [
        {
          validator(value) {
            return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
          },
          message: 'Некорректный email.',
        },
      ],
      unique: 'Такой email уже существует',
    },
    displayName: {
      type: String,
      required: 'У пользователя должно быть имя',
      unique: 'Такое имя уже существует',
    },
    roles: [String],
    passwordHash: {
      type: String,
    },
    salt: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

function generatePassword(salt: string, password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password,
      salt,
      config.crypto.iterations,
      config.crypto.length,
      config.crypto.digest,
      (err, key) => {
        if (err) return reject(err);
        resolve(key.toString('hex'));
      }
    );
  });
}

function generateSalt(): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(config.crypto.length, (err, buffer) => {
      if (err) return reject(err);
      resolve(buffer.toString('hex'));
    });
  });
}

userSchema.methods.setPassword = async function setPassword(
  this: IUserDocument,
  password: string
): Promise<void> {
  this.salt = await generateSalt();
  this.passwordHash = await generatePassword(this.salt, password);
};

userSchema.methods.checkPassword = async function (
  this: IUserDocument,
  password: string
): Promise<boolean> {
  if (!password) return false;

  const hash = await generatePassword(this.salt, password);
  return hash === this.passwordHash;
};

// Enable beautifying on this schema
userSchema.plugin(beautifyUnique);

userSchema.pre<IUserDocument>('save', function(next) {
  const user = this;
  next();
}) 

export const User: IUserModel = mongoose.model<IUserDocument, IUserModel>('User', userSchema);
