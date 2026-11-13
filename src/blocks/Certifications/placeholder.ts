import type { CertificationsProps } from './types'

/** Transcribed from the design. Seed input only — see docs/content-architecture.md. */
export const certificationsPlaceholder: CertificationsProps = {
  badge: 'Exclusivités européennes',
  titleLines: ['Des produits certifiés.', 'Introuvables ailleurs en Tunisie.'],
  lede: 'Quatre marques européennes distribuées en exclusivité. Testés, certifiés et posés par nos propres équipes — une responsabilité totale de la fourniture à la mise en œuvre.',
  items: [
    {
      brand: 'ABCD International',
      heading: 'France. Partenariat exclusif depuis 2008.',
      // The design repeats the section lede here. Left as drawn rather than
      // invented — it is editable, so the client can give this card its own copy.
      body: 'Quatre marques européennes distribuées en exclusivité. Testés, certifiés et posés par nos propres équipes — une responsabilité totale de la fourniture à la mise en œuvre.',
      certification: 'Certification CERFF',
    },
    {
      brand: 'Solar Screen',
      heading: 'Belgique. Exclusivité Tunisie.',
      body: 'Films anti-chaleur, décoratifs, de confidentialité et de sécurité. Des gammes techniques pour améliorer le confort thermique, visuel et l’identité des espaces vitrés.',
      certification: 'Films certifiés EU',
    },
    {
      brand: 'Erfurt',
      heading: 'Allemagne. Exclusivité Tunisie.',
      body: 'Revêtements muraux professionnels. Gamme large de papiers peints techniques et décoratifs pour les espaces à forte sollicitation.',
      certification: 'Revêtements techniques',
    },
    {
      brand: 'Veilish',
      heading: 'Europe. Exclusivité Tunisie.',
      body: 'Films textiles pour le vitrage et les surfaces. La gamme « Dress Your Space » pour les projets à haute exigence esthétique.',
      certification: 'Films textiles premium',
    },
  ],
}
