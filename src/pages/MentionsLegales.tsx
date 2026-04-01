import SEO from '../components/SEO';

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-cream">
      <SEO title="Mentions légales — CoachMyNefs" description="Mentions légales du site CoachMyNefs — informations légales, éditeur et hébergeur." />
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="font-heading text-3xl font-bold text-green-islamic mb-8">
            Mentions L&eacute;gales
          </h1>

          <div className="space-y-8 text-text-secondary leading-relaxed">
            {/* Éditeur */}
            <div>
              <h2 className="font-heading text-xl font-bold text-green-islamic mb-3">
                1. &Eacute;diteur du site
              </h2>
              <div className="rounded-2xl bg-white border border-cream-dark p-6 shadow-sm space-y-1">
                <p><strong className="text-text-primary">Nom du site :</strong> CoachMyNefs</p>
                <p><strong className="text-text-primary">URL :</strong> coachmynefs.com</p>
                <p><strong className="text-text-primary">&Eacute;diteur :</strong> Ouchen Ouahbi</p>
                <p><strong className="text-text-primary">Statut :</strong> Entrepreneur individuel</p>
                <p><strong className="text-text-primary">SIRET :</strong> 982 950 420 00017</p>
                <p><strong className="text-text-primary">Adresse :</strong> 13 cheminement Francisco de Goya, 31100 Toulouse, France</p>
                <p><strong className="text-text-primary">Email :</strong> coachmynefs@gmail.com</p>
                <p>
                  <strong className="text-text-primary">Activit&eacute; :</strong> Coaching en
                  d&eacute;veloppement personnel et accompagnement spirituel (Psycho-Roqya)
                </p>
              </div>
            </div>

            {/* Directeur de la publication */}
            <div>
              <h2 className="font-heading text-xl font-bold text-green-islamic mb-3">
                2. Directeur de la publication
              </h2>
              <p>
                Le directeur de la publication est <strong className="text-text-primary">Ouchen Ouahbi</strong>,
                joignable &agrave; l'adresse email : coachmynefs@gmail.com.
              </p>
            </div>

            {/* Hébergeur */}
            <div>
              <h2 className="font-heading text-xl font-bold text-green-islamic mb-3">
                3. H&eacute;bergeur
              </h2>
              <div className="rounded-2xl bg-white border border-cream-dark p-6 shadow-sm space-y-1">
                <p><strong className="text-text-primary">Raison sociale :</strong> Vercel Inc.</p>
                <p><strong className="text-text-primary">Adresse :</strong> 440 N Barranca Ave #4133, Covina, CA 91723, USA</p>
                <p><strong className="text-text-primary">Site web :</strong> vercel.com</p>
              </div>
            </div>

            {/* Propriété intellectuelle */}
            <div>
              <h2 className="font-heading text-xl font-bold text-green-islamic mb-3">
                4. Propri&eacute;t&eacute; intellectuelle
              </h2>
              <p>
                L'ensemble du contenu du site coachmynefs.com (textes, images, vid&eacute;os, logos,
                &eacute;l&eacute;ments graphiques, structure) est prot&eacute;g&eacute; par le droit d'auteur et le droit
                de la propri&eacute;t&eacute; intellectuelle. Toute reproduction, repr&eacute;sentation, modification,
                publication ou adaptation de tout ou partie des &eacute;l&eacute;ments du site, quel que soit
                le moyen ou le proc&eacute;d&eacute; utilis&eacute;, est interdite sans l'autorisation &eacute;crite pr&eacute;alable
                de Ouchen Ouahbi.
              </p>
              <p className="mt-3">
                Toute exploitation non autoris&eacute;e du site ou de son contenu sera consid&eacute;r&eacute;e comme
                constitutive d'une contrefa&ccedil;on et poursuivie conform&eacute;ment aux dispositions des
                articles L.335-2 et suivants du Code de la propri&eacute;t&eacute; intellectuelle.
              </p>
            </div>

            {/* Crédits */}
            <div>
              <h2 className="font-heading text-xl font-bold text-green-islamic mb-3">
                5. Cr&eacute;dits
              </h2>
              <p>
                Le site coachmynefs.com a &eacute;t&eacute; con&ccedil;u et d&eacute;velopp&eacute; par Ouchen Ouahbi.
                Les ic&ocirc;nes utilis&eacute;es proviennent de la biblioth&egrave;que Lucide Icons.
              </p>
            </div>

            {/* Données personnelles */}
            <div>
              <h2 className="font-heading text-xl font-bold text-green-islamic mb-3">
                6. Donn&eacute;es personnelles
              </h2>
              <p>
                Pour toute information relative &agrave; la collecte et au traitement des donn&eacute;es
                personnelles, veuillez consulter notre{' '}
                <a href="/confidentialite" className="text-green-islamic underline hover:text-gold transition-colors">
                  Politique de confidentialit&eacute;
                </a>.
              </p>
            </div>

            {/* Loi applicable */}
            <div>
              <h2 className="font-heading text-xl font-bold text-green-islamic mb-3">
                7. Loi applicable
              </h2>
              <p>
                Les pr&eacute;sentes mentions l&eacute;gales sont r&eacute;gies par le droit fran&ccedil;ais.
                En cas de litige, les tribunaux de Toulouse seront seuls comp&eacute;tents.
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
