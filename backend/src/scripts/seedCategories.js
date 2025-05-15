// src/scripts/seedCategories.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/category.model.js';
import { envConfig } from '../config/env/env.config.js';

dotenv.config();

// Connexion à la base de données
mongoose
  .connect(envConfig.MONGODB_URI)
  .then(() => console.log('Connexion à la base de données réussie pour le seeding des catégories'))
  .catch((err) => console.error('Erreur de connexion à la base de données:', err));

// Liste des catégories principales
const mainCategories = [
  {
    name: 'Développement Web',
    description: 'Apprenez à créer des sites web et des applications avec les technologies les plus récentes',
    imageUrl: 'web-dev.jpg',
    color: '#3498db',
    icon: 'fa-code'
  },
  {
    name: 'Informatique & IT',
    description: 'Maîtrisez les réseaux, la sécurité informatique et l\'administration système',
    imageUrl: 'it.jpg',
    color: '#2ecc71',
    icon: 'fa-server'
  },
  {
    name: 'Data Science',
    description: 'Explorez le monde de l\'analyse de données, du machine learning et de l\'intelligence artificielle',
    imageUrl: 'data-science.jpg',
    color: '#9b59b6',
    icon: 'fa-chart-line'
  },
  {
    name: 'Design & Créativité',
    description: 'Développez vos compétences en design graphique, UI/UX et médias numériques',
    imageUrl: 'design.jpg',
    color: '#e74c3c',
    icon: 'fa-paint-brush'
  },
  {
    name: 'Business & Entrepreneuriat',
    description: 'Lancez votre entreprise, améliorez vos compétences en marketing et en gestion',
    imageUrl: 'business.jpg',
    color: '#f39c12',
    icon: 'fa-briefcase'
  },
  {
    name: 'Développement Personnel',
    description: 'Améliorez votre productivité, votre communication et votre bien-être',
    imageUrl: 'personal-dev.jpg',
    color: '#1abc9c',
    icon: 'fa-brain'
  }
];

// Sous-catégories par catégorie principale
const subcategories = {
  'Développement Web': [
    { name: 'Frontend', description: 'HTML, CSS, JavaScript et frameworks frontend', icon: 'fa-laptop-code' },
    { name: 'Backend', description: 'Node.js, PHP, Python, Java et autres technologies serveur', icon: 'fa-database' },
    { name: 'Fullstack', description: 'Développement complet frontend et backend', icon: 'fa-layer-group' },
    { name: 'CMS', description: 'WordPress, Drupal, Joomla et autres systèmes de gestion de contenu', icon: 'fa-file-code' }
  ],
  'Informatique & IT': [
    { name: 'Réseaux', description: 'Configuration et gestion des réseaux informatiques', icon: 'fa-network-wired' },
    { name: 'Cybersécurité', description: 'Protection des systèmes et données contre les menaces', icon: 'fa-shield-alt' },
    { name: 'Cloud Computing', description: 'AWS, Azure, Google Cloud et autres plateformes cloud', icon: 'fa-cloud' },
    { name: 'DevOps', description: 'Automatisation, CI/CD et infrastructure as code', icon: 'fa-cogs' }
  ],
  'Data Science': [
    { name: 'Analyse de données', description: 'Techniques et outils pour l\'analyse de données', icon: 'fa-table' },
    { name: 'Machine Learning', description: 'Algorithmes et modèles d\'apprentissage automatique', icon: 'fa-robot' },
    { name: 'Big Data', description: 'Traitement et analyse de grands volumes de données', icon: 'fa-database' },
    { name: 'IA & Deep Learning', description: 'Intelligence artificielle et réseaux de neurones profonds', icon: 'fa-brain' }
  ]
};

// Fonction pour insérer les catégories
const seedCategories = async () => {
  try {
    // Suppression des catégories existantes
    await Category.deleteMany({});
    console.log('Catégories existantes supprimées');

    // Insertion des catégories principales
    const createdMainCategories = {};
    
    for (const category of mainCategories) {
      const newCategory = await Category.create(category);
      console.log(`Catégorie principale créée: ${newCategory.name}`);
      createdMainCategories[newCategory.name] = newCategory._id;
    }

    // Insertion des sous-catégories
    for (const [parentName, subCats] of Object.entries(subcategories)) {
      const parentId = createdMainCategories[parentName];
      
      for (const subCategory of subCats) {
        const newSubCategory = await Category.create({
          ...subCategory,
          parent: parentId
        });
        console.log(`Sous-catégorie créée: ${newSubCategory.name} (parent: ${parentName})`);
      }
    }

    console.log('Seeding des catégories terminé avec succès');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors du seeding des catégories:', error);
    process.exit(1);
  }
};

// Exécution du seeding
seedCategories();