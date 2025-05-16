// src/services/sync/sync.Service.js (mise à jour)
import { PrismaClient } from '@prisma/client';
import Course from '../../models/course.model.js';

// Créer le client Prisma avec retry
const prisma = new PrismaClient({
  errorFormat: 'minimal',
});

// Fonction d'aide pour les retries
async function withRetry(fn, maxRetries = 3, delay = 1000) {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      console.log(`Tentative ${attempt + 1}/${maxRetries} échouée: ${error.message}`);
      lastError = error;
      
      // Si c'est la dernière tentative, ne pas attendre
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
        // Augmenter le délai exponentiellement
        delay *= 2;
      }
    }
  }
  
  throw lastError;
}

export const syncTrainerCourse = async trainerId => {
  try {
    // 1- Récupérer les cours du formatteur depuis MongoDb
    const courses = await Course.find({ instructor: trainerId });
    
    // 2- Tenter de récupérer les cours du formateur depuis PostgreSQL avec retry
    const pgCourses = await withRetry(async () => {
      return await prisma.course.findMany({
        where: { instructorId: trainerId },
      });
    });
    
    // 3- Synchroniser les deux ensembles
    for (const course of courses) {
      const existsPg = pgCourses.some(pgCourse => pgCourse.id === course._id.toString());
      
      if (!existsPg) {
        // Créer dans PostgreSQL avec retry
        await withRetry(async () => {
          await prisma.course.create({
            data: {
              id: course._id.toString(),
              title: course.title,
              slug: course.slug,
              subtitle: course.subtitle,
              description: course.description,
              objectives: course.objectives,
              prerequisites: course.prerequisites,
              price: course.price,
              currency: course.currency,
              discountPrice: course.discountPrice,
              discountValidUntil: course.discountValidUntil,
              categoryId: course.category?.toString() || '',
              instructorId: trainerId,
              coInstructorIds: course.coInstructors?.map(id => id.toString()) || [],
              status: convertStatusToEnum(course.status),
              level: convertLevelToEnum(course.level),
              createdAt: course.createdAt,
              updatedAt: course.updatedAt,
              publishedAt: course.publishedAt,
              enrolledStudents: course.enrolledStudents,
              completionRate: course.completionRate,
              sequentialProgress: course.sequentialProgress || true,
              certificateEnabled: course.certificateEnabled || false,
            }
          });
        });
      }
    }
    
    console.log("Synchronisation avec PostgreSQL terminée avec succès");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la synchronisation avec PostgreSQL:", error);
    // On retourne un succès quand même, pour ne pas bloquer la création du cours dans MongoDB
    return { 
      success: false,
      error: error.message
    };
  }
};

// Fonctions helper pour conversion d'énumération
function convertLevelToEnum(mongoLevel) {
  if (!mongoLevel) return 'BEGINNER';
  
  const mapping = {
    'débutant': 'BEGINNER',
    'intermédiaire': 'INTERMEDIATE',
    'avancé': 'ADVANCED',
    'expert': 'EXPERT'
  };
  return mapping[mongoLevel.toLowerCase()] || 'BEGINNER';
}

function convertStatusToEnum(mongoStatus) {
  if (!mongoStatus) return 'DRAFT';
  
  const mapping = {
    'brouillon': 'DRAFT',
    'en_révision': 'REVIEW',
    'publié': 'PUBLISHED',
    'archivé': 'ARCHIVED'
  };
  return mapping[mongoStatus.toLowerCase()] || 'DRAFT';
}