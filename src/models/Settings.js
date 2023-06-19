import { Schema, model, models } from "mongoose";

const settingSchema = new Schema({
  name: {type:String, required: true, unique: true},
  value: {type:Object},
}, {timestamps: true});

export const Settings = models?.Settings || model('Settings', settingSchema);