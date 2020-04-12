import { Document, Schema, model } from 'mongoose';
import { verify } from 'argon2';


interface IVerifyPasswordFunc {
    (password: string): Promise<boolean>;
}

export interface IUser extends Document {
    _id: string;
    emailAddress: string;
    password: string;
    verifyPassword: IVerifyPasswordFunc;
};

const userSchema = new Schema<IUser>({
    emailAddress: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    
});

userSchema.methods.verifyPassword = async function(password: string): Promise<boolean> {
    return await verify(password, this.password);
};

export default model<IUser>('User', userSchema);