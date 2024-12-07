import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    accessToken: {
      type: String,
      required: [true, 'Access token is required'],
      trim: true,
    },
    refreshToken: {
      type: String,
      required: [true, 'Refresh token is required'],
      trim: true,
    },
    accessTokenValidUntil: {
      type: Date,
      required: [true, 'Date is required'],
      trim: true,
    },
    refreshTokenValidUntil: {
      type: Date,
      required: [true, 'Date is required'],
      trim: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const Session = mongoose.model('Session', sessionSchema);

export default Session;
