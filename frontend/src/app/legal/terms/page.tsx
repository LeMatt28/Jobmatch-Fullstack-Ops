import { type Metadata } from 'next'
import { LegalPage } from '../LegalPage'

export const metadata: Metadata = {
  title: 'Conditions Générales d\'Utilisation — JobAggregator',
  description: 'Conditions générales d\'utilisation de la plateforme JobAggregator.',
}

export default function TermsPage() {
  return (
    <LegalPage
      title="Conditions Générales d'Utilisation"
      subtitle="Veuillez lire attentivement les présentes conditions avant d'utiliser la plateforme JobAggregator."
      lastUpdated="1er janvier 2025"
      breadcrumb="CGU"
      sections={[
        {
          id: 'objet',
          title: '1. Objet',
          content: (
            <>
              <p>
                Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») régissent l'accès et l'utilisation
                de la plateforme JobAggregator, accessible à l'adresse <strong>jobaggregator.epitech.eu</strong>
                (ci-après la « Plateforme »), éditée dans le cadre d'un projet pédagogique de l'école Epitech.
              </p>
              <p>
                La Plateforme est un agrégateur d'offres d'emploi permettant à ses utilisateurs de consulter,
                rechercher et sauvegarder des offres issues de différentes sources externes (LinkedIn, Indeed,
                Welcome to the Jungle, etc.) depuis un point d'accès unique.
              </p>
              <p>
                Toute utilisation de la Plateforme implique l'acceptation pleine et entière des présentes CGU.
                Si vous n'acceptez pas ces conditions, vous devez cesser immédiatement d'utiliser la Plateforme.
              </p>
            </>
          ),
        },
        {
          id: 'acces',
          title: '2. Accès à la Plateforme',
          content: (
            <>
              <p>
                L'accès à la Plateforme est gratuit. La création d'un compte est requise pour accéder à
                l'ensemble des fonctionnalités (sauvegarde d'offres, recommandations IA, messagerie, etc.).
              </p>
              <p>
                Pour créer un compte, l'utilisateur doit fournir des informations exactes, complètes et à jour.
                Il s'engage à maintenir ces informations à jour et à notifier immédiatement tout accès non autorisé
                à son compte.
              </p>
              <p>
                JobAggregator se réserve le droit de suspendre ou de supprimer tout compte en cas de violation
                des présentes CGU, de comportement abusif ou de fourniture d'informations inexactes.
              </p>
            </>
          ),
        },
        {
          id: 'utilisation',
          title: '3. Utilisation de la Plateforme',
          content: (
            <>
              <p>L'utilisateur s'engage à utiliser la Plateforme conformément aux lois et règlements en vigueur et aux présentes CGU. Il s'interdit notamment de :</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Collecter ou extraire des données de la Plateforme de manière automatisée (scraping) ;</li>
                <li>Publier des contenus illicites, diffamatoires, trompeurs ou portant atteinte aux droits de tiers ;</li>
                <li>Tenter de contourner les mesures de sécurité ou d'accéder à des zones réservées ;</li>
                <li>Utiliser la Plateforme à des fins commerciales non autorisées ;</li>
                <li>Usurper l'identité d'une autre personne ou entité.</li>
              </ul>
              <p>
                Le respect de ces règles est essentiel au bon fonctionnement de la communauté. Tout manquement
                peut entraîner la suspension immédiate du compte.
              </p>
            </>
          ),
        },
        {
          id: 'contenu',
          title: '4. Contenu et Propriété Intellectuelle',
          content: (
            <>
              <p>
                L'ensemble des éléments constituant la Plateforme (design, textes, logos, code source,
                algorithmes de recommandation) sont la propriété exclusive de l'équipe JobAggregator —
                Epitech et sont protégés par les lois relatives à la propriété intellectuelle.
              </p>
              <p>
                Les offres d'emploi agrégées sur la Plateforme proviennent de sources tierces. JobAggregator
                ne garantit pas l'exhaustivité, l'exactitude ou la disponibilité de ces offres et décline
                toute responsabilité quant à leur contenu.
              </p>
              <p>
                L'utilisateur conserve la propriété des données personnelles qu'il renseigne sur son profil
                (CV, informations de contact, etc.) et peut les supprimer à tout moment.
              </p>
            </>
          ),
        },
        {
          id: 'responsabilite',
          title: '5. Limitation de Responsabilité',
          content: (
            <>
              <p>
                La Plateforme est fournie « en l'état » dans un cadre pédagogique. JobAggregator s'efforce
                d'assurer la disponibilité et la qualité du service mais ne garantit pas son fonctionnement
                ininterrompu.
              </p>
              <p>
                JobAggregator ne saurait être tenu responsable :
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Des inexactitudes ou erreurs contenues dans les offres d'emploi agrégées ;</li>
                <li>Des décisions prises par l'utilisateur sur la base des informations affichées ;</li>
                <li>Des dommages directs ou indirects résultant de l'utilisation ou de l'impossibilité d'utiliser la Plateforme ;</li>
                <li>Des interruptions de service pour maintenance ou raisons techniques.</li>
              </ul>
            </>
          ),
        },
        {
          id: 'modification',
          title: '6. Modification des CGU',
          content: (
            <>
              <p>
                JobAggregator se réserve le droit de modifier les présentes CGU à tout moment. Les
                modifications entrent en vigueur dès leur publication sur la Plateforme.
              </p>
              <p>
                L'utilisateur sera informé des modifications substantielles par notification dans l'application.
                La poursuite de l'utilisation de la Plateforme après modification vaut acceptation des
                nouvelles CGU.
              </p>
            </>
          ),
        },
        {
          id: 'droit-applicable',
          title: '7. Droit Applicable',
          content: (
            <>
              <p>
                Les présentes CGU sont soumises au droit français. En cas de litige, les parties s'engagent
                à rechercher une solution amiable avant tout recours judiciaire.
              </p>
              <p>
                À défaut de résolution amiable, tout litige relatif à l'interprétation ou à l'exécution
                des présentes CGU sera soumis à la compétence exclusive des tribunaux de Paris.
              </p>
              <p>
                Pour toute question relative aux présentes CGU, vous pouvez nous contacter à l'adresse :
                <strong> contact@jobaggregator.epitech.eu</strong>
              </p>
            </>
          ),
        },
      ]}
    />
  )
}
