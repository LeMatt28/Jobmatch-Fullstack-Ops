import { type Metadata } from 'next'
import { LegalPage } from '../LegalPage'

export const metadata: Metadata = {
  title: 'Politique de Confidentialité — JobAggregator',
  description: 'Politique de confidentialité et traitement des données personnelles de JobAggregator.',
}

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Politique de Confidentialité"
      subtitle="Nous accordons une importance particulière à la protection de vos données personnelles."
      lastUpdated="1er janvier 2025"
      breadcrumb="Confidentialité"
      sections={[
        {
          id: 'responsable',
          title: '1. Responsable du Traitement',
          content: (
            <>
              <p>
                Le responsable du traitement des données personnelles collectées via la Plateforme
                JobAggregator est l'équipe pédagogique <strong>JobAggregator — Epitech</strong>,
                dans le cadre d'un projet étudiant.
              </p>
              <p>
                Pour toute question relative au traitement de vos données, vous pouvez nous contacter
                à l'adresse : <strong>privacy@jobaggregator.epitech.eu</strong>
              </p>
            </>
          ),
        },
        {
          id: 'donnees-collectees',
          title: '2. Données Collectées',
          content: (
            <>
              <p>Nous collectons les données suivantes :</p>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-text-primary mb-1">Données de compte</p>
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    <li>Nom, prénom, adresse e-mail (lors de l'inscription) ;</li>
                    <li>Mot de passe (stocké sous forme hachée, non accessible en clair) ;</li>
                    <li>Rôle et date de création du compte.</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-text-primary mb-1">Données de profil (facultatives)</p>
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    <li>Téléphone, localisation, titre professionnel, biographie ;</li>
                    <li>Liens LinkedIn et portfolio ;</li>
                    <li>Curriculum Vitae au format PDF.</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-text-primary mb-1">Données d'utilisation</p>
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    <li>Offres consultées et sauvegardées ;</li>
                    <li>Préférences de recherche et filtres appliqués ;</li>
                    <li>Messages échangés via la messagerie interne.</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-text-primary mb-1">Données techniques</p>
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    <li>Adresse IP, type de navigateur, système d'exploitation ;</li>
                    <li>Pages visitées, durée de session, actions effectuées.</li>
                  </ul>
                </div>
              </div>
            </>
          ),
        },
        {
          id: 'finalites',
          title: '3. Finalités du Traitement',
          content: (
            <>
              <p>Vos données sont traitées pour les finalités suivantes :</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li><span className="font-medium text-text-primary">Fonctionnement du service</span> — création et gestion de votre compte, authentification, accès aux fonctionnalités ;</li>
                <li><span className="font-medium text-text-primary">Personnalisation</span> — recommandations d'offres via notre algorithme IA, adaptation de l'interface ;</li>
                <li><span className="font-medium text-text-primary">Communication</span> — notifications de nouvelles offres, messages des recruteurs, alertes système ;</li>
                <li><span className="font-medium text-text-primary">Amélioration du service</span> — analyse statistique anonymisée de l'utilisation, correction de bugs ;</li>
                <li><span className="font-medium text-text-primary">Sécurité</span> — prévention des fraudes, protection de l'intégrité de la Plateforme.</li>
              </ul>
            </>
          ),
        },
        {
          id: 'base-legale',
          title: '4. Base Légale',
          content: (
            <>
              <p>Le traitement de vos données repose sur les bases légales suivantes :</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li><span className="font-medium text-text-primary">Exécution du contrat</span> — pour les traitements nécessaires à la fourniture du service ;</li>
                <li><span className="font-medium text-text-primary">Consentement</span> — pour les données de profil facultatives et les communications marketing ;</li>
                <li><span className="font-medium text-text-primary">Intérêt légitime</span> — pour l'amélioration du service et la prévention des fraudes ;</li>
                <li><span className="font-medium text-text-primary">Obligation légale</span> — pour répondre aux exigences réglementaires applicables.</li>
              </ul>
            </>
          ),
        },
        {
          id: 'conservation',
          title: '5. Durée de Conservation',
          content: (
            <>
              <p>Vos données sont conservées pendant les durées suivantes :</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li><span className="font-medium text-text-primary">Données de compte</span> — pendant la durée de vie du compte, puis 3 ans après sa suppression ;</li>
                <li><span className="font-medium text-text-primary">Données de profil</span> — jusqu'à leur suppression par l'utilisateur ou la suppression du compte ;</li>
                <li><span className="font-medium text-text-primary">Données d'utilisation</span> — 13 mois à compter de la collecte ;</li>
                <li><span className="font-medium text-text-primary">Données techniques (logs)</span> — 12 mois à compter de la collecte.</li>
              </ul>
            </>
          ),
        },
        {
          id: 'droits',
          title: '6. Vos Droits',
          content: (
            <>
              <p>
                Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi
                Informatique et Libertés, vous disposez des droits suivants :
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li><span className="font-medium text-text-primary">Droit d'accès</span> — obtenir une copie de vos données personnelles ;</li>
                <li><span className="font-medium text-text-primary">Droit de rectification</span> — corriger les données inexactes via votre espace profil ;</li>
                <li><span className="font-medium text-text-primary">Droit à l'effacement</span> — supprimer votre compte et vos données associées ;</li>
                <li><span className="font-medium text-text-primary">Droit à la portabilité</span> — recevoir vos données dans un format structuré et lisible ;</li>
                <li><span className="font-medium text-text-primary">Droit d'opposition</span> — vous opposer à certains traitements basés sur l'intérêt légitime ;</li>
                <li><span className="font-medium text-text-primary">Droit de limitation</span> — restreindre temporairement le traitement de vos données.</li>
              </ul>
              <p>
                Pour exercer ces droits, contactez-nous à <strong>privacy@jobaggregator.epitech.eu</strong>.
                Vous disposez également du droit d'introduire une réclamation auprès de la CNIL
                (Commission Nationale de l'Informatique et des Libertés) : <strong>www.cnil.fr</strong>
              </p>
            </>
          ),
        },
        {
          id: 'partage',
          title: '7. Partage des Données',
          content: (
            <>
              <p>
                Nous ne vendons, ne louons ni ne partageons vos données personnelles avec des tiers à des
                fins commerciales. Vos données peuvent être partagées dans les cas suivants :
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>Avec nos prestataires techniques (hébergement, CDN) dans le strict cadre de leurs missions et sous accord de confidentialité ;</li>
                <li>En réponse à une obligation légale ou décision judiciaire ;</li>
                <li>En cas de fusion, acquisition ou cession d'actifs, sous réserve de vous en informer préalablement.</li>
              </ul>
            </>
          ),
        },
        {
          id: 'securite',
          title: '8. Sécurité',
          content: (
            <>
              <p>
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger
                vos données contre tout accès non autorisé, perte, destruction ou divulgation :
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Chiffrement des communications via HTTPS (TLS 1.3) ;</li>
                <li>Hachage des mots de passe (bcrypt) ;</li>
                <li>Authentification par token JWT avec expiration courte ;</li>
                <li>Accès aux données restreint aux seuls personnels autorisés.</li>
              </ul>
              <p>
                En cas de violation de données susceptible de porter atteinte à vos droits, nous nous
                engageons à vous notifier dans les 72 heures conformément au RGPD.
              </p>
            </>
          ),
        },
      ]}
    />
  )
}
