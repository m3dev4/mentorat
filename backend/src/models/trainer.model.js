import mongoose from 'mongoose';
import { VerificatonEnumStatus } from '../enums/vericationsStatus.enum';

const trainerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  availability: {
    schedule: {
      type: Map,
      of: [{ startTime: Date, endTime: Date }],
    },
    students: { type: Number, default: 0 },
    mentoringSession: {
      duration: {
        type: Number,
        default: 0,
      },
      pricerSession: {
        type: Number,
        default: 0,
      },
    },
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
  ],
  stats: {
    totalStudents: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    totalCourses: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    totalRating: { type: Number, default: 0 },
    activeStudents: { type: Number, default: 0 },
  },
  paymentInfo: {
    paymentMethod: String,
    accountDetails: Object,
    taxInfo: {
      taxId: String,
      taxCountry: String,
    },
  },
  status: {
    type: String,
    enum: VerificatonEnumStatus,
    default: VerificatonEnumStatus[0],
  },
  communicationPreferences: {
    notifyNewEnrollement: {
      type: Boolean,
      default: true,
    },
    notifyNewReview: {
      type: Boolean,
      default: true,
    },
    autoRespondDelay: {
      type: Number,
      default: 24,
    },
  },
}, { timestamps: true });
