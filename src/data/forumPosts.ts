export interface ForumPost {
  id: string;
  user_name: string;
  titre: string;
  contenu: string;
  categorie: 'testimonials' | 'questions' | 'help' | 'douas';
  replies_count: number;
  created_at: string;
}

export const sampleForumPosts: ForumPost[] = [
  {
    id: 'post-001',
    user_name: 'Oum_Yasmine',
    titre: 'Al hamdulillah, guérison après 6 mois de roqya régulière',
    contenu:
      "As-salamu alaykum mes sœurs et frères. Je souhaitais partager mon expérience pour encourager ceux qui traversent des épreuves similaires. Après avoir souffert pendant longtemps de symptômes inexpliqués (fatigue extrême, cauchemars, blocages), j'ai commencé un programme de roqya shar'iyya régulier. Avec la permission d'Allah, après 6 mois de lecture quotidienne du Coran, d'adhkar rigoureux et de patience, je me sens enfin libérée. N'abandonnez jamais, la guérison vient d'Allah et Il est le Meilleur des guérisseurs. Qu'Allah vous accorde tous la guérison.",
    categorie: 'testimonials',
    replies_count: 23,
    created_at: '2026-01-15T14:30:00Z',
  },
  {
    id: 'post-002',
    user_name: 'AbdAllah_93',
    titre: 'Comment trouver un raqi de confiance dans ma région ?',
    contenu:
      "As-salamu alaykum. Je cherche un praticien de ruqya shar'iyya de confiance dans la région parisienne. J'ai entendu beaucoup d'histoires de charlatans qui profitent de la détresse des gens, et je veux m'assurer de consulter quelqu'un qui pratique selon le Coran et la Sunna uniquement. Quels sont les critères à vérifier ? Est-ce qu'il y a des signes qui doivent alerter ? Jazakum Allahu khayran pour vos conseils.",
    categorie: 'questions',
    replies_count: 15,
    created_at: '2026-02-03T10:15:00Z',
  },
  {
    id: 'post-003',
    user_name: 'Nour_el_Iman',
    titre: 'Besoin de conseils : difficultés à maintenir les adhkar quotidiens',
    contenu:
      "As-salamu alaykum la communauté. Je traverse une période difficile où je n'arrive plus à maintenir la régularité dans mes adhkar du matin et du soir. Chaque fois que j'essaie, je ressens une lourdeur et une envie de tout abandonner. Je sais que c'est peut-être un signe que j'en ai justement le plus besoin, mais c'est vraiment éprouvant. Est-ce que d'autres personnes ont vécu la même chose ? Comment avez-vous surmonté cette difficulté ? Qu'Allah nous facilite à tous.",
    categorie: 'help',
    replies_count: 31,
    created_at: '2026-02-20T18:45:00Z',
  },
  {
    id: 'post-004',
    user_name: 'Moussa_Talib',
    titre: 'Compilation de douas pour la protection de la famille',
    contenu:
      "As-salamu alaykum. Suite à plusieurs demandes, je partage ici une compilation des invocations prophétiques pour protéger sa famille et son foyer. Toutes les sources sont vérifiées dans les recueils authentiques (Bukhari, Muslim, Abu Dawud). N'oubliez pas que la régularité est la clé : le Prophète (paix et salut sur lui) nous a enseigné que les actes les plus aimés d'Allah sont les plus constants, même s'ils sont modestes. Prenez ce qui vous est facile et soyez réguliers. Qu'Allah protège vos familles.",
    categorie: 'douas',
    replies_count: 42,
    created_at: '2026-03-01T08:00:00Z',
  },
  {
    id: 'post-005',
    user_name: 'Khadija_Hope',
    titre: 'Mon enfant fait des cauchemars récurrents, que faire ?',
    contenu:
      "As-salamu alaykum. Ma fille de 7 ans fait des cauchemars presque toutes les nuits depuis quelques semaines. Elle se réveille en pleurant et a peur de dormir seule. Nous avons consulté un pédiatre qui n'a rien trouvé d'anormal. J'ai commencé à lui réciter les trois dernières sourates et Ayat al-Kursi avant de dormir, mais je me demande s'il y a d'autres choses que je peux faire. Est-ce normal à cet âge ou dois-je m'inquiéter ? Merci pour vos conseils bienveillants.",
    categorie: 'help',
    replies_count: 19,
    created_at: '2026-03-10T20:30:00Z',
  },
];
