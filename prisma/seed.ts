import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.horaireException.deleteMany()
  await prisma.horaireRegulier.deleteMany()
  await prisma.bassin.deleteMany()
  await prisma.avis.deleteMany()
  await prisma.favori.deleteMany()
  await prisma.piscine.deleteMany()

  // Piscine 1 — Suzanne Berlioux
  await prisma.piscine.create({
    data: {
      nom: 'Piscine Suzanne Berlioux',
      adresse: '10 place de la Rotonde, Forum des Halles',
      arrondissement: 1,
      latitude: 48.861944013677,
      longitude: 2.346556960766,
      description: 'En plein cœur des Halles, la piscine Suzanne Berlioux propose un bassin olympique de 50 mètres idéal pour perfectionner sa nage, dans le 1er arrondissement de Paris.',
      telephone: '+33182820169',
      email: 'contact@piscine-berlioux.fr',
      site_web: 'http://www.piscine-berlioux.fr/fr',
      acces_pmr: true,
      queer_friendly: false,
      accepte_passe_paris: false,
      is_open: false,
      espace_solarium: false,
      activites: ['Aquafitness', 'Aquabiking', 'Aquarunning', 'Aquapalm', 'Cours de natation'],
      images_galerie: [],
      prix_entree_normal: 5.10,
      prix_entree_reduit: 4.00,
      prix_carnet_normal: 46.00,
      prix_carnet_reduit: 36.00,
      prix_abonnement_normal: null,
      prix_abonnement_reduit: null,
      prix_brevet_natation: null,
      seche_cheveux: true,
      distributeur_equipements: true,
      douche_pmr: true,
      douches_collectives_mixtes: false,
      douches_individuelles: false,
      vestiaires_mixtes: false,
      casiers: false,
      cabine_pmr: false,
      parking_velos: false,
      toilettes: true,
      wifi: true,
      table_a_langer: false,
      distributeur_boisson: true,
      defibrillateur: true,
      admission_animaux: false,
      bassins: {
        create: [
          {
            nom: 'Bassin olympique',
            longueur: 50,
            largeur: 20,
            profondeur_min: null,
            profondeur_max: null,
            nb_couloirs: 8,
            revetement: null,
            traitement_eau: null,
            temperature: null,
            lumiere: null,
          }
        ]
      },
      horaires_reguliers: {
        create: [
          { periode: 'SCOLAIRE', jour: 'Lundi',    heure_ouverture: '06:30', heure_fermeture: '08:30' },
          { periode: 'SCOLAIRE', jour: 'Lundi',    heure_ouverture: '10:30', heure_fermeture: '23:30' },
          { periode: 'SCOLAIRE', jour: 'Mardi',    heure_ouverture: '12:00', heure_fermeture: '22:30' },
          { periode: 'SCOLAIRE', jour: 'Mercredi', heure_ouverture: '06:30', heure_fermeture: '08:30' },
          { periode: 'SCOLAIRE', jour: 'Mercredi', heure_ouverture: '12:00', heure_fermeture: '23:30' },
          { periode: 'SCOLAIRE', jour: 'Jeudi',    heure_ouverture: '12:00', heure_fermeture: '22:30' },
          { periode: 'SCOLAIRE', jour: 'Vendredi', heure_ouverture: '06:30', heure_fermeture: '08:30' },
          { periode: 'SCOLAIRE', jour: 'Vendredi', heure_ouverture: '12:00', heure_fermeture: '23:30' },
          { periode: 'SCOLAIRE', jour: 'Samedi',   heure_ouverture: '09:00', heure_fermeture: '19:00' },
          { periode: 'SCOLAIRE', jour: 'Dimanche', heure_ouverture: '09:00', heure_fermeture: '19:00' },
          { periode: 'VACANCES', jour: 'Lundi',    heure_ouverture: '06:30', heure_fermeture: '23:30' },
          { periode: 'VACANCES', jour: 'Mardi',    heure_ouverture: '10:00', heure_fermeture: '22:30' },
          { periode: 'VACANCES', jour: 'Mercredi', heure_ouverture: '06:30', heure_fermeture: '23:30' },
          { periode: 'VACANCES', jour: 'Jeudi',    heure_ouverture: '10:00', heure_fermeture: '22:30' },
          { periode: 'VACANCES', jour: 'Vendredi', heure_ouverture: '06:30', heure_fermeture: '23:30' },
          { periode: 'VACANCES', jour: 'Samedi',   heure_ouverture: '09:00', heure_fermeture: '19:00' },
          { periode: 'VACANCES', jour: 'Dimanche', heure_ouverture: '09:00', heure_fermeture: '19:00' },
        ]
      }
    }
  })

  // Piscine 2 — Marie-Marvingt
  await prisma.piscine.create({
    data: {
      nom: 'Piscine Marie-Marvingt',
      adresse: '16 rue du Renard',
      arrondissement: 4,
      latitude: 48.859114995626,
      longitude: 2.35249000711,
      description: 'Située à deux pas du centre Georges Pompidou, la piscine Marie-Marvingt dispose d\'un bassin de 25 mètres et d\'un petit solarium.',
      telephone: '+33142722945',
      email: null,
      site_web: null,
      acces_pmr: true,
      queer_friendly: false,
      accepte_passe_paris: true,
      is_open: false,
      espace_solarium: true,
      activites: ['Aquagym', 'Espace Paris Famille', 'École de natation'],
      images_galerie: [],
      prix_entree_normal: 3.50,
      prix_entree_reduit: 2.00,
      prix_carnet_normal: 28.00,
      prix_carnet_reduit: 16.00,
      prix_abonnement_normal: 43.00,
      prix_abonnement_reduit: 22.00,
      prix_brevet_natation: 7.00,
      seche_cheveux: true,
      distributeur_equipements: true,
      douche_pmr: false,
      douches_collectives_mixtes: true,
      douches_individuelles: false,
      vestiaires_mixtes: true,
      casiers: true,
      cabine_pmr: true,
      parking_velos: false,
      toilettes: true,
      wifi: true,
      table_a_langer: true,
      distributeur_boisson: true,
      defibrillateur: true,
      admission_animaux: false,
      bassins: {
        create: [
          {
            nom: 'Bassin principal',
            longueur: 25,
            largeur: 10,
            profondeur_min: 0.60,
            profondeur_max: 2.00,
            nb_couloirs: null,
            revetement: 'Inox',
            traitement_eau: 'Chlore',
            temperature: 26.5,
            lumiere: 'Lumière naturelle',
          }
        ]
      },
      horaires_reguliers: {
        create: [
          { periode: 'SCOLAIRE', jour: 'Lundi',    heure_ouverture: '07:00', heure_fermeture: '08:30' },
          { periode: 'SCOLAIRE', jour: 'Lundi',    heure_ouverture: '11:30', heure_fermeture: '13:30' },
          { periode: 'SCOLAIRE', jour: 'Mardi',    heure_ouverture: '07:00', heure_fermeture: '08:30' },
          { periode: 'SCOLAIRE', jour: 'Mardi',    heure_ouverture: '11:30', heure_fermeture: '13:30' },
          { periode: 'SCOLAIRE', jour: 'Mercredi', heure_ouverture: '07:00', heure_fermeture: '08:30' },
          { periode: 'SCOLAIRE', jour: 'Mercredi', heure_ouverture: '13:30', heure_fermeture: '18:00' },
          { periode: 'SCOLAIRE', jour: 'Jeudi',    heure_ouverture: '07:00', heure_fermeture: '08:30' },
          { periode: 'SCOLAIRE', jour: 'Jeudi',    heure_ouverture: '11:30', heure_fermeture: '13:30' },
          { periode: 'SCOLAIRE', jour: 'Jeudi',    heure_ouverture: '16:30', heure_fermeture: '22:30' },
          { periode: 'SCOLAIRE', jour: 'Vendredi', heure_ouverture: '11:30', heure_fermeture: '13:30' },
          { periode: 'SCOLAIRE', jour: 'Samedi',   heure_ouverture: '07:00', heure_fermeture: '18:00' },
          { periode: 'SCOLAIRE', jour: 'Dimanche', heure_ouverture: '08:00', heure_fermeture: '18:00' },
          { periode: 'VACANCES', jour: 'Lundi',    heure_ouverture: '07:00', heure_fermeture: '18:00' },
          { periode: 'VACANCES', jour: 'Mardi',    heure_ouverture: '07:00', heure_fermeture: '18:00' },
          { periode: 'VACANCES', jour: 'Mercredi', heure_ouverture: '07:00', heure_fermeture: '18:00' },
          { periode: 'VACANCES', jour: 'Jeudi',    heure_ouverture: '07:00', heure_fermeture: '22:30' },
          { periode: 'VACANCES', jour: 'Vendredi', heure_ouverture: '10:00', heure_fermeture: '18:00' },
          { periode: 'VACANCES', jour: 'Samedi',   heure_ouverture: '07:00', heure_fermeture: '18:00' },
          { periode: 'VACANCES', jour: 'Dimanche', heure_ouverture: '08:00', heure_fermeture: '18:00' },
        ]
      }
    }
  })

  // Piscine 3 — Jean Taris
  await prisma.piscine.create({
    data: {
      nom: 'Piscine Jean Taris',
      adresse: '16 rue Thouin',
      arrondissement: 5,
      latitude: 48.844744013084,
      longitude: 2.347994038066,
      description: 'La piscine Jean Taris est le lieu idéal pour se détendre à deux pas du Panthéon et des universités.',
      telephone: '0155428190',
      email: null,
      site_web: 'https://www.paris.fr/lieux/piscine-jean-taris-3325',
      acces_pmr: false,
      queer_friendly: false,
      accepte_passe_paris: true,
      is_open: false,
      espace_solarium: false,
      activites: ['Aquagym', 'Natation loisirs', 'Natation', 'Plongée'],
      images_galerie: [],
      prix_entree_normal: 3.50,
      prix_entree_reduit: 2.00,
      prix_carnet_normal: 28.00,
      prix_carnet_reduit: 16.00,
      prix_abonnement_normal: 43.00,
      prix_abonnement_reduit: 22.00,
      prix_brevet_natation: 7.00,
      seche_cheveux: true,
      distributeur_equipements: true,
      douche_pmr: false,
      douches_collectives_mixtes: true,
      douches_individuelles: false,
      vestiaires_mixtes: true,
      casiers: false,
      cabine_pmr: false,
      parking_velos: false,
      toilettes: true,
      wifi: false,
      table_a_langer: false,
      distributeur_boisson: false,
      defibrillateur: false,
      admission_animaux: false,
      bassins: {
        create: [
          {
            nom: "Bassin d'apprentissage",
            longueur: 15,
            largeur: 6,
            profondeur_min: 0.70,
            profondeur_max: 1.20,
            nb_couloirs: null,
            revetement: 'Carrelage',
            traitement_eau: null,
            temperature: null,
            lumiere: null,
          },
          {
            nom: 'Grand bassin',
            longueur: 25,
            largeur: 15,
            profondeur_min: 1.30,
            profondeur_max: 3.00,
            nb_couloirs: null,
            revetement: 'Carrelage',
            traitement_eau: null,
            temperature: null,
            lumiere: null,
          }
        ]
      },
      horaires_reguliers: {
        create: [
          { periode: 'SCOLAIRE', jour: 'Lundi',    heure_ouverture: '00:00', heure_fermeture: '00:00', ferme: true },
          { periode: 'SCOLAIRE', jour: 'Mardi',    heure_ouverture: '07:00', heure_fermeture: '09:00' },
          { periode: 'SCOLAIRE', jour: 'Mardi',    heure_ouverture: '11:30', heure_fermeture: '14:00' },
          { periode: 'SCOLAIRE', jour: 'Mercredi', heure_ouverture: '07:00', heure_fermeture: '09:00' },
          { periode: 'SCOLAIRE', jour: 'Mercredi', heure_ouverture: '11:30', heure_fermeture: '18:00' },
          { periode: 'SCOLAIRE', jour: 'Jeudi',    heure_ouverture: '07:00', heure_fermeture: '09:00' },
          { periode: 'SCOLAIRE', jour: 'Jeudi',    heure_ouverture: '11:30', heure_fermeture: '14:00' },
          { periode: 'SCOLAIRE', jour: 'Vendredi', heure_ouverture: '07:00', heure_fermeture: '09:00' },
          { periode: 'SCOLAIRE', jour: 'Vendredi', heure_ouverture: '11:30', heure_fermeture: '14:00' },
          { periode: 'SCOLAIRE', jour: 'Vendredi', heure_ouverture: '17:00', heure_fermeture: '22:00' },
          { periode: 'SCOLAIRE', jour: 'Samedi',   heure_ouverture: '07:00', heure_fermeture: '18:00' },
          { periode: 'SCOLAIRE', jour: 'Dimanche', heure_ouverture: '08:00', heure_fermeture: '18:00' },
          { periode: 'VACANCES', jour: 'Lundi',    heure_ouverture: '10:00', heure_fermeture: '18:00' },
          { periode: 'VACANCES', jour: 'Mardi',    heure_ouverture: '07:00', heure_fermeture: '18:00' },
          { periode: 'VACANCES', jour: 'Mercredi', heure_ouverture: '07:00', heure_fermeture: '18:00' },
          { periode: 'VACANCES', jour: 'Jeudi',    heure_ouverture: '07:00', heure_fermeture: '18:00' },
          { periode: 'VACANCES', jour: 'Vendredi', heure_ouverture: '07:00', heure_fermeture: '22:00' },
          { periode: 'VACANCES', jour: 'Samedi',   heure_ouverture: '07:00', heure_fermeture: '18:00' },
          { periode: 'VACANCES', jour: 'Dimanche', heure_ouverture: '08:00', heure_fermeture: '18:00' },
        ]
      }
    }
  })

  // Piscine 4 — Espace Sportif Pontoise
  await prisma.piscine.create({
    data: {
      nom: 'Espace Sportif Pontoise',
      adresse: '19 rue de Pontoise',
      arrondissement: 5,
      latitude: 48.848968995199,
      longitude: 2.351425002493,
      description: 'Joyau de l\'architecture Art Déco des années 1930, la piscine Pontoise a été entièrement rénovée. Classée monument historique, elle propose un bassin de 33 mètres au cœur du Quartier latin.',
      telephone: '0780147861',
      email: 'contacte@espace-sportif-pontoise-paris.fr',
      site_web: 'https://www.espace-sportif-pontoise-paris.fr/',
      acces_pmr: true,
      queer_friendly: false,
      accepte_passe_paris: false,
      is_open: false,
      espace_solarium: false,
      activites: [],
      images_galerie: [],
      prix_entree_normal: 5.20,
      prix_entree_reduit: 3.10,
      prix_carnet_normal: 46.80,
      prix_carnet_reduit: 27.90,
      prix_abonnement_normal: 75.00,
      prix_abonnement_reduit: 36.00,
      prix_brevet_natation: 7.00,
      seche_cheveux: true,
      distributeur_equipements: true,
      douche_pmr: true,
      douches_collectives_mixtes: false,
      douches_individuelles: true,
      vestiaires_mixtes: false,
      casiers: false,
      cabine_pmr: false,
      parking_velos: true,
      toilettes: true,
      wifi: false,
      table_a_langer: true,
      distributeur_boisson: true,
      defibrillateur: true,
      admission_animaux: false,
      bassins: {
        create: [
          {
            nom: 'Bassin principal',
            longueur: 33,
            largeur: 15,
            profondeur_min: 1.40,
            profondeur_max: 2.80,
            nb_couloirs: 6,
            revetement: 'Résine armée',
            traitement_eau: 'Chlore',
            temperature: 27.6,
            lumiere: 'Lumière mixte',
          }
        ]
      },
      horaires_reguliers: {
        create: [
          { periode: 'SCOLAIRE', jour: 'Lundi',    heure_ouverture: '06:30', heure_fermeture: '07:45' },
          { periode: 'SCOLAIRE', jour: 'Lundi',    heure_ouverture: '11:45', heure_fermeture: '19:45' },
          { periode: 'SCOLAIRE', jour: 'Lundi',    heure_ouverture: '20:00', heure_fermeture: '22:45' },
          { periode: 'SCOLAIRE', jour: 'Mardi',    heure_ouverture: '06:30', heure_fermeture: '07:45' },
          { periode: 'SCOLAIRE', jour: 'Mardi',    heure_ouverture: '11:45', heure_fermeture: '13:45' },
          { periode: 'SCOLAIRE', jour: 'Mardi',    heure_ouverture: '16:30', heure_fermeture: '19:45' },
          { periode: 'SCOLAIRE', jour: 'Mardi',    heure_ouverture: '20:00', heure_fermeture: '22:45' },
          { periode: 'SCOLAIRE', jour: 'Mercredi', heure_ouverture: '06:30', heure_fermeture: '19:45' },
          { periode: 'SCOLAIRE', jour: 'Mercredi', heure_ouverture: '20:00', heure_fermeture: '22:45' },
          { periode: 'SCOLAIRE', jour: 'Jeudi',    heure_ouverture: '06:30', heure_fermeture: '07:45' },
          { periode: 'SCOLAIRE', jour: 'Jeudi',    heure_ouverture: '11:45', heure_fermeture: '13:45' },
          { periode: 'SCOLAIRE', jour: 'Jeudi',    heure_ouverture: '16:30', heure_fermeture: '19:45' },
          { periode: 'SCOLAIRE', jour: 'Jeudi',    heure_ouverture: '20:00', heure_fermeture: '22:45' },
          { periode: 'SCOLAIRE', jour: 'Vendredi', heure_ouverture: '06:30', heure_fermeture: '07:45' },
          { periode: 'SCOLAIRE', jour: 'Vendredi', heure_ouverture: '11:45', heure_fermeture: '19:45' },
          { periode: 'SCOLAIRE', jour: 'Vendredi', heure_ouverture: '20:00', heure_fermeture: '22:45' },
          { periode: 'SCOLAIRE', jour: 'Samedi',   heure_ouverture: '09:00', heure_fermeture: '18:45' },
          { periode: 'SCOLAIRE', jour: 'Dimanche', heure_ouverture: '09:00', heure_fermeture: '18:45' },
        ]
      }
    }
  })

  // Piscine 5 — Saint-Germain
  await prisma.piscine.create({
    data: {
      nom: 'Piscine Saint-Germain',
      adresse: '12 rue Lobineau',
      arrondissement: 6,
      latitude: 48.851783009643,
      longitude: 2.335896018118,
      description: 'Près du carrefour de l\'Odéon, en sous-sol du marché Saint-Germain, cette piscine offre quelques instants de détente dans le cœur historique de Paris.',
      telephone: '+33156812540',
      email: null,
      site_web: 'https://www.paris.fr/lieux/piscine-saint-germain-2919',
      acces_pmr: true,
      queer_friendly: false,
      accepte_passe_paris: true,
      is_open: false,
      espace_solarium: false,
      activites: ['Leçons de natation', 'École de natation', 'Aquagym'],
      images_galerie: [],
      prix_entree_normal: 3.50,
      prix_entree_reduit: 2.00,
      prix_carnet_normal: 28.00,
      prix_carnet_reduit: 16.00,
      prix_abonnement_normal: 43.00,
      prix_abonnement_reduit: 22.00,
      prix_brevet_natation: 7.00,
      seche_cheveux: true,
      distributeur_equipements: false,
      douche_pmr: false,
      douches_collectives_mixtes: true,
      douches_individuelles: true,
      vestiaires_mixtes: true,
      casiers: true,
      cabine_pmr: false,
      parking_velos: false,
      toilettes: true,
      wifi: true,
      table_a_langer: true,
      distributeur_boisson: false,
      defibrillateur: true,
      admission_animaux: false,
      bassins: {
        create: [
          {
            nom: 'Bassin principal',
            longueur: 25,
            largeur: 12.5,
            profondeur_min: 0.80,
            profondeur_max: 3.60,
            nb_couloirs: 5,
            revetement: 'Carrelage',
            traitement_eau: 'Chlore liquide',
            temperature: 26.5,
            lumiere: 'Lumière artificielle',
          }
        ]
      },
      horaires_reguliers: {
        create: [
          { periode: 'SCOLAIRE', jour: 'Lundi',    heure_ouverture: '00:00', heure_fermeture: '00:00', ferme: true },
          { periode: 'SCOLAIRE', jour: 'Mardi',    heure_ouverture: '07:00', heure_fermeture: '08:45' },
          { periode: 'SCOLAIRE', jour: 'Mardi',    heure_ouverture: '11:30', heure_fermeture: '13:45' },
          { periode: 'SCOLAIRE', jour: 'Mardi',    heure_ouverture: '17:00', heure_fermeture: '21:30' },
          { periode: 'SCOLAIRE', jour: 'Mercredi', heure_ouverture: '07:00', heure_fermeture: '08:45' },
          { periode: 'SCOLAIRE', jour: 'Mercredi', heure_ouverture: '11:30', heure_fermeture: '18:00' },
          { periode: 'SCOLAIRE', jour: 'Jeudi',    heure_ouverture: '07:00', heure_fermeture: '08:45' },
          { periode: 'SCOLAIRE', jour: 'Jeudi',    heure_ouverture: '11:30', heure_fermeture: '13:45' },
          { periode: 'SCOLAIRE', jour: 'Vendredi', heure_ouverture: '07:00', heure_fermeture: '08:45' },
          { periode: 'SCOLAIRE', jour: 'Vendredi', heure_ouverture: '11:30', heure_fermeture: '13:45' },
          { periode: 'SCOLAIRE', jour: 'Samedi',   heure_ouverture: '07:00', heure_fermeture: '18:00' },
          { periode: 'SCOLAIRE', jour: 'Dimanche', heure_ouverture: '08:00', heure_fermeture: '18:00' },
          { periode: 'VACANCES', jour: 'Lundi',    heure_ouverture: '10:00', heure_fermeture: '18:00' },
          { periode: 'VACANCES', jour: 'Mardi',    heure_ouverture: '07:00', heure_fermeture: '21:30' },
          { periode: 'VACANCES', jour: 'Mercredi', heure_ouverture: '07:00', heure_fermeture: '18:00' },
          { periode: 'VACANCES', jour: 'Jeudi',    heure_ouverture: '07:00', heure_fermeture: '18:00' },
          { periode: 'VACANCES', jour: 'Vendredi', heure_ouverture: '07:00', heure_fermeture: '18:00' },
          { periode: 'VACANCES', jour: 'Samedi',   heure_ouverture: '07:00', heure_fermeture: '18:00' },
          { periode: 'VACANCES', jour: 'Dimanche', heure_ouverture: '08:00', heure_fermeture: '18:00' },
        ]
      }
    }
  })

  console.log('✓ Seed terminé — 5 piscines créées')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })