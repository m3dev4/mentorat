import { Schema, model } from 'mongoose';
import bcrypt, { genSalt, hash } from 'bcryptjs';
import { randomBytes, createHash } from 'crypto';

const userSchema = new Schema({
  // Informations personnelles
  firstName: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: props => `${props.value} n'est pas un email valide!`
    }
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères'],
    select: false
  },
  profilePicture: {
    type: String,
    default: 'default.jpg'
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [500, 'La bio ne peut pas dépasser 500 caractères']
  },
  
  // Localisation et préférences
  location: {
    country: String,
    city: String,
    isPublic: {
      type: Boolean,
      default: true
    }
  },
  languages: [{
    language: String,
    level: {
      type: String,
      enum: ['débutant', 'intermédiaire', 'avancé', 'natif']
    }
  }],
  timezone: String,
  
  // Rôles et permissions
  roles: {
    type: [{
      type: String,
      enum: ['apprenant', 'formateur', 'administrateur', 'modérateur', 'expert', 'mentor', 'partenaire']
    }],
    default: ['apprenant']
  },
  
  // Statut du compte
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  is2FAEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: String,
  
  // Préférences d'apprentissage (pour les apprenants)
  learningPreferences: {
    objectives: [String],
    interests: [{
      domain: String,
      level: {
        type: String,
        enum: ['débutant', 'intermédiaire', 'avancé', 'expert']
      }
    }],
    learningStyle: {
      type: String,
      enum: ['visuel', 'pratique', 'théorique', 'mixte']
    },
    weeklyAvailability: Number // en heures
  },
  
  // Informations professionnelles (pour les formateurs)
  professionalInfo: {
    expertise: [{
      domain: String,
      level: {
        type: String,
        enum: ['débutant', 'intermédiaire', 'avancé', 'expert']
      }
    }],
    certifications: [{
      name: String,
      issuer: String,
      date: Date,
      verified: {
        type: Boolean,
        default: false
      }
    }],
    teachingLanguages: [String],
    presentationVideo: String,
    professionalLinks: {
      linkedin: String,
      github: String,
      website: String
    }
  },
  
  // Indicateurs de qualité (pour les formateurs)
  qualityMetrics: {
    satisfactionScore: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    completionRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    responseTime: {
      type: Number, // en minutes
      default: 0
    },
    badges: [String]
  },
  
  // Sécurité et vérification
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // Historique de connexion
  loginHistory: [{
    date: {
      type: Date,
      default: Date.now
    },
    ip: String,
    device: String,
    location: String
  }],
  
  // Paramètres de session
  sessionDuration: {
    type: Number,
    default: 60 // en minutes
  },
  stayConnected: {
    type: Boolean,
    default: false
  },
  
  // Confidentialité
  privacySettings: {
    profileVisibility: {
      type: String,
      enum: ['public', 'apprenants', 'formateurs', 'privé'],
      default: 'public'
    },
    hideCompletedCourses: {
      type: Boolean,
      default: false
    }
  },
  
  // Dates
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Middleware pour hacher le mot de passe avant de sauvegarder
userSchema.pre('save', async function(next) {
  // Seulement hacher le mot de passe s'il a été modifié
  if (!this.isModified('password')) return next();
  
  try {
    // Générer un sel avec un coût de 12
    const salt = await genSalt(12);
    // Hacher le mot de passe avec le sel
    this.password = await hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function (candidatePassword) {
  // Vérifier que les deux arguments sont définis
  if (!this.password || !candidatePassword) {
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour générer un token de vérification d'email
userSchema.methods.createEmailVerificationToken = function() {
  const verificationToken = randomBytes(32).toString('hex');
  
  this.emailVerificationToken = createHash('sha256')
    .update(verificationToken)
    .digest('hex');
    
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 heures
  
  return verificationToken;
};

// Méthode pour générer un token de réinitialisation de mot de passe
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = randomBytes(32).toString('hex');
  
  this.passwordResetToken = createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return resetToken;
};

// Méthode pour enregistrer une nouvelle connexion
userSchema.methods.logLogin = function(ip, device, location) {
  this.loginHistory.push({
    ip,
    device,
    location
  });
  
  this.lastActive = Date.now();
  return this.save({ validateBeforeSave: false });
};

// Méthode pour vérifier si l'utilisateur a un rôle spécifique
userSchema.methods.hasRole = function(role) {
  return this.roles.includes(role);
};

const User = model('User', userSchema);

export default User;