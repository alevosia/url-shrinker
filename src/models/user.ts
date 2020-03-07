import { Document, Schema, model } from 'mongoose';
import { verify } from 'argon2';


interface VerifyPasswordFunc {
    (password: string): Promise<boolean>;
}

export interface IUser extends Document {
    _id: string;
    username: string;
    password: string;
    verifyPassword: VerifyPasswordFunc;
};

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.methods.verifyPassword = async function(password: string): Promise<boolean> {
    return await verify(password, this.password);
};

export default model<IUser>('User', userSchema);