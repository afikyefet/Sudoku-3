import mongoose, { Document, Schema, Types } from 'mongoose';

// User document interface
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
    referrer?: Types.ObjectId;
    referrals: Types.ObjectId[];
    referralCount: number;
    referralPoints: number;
    referralFlair?: string;
}

// User schema definition
const UserSchema: Schema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }], // Users who follow this user
    following: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }], // Users this user follows
    referrer: { type: Schema.Types.ObjectId, ref: 'User' },
    referrals: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    referralCount: { type: Number, default: 0 },
    referralPoints: { type: Number, default: 0 },
    referralFlair: { type: String },
});

export default mongoose.model<IUser>('User', UserSchema);
