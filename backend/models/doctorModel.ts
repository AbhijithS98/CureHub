import mongoose, { Document, Schema } from "mongoose";


export interface IDoctor extends Document {
  name: string;
  email: string;
  specialization: string;
  medicalLicenseNumber: string;
  experience: number;
  phone: string;
  gender: string;
  documents: {
    medicalDegree: string;
    idProof:string;
  };
  profilePicture?: string;
  consultationFee?: number;
  bio?: string;
  dob?: Date;
  address?: {
    clinicName: string;
    district: string;
    city: string;
  };
  otp?: {
    code: number|null;
    expiresAt: Date|null;
  };
  ratingInfo: {
    average: number; 
    count: number;  
  };
  password: string;
  pwResetToken?: string|null;
  pwTokenExpiresAt?: Date|null;
  isVerified: boolean;
  isApproved: boolean;
  isBlocked: boolean;
}


const doctorSchema: Schema<IDoctor> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
    }, 
    medicalLicenseNumber: {
      type: String,
    },  
    experience: {
      type: Number,
    },  
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: true,
    },
    documents: {
      medicalDegree: {
        type: String, 
        required: true
      },
      idProof: {
        type: String, 
        required: true
      }
    },
    profilePicture: {
      type: String,
    },
    consultationFee: {
      type: Number,
    },
    bio: {
      type: String,
    },
    dob: {
      type: Date,
    },
    address: {
      clinicName: {type: String, default: ''},
      district: {type: String, default: ''},
      city: {type: String, default: ''}
    },
    otp: {
      code: { type: Number, default: null },
      expiresAt: { type: Date, default: null },
    },
    ratingInfo: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    password: {
      type: String,
      required: true,
    },
    pwResetToken: {
      type: String,
      default: null
    },
    pwTokenExpiresAt: {
      type: Date,
      default: null
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);



const Doctor = mongoose.model<IDoctor>("Doctor", doctorSchema);
export default Doctor;
