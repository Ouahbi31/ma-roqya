export default function PolitiqueConfidentialite() {
  return (
    <div className="min-h-screen bg-cream">
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="font-heading text-3xl font-bold text-green-islamic mb-8">
            Politique de Confidentialit&eacute;
          </h1>

          <div className="space-y-8 text-text-secondary leading-relaxed">
            {/* Introduction */}
            <p>
              La pr&eacute;sente politique de confidentialit&eacute; d&eacute;crit la mani&egrave;re dont le site
              ma-roqya.fr collecte, utilise et prot&egrave;ge les donn&eacute;es personnelles de ses
              utilisateurs, conform&eacute;ment au R&egrave;glement G&eacute;n&eacute;ral sur la Protection des
              Donn&eacute;es (RGPD) et &agrave; la loi Informatique et Libert&eacute;s du 6 janvier 1978 modifi&eacute;e.
            </p>

            {/* Responsable du traitement */}
            <div>
              <h2 className="font-heading text-xl font-bold text-green-islamic mb-3">
                1. Responsable du traitement
              </h2>
              <div className="rounded-2xl bg-white border border-cream-dark p-6 shadow-sm space-y-1">
                <p><strong className="text-text-primary">Responsable :</strong> Ouchen Ouahbi</p>
                <p><strong className="text-text-primary">Adresse :</strong> 13 cheminement Francisco de Goya, 31100 Toulouse, France</p>
                <p><strong className="text-text-primary">Email :</strong> coaching.roqya@gmail.com</p>
                <p><strong className="text-text-primary">SIRET :</strong> 982 950 420 00017</p>
              </div>
            </div>

            {/* Données collectées */}
            <div>
              <h2 className="font-heading text-xl font-bold text-green-islamic mb-3">
                2. Donn&eacute;es personnelles collect&eacute;es
              </h2>
              <p className="mb-3">
                Dans le cadre de l'utilisation du site ma-roqya.fr, nous sommes amen&eacute;s &agrave; collecter
                les donn&eacute;es personnelles suivantes :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-text-primary">Donn&eacute;es d'identification :</strong> pr&eacute;nom,
                  adresse email
                </li>
                <li>
                  <strong className="text-text-primary">Donn&eacute;es de navigation :</strong> adresse IP,
                  type de navigateur, pages consult&eacute;es, dur&eacute;e de visite
                </li>
                <li>
                  <strong className="text-text-primary">Donn&eacute;es relatives au paiement :</strong> les
                  informations de paiement sont collect&eacute;es et trait&eacute;es directement par notre
                  prestataire Stripe. Nous ne stockons aucune donn&eacute;e bancaire sur nos serveurs.
                </li>
                <li>
                  <strong className="text-text-primary">Donn&eacute;es du forum :</strong> messages publi&eacute;s,
                  pseudonyme
                </li>
              </ul>
            </div>

            {/* Finalités */}
            <div>
              <h2 className="font-heading text-xl font-bold text-green-islamic mb-3">
                3. Finalit&eacute;s du traitement
              </h2>
              <p className="mb-3">Vos donn&eacute;es sont collect&eacute;es pour les finalit&eacute;s suivantes :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cr&eacute;ation et gestion de votre compte utilisateur</li>
                <li>Fourniture et gestion de l'acc&egrave;s aux services (gratuit et premium)</li>
                <li>Traitement des paiements et gestion des abonnements</li>
                <li>Envoi de communications relatives au service (confirmations, notifications)</li>
                <li>Envoi de newsletters (avec votre consentement)</li>
                <li>Am&eacute;lioration du site et de l'exp&eacute;rience utilisateur</li>
                <li>Gestion du forum communautaire</li>
                <li>Respect de nos obligations l&eacute;gales</li>
              </ul>
            </div>

            {/* Base légale */}
            <div>
              <h2 className="font-heading text-xl font-bold text-green-islamic mb-3">
                4. Bases l&eacute;gales du traitement
              </h2>
              <p className="mb-3">Le traitement de vos donn&eacute;es repose sur les bases l&eacute;gales suivantes :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-text-primary">Ex&eacute;cution du contrat :</strong> gestion de
                  votre compte, acc&egrave;s aux services, traitement des paiements
                </li>
                <li>
                  <strong className="text-text-primary">Consentement :</strong> envoi de newsletters,
                  d&eacute;p&ocirc;t de cookies analytiques
                </li>
                <li>
                  <strong className="text-text-primary">Int&eacute;r&ecirc;t l&eacute;gitime :</strong> am&eacute;lioration du
                  site, s&eacute;curit&eacute;, pr&eacute;vention de la fraude
                </li>
                <li>
                  <strong className="text-text-primary">Obligation l&eacute;gale :</strong> conservation des
                  donn&eacute;es de facturation
                </li>
              </ul>
            </div>

            {/* Durée de conservation */}
            <div>
              <h2 className="font-heading text-xl font-bold text-green-islamic mb-3">
                5. Dur&eacute;e de conservation
              </h2>
              <p className="mb-3">Vos donn&eacute;es personnelles sont conserv&eacute;es pour les dur&eacute;es suivantes :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-text-primary">Donn&eacute;es de compte :</strong> pendant toute la
                  dur&eacute;e de votre inscription, puis 3 ans apr&egrave;s votre derni&egrave;re activit&eacute;
                </li>
                <li>
                  <strong className="text-text-primary">Donn&eacute;es de facturation :</strong> 10 ans
                  conform&eacute;ment aux obligations comptables
                </li>
                <li>
                  <strong className="text-text-primary">Donn&eacute;es de navigation :</strong> 13 mois
                  maximum
                </li>
                <li>
                  <strong className="text-text-primary">Messages du forum :</strong> pendant la dur&eacute;e
                  de vie du compte, sauf suppression anticip&eacute;e par l'utilisateur ou mod&eacute;ration
                </li>
              </ul>
            </div>

            {/* Droits des utilisateurs */}
            <div>
              <h2 className="font-heading text-xl font-bold text-green-islamic mb-3">
                6. Vos droits
              </h2>
              <p className="mb-3">
                Conform&eacute;ment au RGPD et &agrave; la loi Informatique et Libert&eacute;s, vous disposez des
                droits suivants sur vos donn&eacute;es personnelles :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-text-primary">Droit d'acc&egrave;s :</strong> obtenir la confirmation que vos donn&eacute;es sont trait&eacute;es et en recevoir une copie</li>
                <li><strong className="text-text-primary">Droit de rectification :</strong> demander la correction de donn&eacute;es inexactes ou incompl&egrave;tes</li>
                <li><strong className="text-text-primary">Droit &agrave; l'effacement :</strong> demander la suppression de vos donn&eacute;es dans les conditions pr&eacute;vues par la loi</li>
                <li><strong className="text-text-primary">Droit &agrave; la portabilit&eacute; :</strong> recevoir vos donn&eacute;es dans un format structur&eacute; et lisible par machine</li>
                <li><strong className="text-text-primary">Droit d'opposition :</strong> vous opposer au traitement de vos donn&eacute;es pour des motifs l&eacute;gitimes</li>
                <li><strong className="text-text-primary">Droit &agrave; la limitation :</strong> demander la limitation du traitement dans certains cas</li>
                <li><strong className="text-text-primary">Droit de retirer votre consentement :</strong> &agrave; tout moment, sans que cela n'affecte la lic&eacute;it&eacute; du traitement ant&eacute;rieur</li>
              </ul>
              <div className="mt-4 rounded-2xl bg-white border border-cream-dark p-6 shadow-sm">
                <p>
                  Pour exercer vos droits, envoyez un email &agrave; :{' '}
                  <a href="mailto:coaching.roqya@gmail.com" className="text-green-islamic underline hover:text-gold transition-colors">
                    coaching.roqya@gmail.com
                  </a>
                </p>
                <p className="mt-2 text-sm">
                  Nous nous engageons &agrave; r&eacute;pondre &agrave; votre demande dans un d&eacute;lai d'un mois.
                  Vous disposez &eacute;galement du droit d'introduire une r&eacute;clamation aupr&egrave;s de la
                  CNIL (Commission Nationale de l'Informatique et des Libert&eacute;s) : www.cnil.fr.
                </p>
              </div>
            </div>

            {/* Cookies */}
            <div>
              <h2 className="font-heading text-xl font-bold text-green-islamic mb-3">
                7. Cookies
              </h2>
              <p className="mb-3">Le site ma-roqya.fr utilise les types de cookies suivants :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-text-primary">Cookies strictement n&eacute;cessaires :</strong> indispensables
                  au fonctionnement du site (authentification, session, pr&eacute;f&eacute;rences de langue).
                  Ces cookies ne n&eacute;cessitent pas votre consentement.
                </li>
                <li>
                  <strong className="text-text-primary">Cookies analytiques :</strong> permettent de mesurer
                  l'audience du site et d'analyser la navigation pour am&eacute;liorer nos services.
                  Ces cookies sont d&eacute;pos&eacute;s uniquement avec votre consentement.
                </li>
              </ul>
              <p className="mt-3">
                Vous pouvez &agrave; tout moment modifier vos pr&eacute;f&eacute;rences en mati&egrave;re de cookies via
                les param&egrave;tres de votre navigateur.
              </p>
            </div>

            {/* Sous-traitants */}
            <div>
              <h2 className="font-heading text-xl font-bold text-green-islamic mb-3">
                8. Sous-traitants et destinataires des donn&eacute;es
              </h2>
              <p className="mb-3">
                Vos donn&eacute;es personnelles peuvent &ecirc;tre transmises aux sous-traitants suivants,
                dans le cadre strict des finalit&eacute;s d&eacute;crites ci-dessus :
              </p>
              <div className="rounded-2xl bg-white border border-cream-dark p-6 shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-cream-dark">
                      <th className="text-left py-2 pr-4 text-text-primary font-semibold">Sous-traitant</th>
                      <th className="text-left py-2 pr-4 text-text-primary font-semibold">Finalit&eacute;</th>
                      <th className="text-left py-2 text-text-primary font-semibold">Pays</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-dark">
                    <tr>
                      <td className="py-2 pr-4">Supabase</td>
                      <td className="py-2 pr-4">Base de donn&eacute;es et authentification</td>
                      <td className="py-2">USA</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">Stripe</td>
                      <td className="py-2 pr-4">Traitement des paiements</td>
                      <td className="py-2">USA</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">Resend</td>
                      <td className="py-2 pr-4">Envoi d'emails transactionnels</td>
                      <td className="py-2">USA</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">Vercel</td>
                      <td className="py-2 pr-4">H&eacute;bergement du site</td>
                      <td className="py-2">USA</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Transferts hors UE */}
            <div>
              <h2 className="font-heading text-xl font-bold text-green-islamic mb-3">
                9. Transferts de donn&eacute;es hors de l'Union europ&eacute;enne
              </h2>
              <p>
                Certains de nos sous-traitants sont situ&eacute;s aux &Eacute;tats-Unis. Ces transferts sont
                encadr&eacute;s par des garanties appropri&eacute;es conform&eacute;ment au RGPD, notamment :
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Le cadre de protection des donn&eacute;es UE-&Eacute;tats-Unis (EU-U.S. Data Privacy Framework)</li>
                <li>Les clauses contractuelles types (CCT) approuv&eacute;es par la Commission europ&eacute;enne</li>
              </ul>
              <p className="mt-3">
                Vous pouvez obtenir une copie des garanties mises en place en nous contactant
                &agrave; l'adresse coaching.roqya@gmail.com.
              </p>
            </div>

            {/* Sécurité */}
            <div>
              <h2 className="font-heading text-xl font-bold text-green-islamic mb-3">
                10. S&eacute;curit&eacute; des donn&eacute;es
              </h2>
              <p>
                Nous mettons en &oelig;uvre des mesures techniques et organisationnelles appropri&eacute;es
                pour prot&eacute;ger vos donn&eacute;es personnelles contre tout acc&egrave;s non autoris&eacute;,
                modification, divulgation ou destruction. Ces mesures comprennent notamment
                le chiffrement des donn&eacute;es en transit (HTTPS), la s&eacute;curisation des acc&egrave;s
                par mot de passe et l'utilisation de services d'h&eacute;bergement s&eacute;curis&eacute;s.
              </p>
            </div>

            {/* Modification */}
            <div>
              <h2 className="font-heading text-xl font-bold text-green-islamic mb-3">
                11. Modification de la politique de confidentialit&eacute;
              </h2>
              <p>
                Nous nous r&eacute;servons le droit de modifier la pr&eacute;sente politique de confidentialit&eacute;
                &agrave; tout moment. En cas de modification substantielle, nous vous en informerons
                par email ou par une notification sur le site. La date de derni&egrave;re mise &agrave; jour
                est indiqu&eacute;e ci-dessous.
              </p>
            </div>

            <p className="text-sm text-text-secondary/60 pt-4 border-t border-cream-dark">
              Derni&egrave;re mise &agrave; jour : 28 mars 2026
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
