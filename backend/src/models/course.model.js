import mongoose, { mongo } from 'mongoose';
import slugify from 'slugify';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Un cours doit avoir un titre'],
      trim: true,
      maxLength: [100, 'Le titre ne peut pas depasser 100 caractères'],
    },
    slug: {
      type: String,
      unique: true,
    },
    subtitle: String,
    description: {
      type: String,
      required: [true, 'Un cours doit avoir une description'],
      trim: true,
    },
    objectives: [String],
    prerequisites: String,
    level: {
      type: String,
      enum: ['débutant', 'intermédiaire', 'avancé', 'expert'],
      default: 'débutant',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Un cours doit appartenir à une catégorie'],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trainer',
      required: [true, 'Un cours doit avoir un formateur principal'],
    },
    coInstructor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trainer',
      },
    ],
    price: {
      type: Number,
      required: [true, 'Un cours doit avoir un prix'],
    },
    currency: {
      type: String,
      default: 'EUR',
    },
    status: {
      type: String,
      enum: ['brouillon', 'en_revision', 'publié', 'archivé'],
      default: 'brouillon',
    },
    coverImage: String,
    promoVideo: String,

    enrolledStudents: {
      type: Number,
      default: 0,
    },

    needsSyncWithPg: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

//middleware pour creer automatiquement le slug avant la sauvegarde
courseSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true });
  }

  //Marquer pour la Sync
  this.needsSyncWithPg = true;

  next();
});

const Course = mongoose.model('Course', courseSchema);

export default Course;
