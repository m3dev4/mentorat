// src/models/trainer.model.js

import mongoose from 'mongoose';
import { VerificatonEnumStatus } from '../enums/vericationsStatus.enum.js';

const trainerSchema = new mongoose.Schema({
  // Relation avec l'utilisateur
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  
  // Profil professionnel
  biography: {
    type: String,
    trim: true,
    maxlength: [2000, 'La biographie ne peut pas dépasser 2000 caractères']
  },
  specializations: [{
    domain: String,
    level: {
      type: String,
      enum: ['débutant', 'intermédiaire', 'avancé', 'expert']
    },
    yearsExperience: Number
  }],
  certifications: [{
    name: String,
    issuer: String,
    year: Number,
    verificationUrl: String,
    verified: {
      type: Boolean,
      default: false
    }
  }],
  presentationVideo: String,
  
  // Portfolio et réalisations
  portfolio: [{
    title: String,
    description: String,
    url: String,
    imageUrl: String,
    year: Number
  }],
  
  // Disponibilité pour le mentorat
  availability: {
    schedule: {
      type: Map,
      of: [{ startTime: Date, endTime: Date }],
    },
    maxStudents: { 
      type: Number, 
      default: 20 
    },
    mentoringSession: {
      duration: {
        type: Number, // en minutes
        default: 60,
      },
      pricePerSession: {
        type: Number,
        default: 0,
      },
    },
  },
  
  // Cours créés
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  }],
  
  // Statistiques et métriques
  stats: {
    totalStudents: {
      type: Number,
      default: 0
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    responseRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    responseTime: {
      type: Number, // en heures
      default: 24
    }
  },
  
  // Informations de paiement
  paymentInfo: {
    paypalEmail: String,
    bankInfo: {
      accountName: String,
      accountNumber: String,
      bankName: String,
      swift: String,
      iban: String
    },
    taxInfo: {
      taxId: String,
      country: String
    },
    paymentMethod: {
      type: String,
      enum: ['paypal', 'bank_transfer', 'stripe'],
      default: 'paypal'
    }
  },
  
  // Vérification et statut
  verificationStatus: {
    type: String,
    enum: Object.values(VerificatonEnumStatus),
    default: VerificatonEnumStatus.PENDING
  },
  
  // Badges et distinctions
  badges: [{
    name: String,
    description: String,
    imageUrl: String,
    awardedDate: Date
  }],
  
  // Préférences et paramètres
  preferences: {
    notifyNewEnrollment: {
      type: Boolean,
      default: true
    },
    notifyNewReview: {
      type: Boolean,
      default: true
    },
    notifyNewQuestion: {
      type: Boolean,
      default: true
    },
    notifyMentoringRequest: {
      type: Boolean,
      default: true
    }
  }
}, { timestamps: true });

// Méthode pour calculer la moyenne des évaluations
trainerSchema.methods.calculateAverageRating = async function() {
  // Cette méthode pourrait être appelée après chaque nouvelle évaluation
  // pour mettre à jour la note moyenne du formateur
  // À compléter avec votre logique d'évaluation
};

const Trainer = mongoose.model('Trainer', trainerSchema);
export default Trainer;