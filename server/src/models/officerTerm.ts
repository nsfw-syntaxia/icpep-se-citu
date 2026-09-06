import mongoose, { Schema, Document } from 'mongoose';

// A historical record of one person's officer position for one academic
// year — independent of the live User-based "current officer" system, so
// past officers stay on record even after they're no longer students /
// no longer hold the position.
export interface IOfficerTerm extends Document {
  name: string;
  position: string; // e.g. "President", "Committee Head", "1st Year"
  role?: string; // optional sub-label, e.g. "Batch Representative", "Representative"
  departmentType: 'executive' | 'committee';
  committeeName?: string; // required when departmentType === 'committee'
  termYear: string; // e.g. "2024-2025"
  image?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const OfficerTermSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    position: { type: String, required: true },
    role: { type: String, default: null },
    departmentType: {
      type: String,
      enum: ['executive', 'committee'],
      required: true,
    },
    committeeName: { type: String, default: null },
    termYear: { type: String, required: true },
    image: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

OfficerTermSchema.index({ termYear: 1, departmentType: 1, committeeName: 1 });

export default mongoose.model<IOfficerTerm>('OfficerTerm', OfficerTermSchema);
