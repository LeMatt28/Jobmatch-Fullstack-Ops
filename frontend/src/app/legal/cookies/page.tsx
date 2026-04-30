import { type Metadata } from 'next'
import { LegalPage } from '../LegalPage'

export const metadata: Metadata = {
  title: 'Politique de Cookies — JobAggregator',
  description: 'Politique d\'utilisation des cookies et traceurs sur la plateforme JobAggregator.',
}

export default function CookiesPage() {
  return (
    <LegalPage
      title="Politique de Cookies"
      subtitle="Cette page vous explique comment nous utilisons les cookies et traceurs sur la Plateforme."
      lastUpdated="1er janvier 2025"
      breadcrumb="Cookies"
      sections={[
        {
          id: 'quest-ce-quun-cookie',
          title: '1. Qu\'est-ce qu\'un Cookie ?',
          content: (
            <>
              <p>
                Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, smartphone,
                tablette) lors de la visite d'un site web. Il permet au site de reconnaître votre navigateur
                lors de visites ultérieures et de mémoriser certaines informations vous concernant.
              </p>
              <p>
                Les cookies peuvent être « de session » (supprimés à la fermeture du navigateur) ou
                « persistants » (conservés pour une durée déterminée sur votre appareil).
              </p>
            </>
          ),
        },
        {
          id: 'cookies-utilises',
          title: '2. Cookies Utilisés sur la Plateforme',
          content: (
            <>
              <p>Nous utilisons plusieurs catégories de cookies :</p>

              <div className="space-y-5 mt-2">
                <div className="rounded-xl border border-border p-4 bg-surface">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">Strictement nécessaires</span>
                    <span className="text-xs text-text-disabled">Toujours actifs</span>
                  </div>
                  <p className="text-sm text-text-secondary mb-2">
                    Ces cookies sont indispensables au fonctionnement de la Plateforme. Sans eux, certains
                    services essentiels ne peuvent pas être fournis.
                  </p>
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="text-text-disabled border-b border-border">
                        <th className="text-left py-1.5 pr-4 font-medium">Nom</th>
                        <th className="text-left py-1.5 pr-4 font-medium">Finalité</th>
                        <th className="text-left py-1.5 font-medium">Durée</th>
                      </tr>
                    </thead>
                    <tbody className="text-text-secondary">
                      <tr className="border-b border-border/50">
                        <td className="py-1.5 pr-4 font-mono">auth-storage</td>
                        <td className="py-1.5 pr-4">Session d'authentification (JWT)</td>
                        <td className="py-1.5">Session</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-1.5 pr-4 font-mono">csrf-token</td>
                        <td className="py-1.5 pr-4">Protection contre les attaques CSRF</td>
                        <td className="py-1.5">Session</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-4 font-mono">profile-storage</td>
                        <td className="py-1.5 pr-4">Préférences et données de profil local</td>
                        <td className="py-1.5">1 an</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="rounded-xl border border-border p-4 bg-surface">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">Fonctionnels</span>
                    <span className="text-xs text-text-disabled">Sur consentement</span>
                  </div>
                  <p className="text-sm text-text-secondary mb-2">
                    Ces cookies permettent d'améliorer votre expérience en mémorisant vos préférences.
                  </p>
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="text-text-disabled border-b border-border">
                        <th className="text-left py-1.5 pr-4 font-medium">Nom</th>
                        <th className="text-left py-1.5 pr-4 font-medium">Finalité</th>
                        <th className="text-left py-1.5 font-medium">Durée</th>
                      </tr>
                    </thead>
                    <tbody className="text-text-secondary">
                      <tr className="border-b border-border/50">
                        <td className="py-1.5 pr-4 font-mono">theme</td>
                        <td className="py-1.5 pr-4">Préférence de thème (clair/sombre)</td>
                        <td className="py-1.5">1 an</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-1.5 pr-4 font-mono">jobs-filters</td>
                        <td className="py-1.5 pr-4">Mémorisation des filtres de recherche</td>
                        <td className="py-1.5">30 jours</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-4 font-mono">notifications-storage</td>
                        <td className="py-1.5 pr-4">État de lecture des notifications</td>
                        <td className="py-1.5">6 mois</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="rounded-xl border border-border p-4 bg-surface">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">Analytiques</span>
                    <span className="text-xs text-text-disabled">Sur consentement</span>
                  </div>
                  <p className="text-sm text-text-secondary mb-2">
                    Ces cookies nous permettent de mesurer l'audience et d'améliorer la qualité du service.
                    Les données sont anonymisées et agrégées.
                  </p>
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="text-text-disabled border-b border-border">
                        <th className="text-left py-1.5 pr-4 font-medium">Nom</th>
                        <th className="text-left py-1.5 pr-4 font-medium">Finalité</th>
                        <th className="text-left py-1.5 font-medium">Durée</th>
                      </tr>
                    </thead>
                    <tbody className="text-text-secondary">
                      <tr className="border-b border-border/50">
                        <td className="py-1.5 pr-4 font-mono">_ja_session</td>
                        <td className="py-1.5 pr-4">Analyse des sessions anonymes</td>
                        <td className="py-1.5">13 mois</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-4 font-mono">_ja_uid</td>
                        <td className="py-1.5 pr-4">Identification anonyme des visiteurs</td>
                        <td className="py-1.5">13 mois</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ),
        },
        {
          id: 'localStorage',
          title: '3. Stockage Local (localStorage)',
          content: (
            <>
              <p>
                En complément des cookies, la Plateforme utilise le <strong>localStorage</strong> du navigateur
                pour persister certaines données côté client. Ce mécanisme n'envoie pas de données au serveur
                automatiquement et reste strictement sur votre appareil.
              </p>
              <p>Les données stockées en localStorage incluent :</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Votre profil étendu (informations facultatives, CV en base64) ;</li>
                <li>Vos offres sauvegardées ;</li>
                <li>L'état de vos conversations messages ;</li>
                <li>Vos préférences de notifications.</li>
              </ul>
              <p>
                Vous pouvez vider le localStorage à tout moment via les outils développeurs de votre
                navigateur ou en supprimant votre compte.
              </p>
            </>
          ),
        },
        {
          id: 'gestion',
          title: '4. Gérer vos Préférences',
          content: (
            <>
              <p>
                Vous pouvez à tout moment gérer vos préférences concernant les cookies via les paramètres
                de votre navigateur. Notez que le refus des cookies strictement nécessaires peut altérer
                le bon fonctionnement de la Plateforme.
              </p>
              <div className="space-y-3 mt-2">
                <div>
                  <p className="font-medium text-text-primary mb-1">Navigateurs principaux :</p>
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    <li><strong>Chrome</strong> : Paramètres → Confidentialité → Cookies ;</li>
                    <li><strong>Firefox</strong> : Paramètres → Vie privée → Cookies ;</li>
                    <li><strong>Safari</strong> : Préférences → Confidentialité ;</li>
                    <li><strong>Edge</strong> : Paramètres → Confidentialité → Cookies.</li>
                  </ul>
                </div>
                <p>
                  Vous pouvez également visiter <strong>www.youronlinechoices.com</strong> pour gérer
                  vos préférences publicitaires auprès des principaux acteurs du marché.
                </p>
              </div>
            </>
          ),
        },
        {
          id: 'mise-a-jour',
          title: '5. Mise à Jour de cette Politique',
          content: (
            <>
              <p>
                Cette politique de cookies peut être mise à jour pour refléter des changements
                dans nos pratiques ou l'évolution de la réglementation applicable.
              </p>
              <p>
                En cas de modification substantielle, nous vous informerons via une notification
                sur la Plateforme. La date de dernière mise à jour est indiquée en haut de cette page.
              </p>
              <p>
                Pour toute question relative aux cookies, contactez-nous à :
                <strong> privacy@jobaggregator.epitech.eu</strong>
              </p>
            </>
          ),
        },
      ]}
    />
  )
}
