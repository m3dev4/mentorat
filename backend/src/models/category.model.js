import mongoose from 'mongoose';
import slugify from 'slugify';


/**
 * Schema de la categorie
 * @param {String} name - Le nom de la categorie
 * @param {String} slug - Le slug de la categorie
 * @param {String} description - La description de la categorie
 * @param {String} imgUrl - L'URL de l'image de la categorie
 * @param {String} color - La couleur de la categorie
 * @param {String} icon - L'icône de la categorie
 * @param {String} parent - L'id de la categorie parente
 * @param {Boolean} isActive - L'etat de la categorie
 * @param {Number} order - L'ordre de la categorie
 * @param {Date} createdAt - La date de creation de la categorie
 * @param {Date} updatedAt - La date de modification de la categorie
 * @param {Object} virtuals - Les virtuals de la categorie
 * @param {Object} methods - Les methodes de la categorie
 * 
 * @returns {Object} - Le schema de la categorie
 * 
 */

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: ['Le nom de la categorie est requis', true],
      trim: true,
      maxLength: [100, 'Le nom de la categorie ne peut pas depasser 100 caracteres'],
    },
    slug: { type: String, unique: true },
    description: {
      type: String,
      required: true,
      trim: true,
      maxLength: [2000, 'La description ne peut pas depasser 2000 caracteres'],
    },
    imgUrl: { type: String, default: 'https://via.placeholder.com/150' },
    color: { type: String, default: '#3498db' },
    icon: { type: String, default: 'fas fa-book' },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

//Middleware pour creer automatiquement le slug
categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

//Virtual pour recuperer les sous categories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent',
  justOne: false,
  options: { sort: { name: 1 } },
});

//Virtual pour recuperer le nombre de cours
categorySchema.virtual('courseCount', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'category',
  count: true,
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
