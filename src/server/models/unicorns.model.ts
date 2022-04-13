import mongoose from 'mongoose';

import { Models } from 'comp1537a3';

export const unicorns = mongoose.model<Models.Unicorn>('unicorn', new mongoose.Schema<Models.Unicorn>({
    name: String,
    dob: String,
    gender: String,
    loves: Array<String>,
    vampires: Number,
    weight: Number,
}));