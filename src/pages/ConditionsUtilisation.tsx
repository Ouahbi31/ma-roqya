export default function ConditionsUtilisation() {
  return (
    <div className="min-h-screen bg-cream">
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="font-heading text-3xl font-bold text-green-islamic mb-8">
            Conditions G&eacute;n&eacute;rales d'Utilisation
          </h1>

          <div className="space-y-8 text-text-secondary leading-relaxed">
            {/* Objet */}
            <div>
              <h2 className="font-heading text-xl font-bold text-green-islamic mb-3">
                1. Objet
              </h2>
              <p>
                Les pr&eacute;sentes Conditions G&eacute;n&eacute;rales d'Utilisation (ci-apr&egrave;s &laquo; CGU &raquo;) ont pour objet
                de d&eacute;finir les modalit&eacute;s et conditions d'utilisation du site ma-roqya.fr
                (ci-apr&egrave;s &laquo; le Site &raquo;), &eacute;dit&eacute; par Ouchen Ouahbi. Le Site propose un accompagnement
                en coaching de d&eacute;veloppement personnel et spirituel (Psycho-Roqya), incluant des
                contenus &eacute;ducatifs (articles, vid&eacute;os, douas), un programme structur&eacute;, un forum
                communautaire et des s&eacute;ances individuelles.
              </p>
              <p className="mt-3">
                L'acc&egrave;s et l'utilisation du Site impliquent l'acceptation pleine et enti&egrave;re des
                pr&eacute;sentes CGU. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser le Site.
              </p>
            </div>

            {/* Accès au service */}
            <div>
              <h2 className="font-heading text-xl font-bold text-green-islamic mb-3">
                2. Acc&egrave;s au service
              </h2>
              <p className="mb-3">Le Site propose deux niveaux d'acc&egrave;s :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-text-primary">Acc&egrave;s gratuit :</strong> consultation des
                  articles, vid&eacute;os publiques, douas, quiz de diagnostic et acc&egrave;s limit&eacute; au forum
                </li>
                <li>
                  <strong className="text-text-primary">Acc&egrave;s Premium :</strong> acc&egrave;s &agrave; l'ensemble
                  des contenus, au programme complet de Psycho-Roqya, au forum sans restriction
                  et aux fonctionnalit&eacute;s avanc&eacute;es
                </li>
              </ul>
              <p className="mt-3">
                L'&eacute;diteur se r&eacute;serve le droit de modifier, suspendre ou interrompre tout ou partie
                du service &agrave; tout moment, avec ou sans pr&eacute;avis.
              </p>
            </div>

            {/* Inscription */}
            <div>
              <h2 className="font-heading text-xl font-bold text-green-islamic mb-3">
                3. Inscription
              </h2>
              <p className="mb-3">
                Pour acc&eacute;der &agrave; certaines fonctionnalit&eacute;s du Site, l'utilisateur doit cr&eacute;er un
                compte en fournissant :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Une adresse email valide</li>
                <li>Un pr&eacute;nom</li>
                <li>Un mot de passe s&eacute;curis&eacute;</li>
              </ul>
              <p className="mt-3">
                L'utilisateur s'engage &agrave; fournir des informations exactes et &agrave; jour, et &agrave;
                maintenir la confidentialit&eacute; de ses identifiants de connexion. Toute utilisation
                du compte est sous la responsabilit&eacute; de l'utilisateur.
              </p>
              <p className="mt-3">
                L'utilisateur doit &ecirc;tre &acirc;g&eacute; d'au moins 16 ans pour cr&eacute;er un compte. Pour les
                mineurs de moins de 16 ans, le consentement d'un parent ou tuteur l&eacute;gal est
                requis.
              </p>
            </div>

            {/* Abonnement Premium */}
            <div>
              <h2 className="font-heading text-xl font-bold text-green-islamic mb-3">
                4. Abonnement Premium
              </h2>
              <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">
                4.1 Tarifs
              </h3>
              <div className="rounded-2xl bg-white border border-cream-dark p-6 shadow-sm mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-cream-dark">
                      <th className="text-left py-2 pr-4 text-text-primary font-semibold">Formule</th>
                      <th className="text-left py-2 text-text-primary font-semibold">Tarif</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-dark">
                    <tr>
                      <td className="py-2 pr-4">Mensuel</td>
                      <td className="py-2">9,99 &euro;/mois</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">Trimestriel</td>
                      <td className="py-2">23,97 &euro;/trimestre (soit 7,99 &euro;/mois)</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">Annuel</td>
                      <td className="py-2">59,88 &euro;/an (soit 4,99 &euro;/mois)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mb-3">Les prix sont indiqu&eacute;s en euros, toutes taxes comprises (TTC).</p>

              <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">
                4.2 Paiement et renouvellement
              </h3>
              <p className="mb-3">
                Le paiement est effectu&eacute; par carte bancaire via notre prestataire s&eacute;curis&eacute;
                Stripe. L'abonnement est renouvel&eacute; automatiquement &agrave; la fin de chaque p&eacute;riode
                (mois, trimestre ou ann&eacute;e), sauf r&eacute;siliation pr&eacute;alable par l'utilisateur.
              </p>

              <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">
                4.3 R&eacute;siliation de l'abonnement
              </h3>
              <p>
                L'utilisateur peut r&eacute;silier son abonnement &agrave; tout moment depuis son espace
                personnel ou en envoyant un email &agrave; coaching.roqya@gmail.com. La r&eacute;siliation
                prend effet &agrave; la fin de la p&eacute;riode en cours. L'utilisateur conserve l'acc&egrave;s &agrave;
                son abonnement jusqu'&agrave; la date d'expiration.
              </p>
            </div>

            {/* Séances individuelles */}
            <div>
              <h2 className="font-heading text-xl font-bold text-green-islamic mb-3">
                5. S&eacute;ances individuelles
              </h2>
              <div className="rounded-2xl bg-white border border-cream-dark p-6 shadow-sm space-y-3">
                <p>
                  <strong className="text-text-primary">Tarif :</strong> 50 &euro; par s&eacute;ance
                </p>
                <p>
                  <strong className="text-text-primary">Annulation :</strong> toute annulation doit
                  intervenir au moins 24 heures avant l'heure pr&eacute;vue de la s&eacute;ance. Pass&eacute; ce
                  d&eacute;lai, la s&eacute;ance sera consid&eacute;r&eacute;e comme due et ne pourra faire l'objet d'un
                  remboursement.
                </p>
                <p>
                  <strong className="text-text-primary">Report :</strong> en cas d'emp&ecirc;chement
                  signal&eacute; au moins 24 heures &agrave; l'avance, la s&eacute;ance pourra &ecirc;tre report&eacute;e &agrave; une
                  date ult&eacute;rieure, sous r&eacute;serve de disponibilit&eacute;.
                </p>
              </div>
            </div>

            {/* Forum */}
            <div>
              <h2 className="font-heading text-xl font-bold text-green-islamic mb-3">
                6. Forum communautaire
              </h2>
              <p className="mb-3">
                Le forum est un espace d'&eacute;change bienveillant entre utilisateurs. En l'utilisant,
                vous vous engagez &agrave; respecter les r&egrave;gles suivantes :
              </p>
              <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">
                6.1 R&egrave;gles de conduite
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>S'exprimer avec respect et bienveillance envers les autres membres</li>
                <li>Ne pas publier de contenu injurieux, diffamatoire, discriminatoire ou haineux</li>
                <li>Ne pas partager de contenu &agrave; caract&egrave;re sexuel, violent ou ill&eacute;gal</li>
                <li>Respecter la vie priv&eacute;e des autres utilisateurs</li>
              </ul>

              <h3 className="font-heading text-lg font-semibold text-text-primary mt-4 mb-2">
                6.2 Contenu interdit
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Liens externes ou publicitaires (spam)</li>
                <li>Num&eacute;ros de t&eacute;l&eacute;phone personnels ou coordonn&eacute;es priv&eacute;es</li>
                <li>Contenu promotionnel ou commercial non autoris&eacute;</li>
                <li>Messages r&eacute;p&eacute;titifs (spam)</li>
                <li>Contenu portant atteinte aux droits de propri&eacute;t&eacute; intellectuelle de tiers</li>
              </ul>

              <h3 className="font-heading text-lg font-semibold text-text-primary mt-4 mb-2">
                6.3 Mod&eacute;ration
              </h3>
              <p>
                L'&eacute;diteur se r&eacute;serve le droit de mod&eacute;rer, modifier ou supprimer tout contenu
                ne respectant pas les pr&eacute;sentes r&egrave;gles, sans pr&eacute;avis. En cas de manquements
                r&eacute;p&eacute;t&eacute;s ou graves, le compte de l'utilisateur pourra &ecirc;tre suspendu ou supprim&eacute;.
              </p>
            </div>

            {/* Propriété intellectuelle */}
            <div>
              <h2 className="font-heading text-xl font-bold text-green-islamic mb-3">
                7. Propri&eacute;t&eacute; intellectuelle
              </h2>
              <p>
                L'ensemble des contenus du Site (textes, vid&eacute;os, images, logos, programme,
                graphismes) sont la propri&eacute;t&eacute; exclusive de Ouchen Ouahbi et sont prot&eacute;g&eacute;s par
                le droit de la propri&eacute;t&eacute; intellectuelle. Toute reproduction, distribution ou
                utilisation non autoris&eacute;e est strictement interdite et pourra faire l'objet de
                poursuites judiciaires.
              </p>
              <p className="mt-3">
                Les contenus publi&eacute;s par les utilisateurs sur le forum restent la propri&eacute;t&eacute; de
                leurs auteurs. En publiant sur le forum, l'utilisateur accorde &agrave; l'&eacute;diteur une
                licence non exclusive d'utilisation de ces contenus dans le cadre du
                fonctionnement du Site.
              </p>
            </div>

            {/* Responsabilité */}
            <div>
              <h2 className="font-heading text-xl font-bold text-green-islamic mb-3">
                8. Limitation de responsabilit&eacute;
              </h2>
              <div className="rounded-2xl bg-white border border-cream-dark p-6 shadow-sm">
                <p className="font-semibold text-text-primary mb-3">
                  Avertissement important :
                </p>
                <p className="mb-3">
                  Le Site et les services propos&eacute;s ne se substituent en aucun cas &agrave; un avis
                  m&eacute;dical, psychologique ou psychiatrique. Le coaching en Psycho-Roqya est un
                  accompagnement spirituel et de d&eacute;veloppement personnel qui ne constitue pas
                  un acte m&eacute;dical.
                </p>
                <p className="mb-3">
                  En cas de probl&egrave;mes de sant&eacute; physique ou mentale, l'utilisateur est invit&eacute; &agrave;
                  consulter un professionnel de sant&eacute; qualifi&eacute;.
                </p>
                <p>
                  L'&eacute;diteur ne saurait &ecirc;tre tenu responsable des dommages directs ou indirects
                  r&eacute;sultant de l'utilisation du Site ou de l'application des conseils et
                  informations qui y sont diffus&eacute;s.
                </p>
              </div>
            </div>

            {/* Droit de rétractation */}
            <div>
              <h2 className="font-heading text-xl font-bold text-green-islamic mb-3">
                9. Droit de r&eacute;tractation
              </h2>
              <p>
                Conform&eacute;ment aux articles L.221-18 et suivants du Code de la consommation,
                l'utilisateur dispose d'un d&eacute;lai de 14 jours &agrave; compter de la souscription de
                son abonnement pour exercer son droit de r&eacute;tractation, sans avoir &agrave; justifier
                de motifs ni &agrave; payer de p&eacute;nalit&eacute;s.
              </p>
              <p className="mt-3">
                Toutefois, conform&eacute;ment &agrave; l'article L.221-28 du Code de la consommation, le
                droit de r&eacute;tractation ne peut &ecirc;tre exerc&eacute; si l'ex&eacute;cution du service a
                commenc&eacute;, avec l'accord de l'utilisateur, avant la fin du d&eacute;lai de r&eacute;tractation.
                En souscrivant &agrave; un abonnement et en acc&eacute;dant aux contenus premium, l'utilisateur
                reconna&icirc;t que l'ex&eacute;cution du service a commenc&eacute; et renonce &agrave; son droit de
                r&eacute;tractation pour la p&eacute;riode en cours.
              </p>
              <p className="mt-3">
                Pour exercer votre droit de r&eacute;tractation, envoyez un email &agrave;{' '}
                <a href="mailto:coaching.roqya@gmail.com" className="text-green-islamic underline hover:text-gold transition-colors">
                  coaching.roqya@gmail.com
                </a>{' '}
                en indiquant vos coordonn&eacute;es et votre souhait de vous r&eacute;tracter.
              </p>
            </div>

            {/* Résiliation */}
            <div>
              <h2 className="font-heading text-xl font-bold text-green-islamic mb-3">
                10. R&eacute;siliation
              </h2>
              <p>
                L'&eacute;diteur se r&eacute;serve le droit de suspendre ou de supprimer le compte d'un
                utilisateur en cas de non-respect des pr&eacute;sentes CGU, et ce sans pr&eacute;avis ni
                indemnit&eacute;. L'utilisateur peut &agrave; tout moment demander la suppression de son
                compte en envoyant un email &agrave;{' '}
                <a href="mailto:coaching.roqya@gmail.com" className="text-green-islamic underline hover:text-gold transition-colors">
                  coaching.roqya@gmail.com
                </a>.
              </p>
            </div>

            {/* Modification des CGU */}
            <div>
              <h2 className="font-heading text-xl font-bold text-green-islamic mb-3">
                11. Modification des CGU
              </h2>
              <p>
                L'&eacute;diteur se r&eacute;serve le droit de modifier les pr&eacute;sentes CGU &agrave; tout moment.
                Les utilisateurs seront inform&eacute;s de toute modification substantielle par email
                ou par notification sur le Site. La continuation de l'utilisation du Site apr&egrave;s
                modification vaut acceptation des nouvelles CGU.
              </p>
            </div>

            {/* Loi applicable */}
            <div>
              <h2 className="font-heading text-xl font-bold text-green-islamic mb-3">
                12. Loi applicable et juridiction comp&eacute;tente
              </h2>
              <p>
                Les pr&eacute;sentes CGU sont r&eacute;gies par le droit fran&ccedil;ais. En cas de litige relatif &agrave;
                l'interpr&eacute;tation ou &agrave; l'ex&eacute;cution des pr&eacute;sentes CGU, les parties s'efforceront
                de trouver une solution amiable. &Agrave; d&eacute;faut, le litige sera port&eacute; devant les
                tribunaux comp&eacute;tents de Toulouse.
              </p>
              <p className="mt-3">
                Conform&eacute;ment aux dispositions du Code de la consommation relatives au r&egrave;glement
                amiable des litiges, l'utilisateur peut &eacute;galement recourir &agrave; la plateforme de
                r&eacute;solution des litiges en ligne de la Commission europ&eacute;enne accessible &agrave;
                l'adresse suivante :{' '}
                <a
                  href="https://ec.europa.eu/consumers/odr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-islamic underline hover:text-gold transition-colors"
                >
                  ec.europa.eu/consumers/odr
                </a>.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h2 className="font-heading text-xl font-bold text-green-islamic mb-3">
                13. Contact
              </h2>
              <p>
                Pour toute question relative aux pr&eacute;sentes CGU, vous pouvez nous contacter &agrave; :{' '}
                <a href="mailto:coaching.roqya@gmail.com" className="text-green-islamic underline hover:text-gold transition-colors">
                  coaching.roqya@gmail.com
                </a>
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
