import mongoose, { Schema, Document } from 'mongoose';
import crypto from 'crypto';
import config from '../config';
const beautifyUnique = require('mongoose-beautiful-unique-validation');

interface IUser extends Document {
  checkPassword: (password: string) => boolean;
  setPassword: (password: string) => void;
}

const userSchema: Schema = new mongoose.Schema(
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

function generatePassword(salt, password) {
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

function generateSalt() {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(config.crypto.length, (err, buffer) => {
      if (err) return reject(err);
      resolve(buffer.toString('hex'));
    });
  });
}

userSchema.methods.setPassword = async function setPassword(password: string) {
  this.salt = await generateSalt();
  this.passwordHash = await generatePassword(this.salt, password);
};

userSchema.methods.checkPassword = async function (password: string) {
  if (!password) return false;

  const hash = await generatePassword(this.salt, password);
  return hash === this.passwordHash;
};

// Enable beautifying on this schema
userSchema.plugin(beautifyUnique);

export const User = mongoose.model<IUser>('User', userSchema);
