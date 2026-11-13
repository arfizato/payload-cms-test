import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { AboutStory } from '@/blocks/AboutStory'
import { Certifications, adaptCertifications } from '@/blocks/Certifications'
import { ClientLogos, adaptClientLogos } from '@/blocks/ClientLogos'
import { Entities } from '@/blocks/Entities'
import { Contact, adaptContact } from '@/blocks/Contact'
import { Footer, adaptFooter } from '@/blocks/Footer'
import { FounderQuote, adaptFounderQuote } from '@/blocks/FounderQuote'
import { MissionVision } from '@/blocks/MissionVision'
import { Hero } from '@/blocks/Hero'
import { Stats, adaptStats } from '@/blocks/Stats'
import { Values } from '@/blocks/Values'
import { Navbar, navbarPlaceholder } from '@/components/Navbar'
import { asset } from '@/utilities/asset'
import '../styles.css'

/**
 * "À propos" — the company story page.
 *
 * First pass: the chrome only. Navbar, hero, client logos, contact, stats and
 * footer are the blocks the other pages already share, so this route is
 * deliberately thin. The narrative sections in the design — Notre histoire, the
 * CEO quote, Mission & Vision, Nos valeurs, Quatre entités, Des produits
 * certifiés and Notre équipe — land in later passes, one section at a time.
 *
 * Static like /projets and /metiers, and listed in `revalidateHome`'s PATHS so
 * the client band and the stats here rebuild with everything else.
 */
export const dynamic = 'force-static'

/**
 * Hardcoded like the other page heroes: this is typography, not editable copy.
 *
 * The photo is the one in the Figma frame, exported at 2400px and converted to
 * webp. Unlike the other heroes it is not anchored low — the faces sit near the
 * vertical middle of the frame, and the default `center 62%` crops them.
 */
const hero = {
  badge: 'À propos',
  title: 'Du brief à la livraison, nous orchestrons chaque dimension de votre espace.',
  lede: 'Fondé en 2008 à Ariana, Groupe BigArt est le seul acteur en Tunisie à intégrer conception, fourniture de produits certifiés européens et réalisation terrain sous un même toit.',
  // No CTA in this frame; the hero ends on the lede, as on /metiers.
  image: {
    src: asset('/about-hero.webp'),
    alt: 'Quatre collaborateurs réunis autour d’un ordinateur portable dans une salle de réunion',
    focalPoint: 'center',
  },
}

/**
 * "Notre histoire". Fixed copy, like the hero above it — this section is not
 * editable in the admin and has no Payload config behind it.
 *
 * The photograph is the one the Cloisonnement métier uses, but it is shipped as
 * its own static asset rather than read from the Media collection: swapping the
 * Cloisonnement photo in the admin must not silently change this page.
 */
const story = {
  badge: 'Notre histoire',
  titleLines: ['Un modèle hybride.', 'Construit par conviction.'],
  paragraphs: [
    'Groupe BigArt naît en 2008 de la conviction qu’une entreprise mérite un espace à la hauteur de ses ambitions. Face à un marché fragmenté, où conception, fourniture et réalisation impliquaient toujours plusieurs intervenants distincts, nous avons fait le choix inverse : tout intégrer.',
    'Architectes d’intérieur, graphistes, poseurs et techniciens travaillent sous le même toit, autour des mêmes projets, avec les mêmes exigences. Ce modèle hybride, unique en Tunisie, est ce qui nous permet de garantir une cohérence totale du premier plan à la dernière finition.',
    'Nous mettons notre expertise opérationnelle à la disposition des architectes et des bureaux d’études, pour leur garantir une exécution fidèle au concept et aux standards qu’ils ont définis. Plus de 1 000 projets plus tard, le groupe s’est structuré en quatre entités complémentaires : BigArt pour l’aménagement et la réalisation, BigArt Design pour la conception, BigArt Shop pour la distribution directe, et BigArt Events pour les expériences sur mesure.',
  ],
  image: {
    src: asset('/about-histoire.webp'),
    alt: 'Plateau de bureaux cloisonné de verre, postes de travail le long des fenêtres',
  },
}

/**
 * "Mission & Vision". Fixed copy, like the hero and "Notre histoire" above it.
 *
 * The mission card is the `primary` one: in the design it carries the accent
 * wash and the solid border, so it reads before the vision beside it.
 */
const missionVision = {
  badge: 'Mission & Vision',
  titleLines: ['Ce qui guide chaque', 'décision, chaque projet.'],
  cards: [
    {
      heading: 'Notre mission',
      body: 'Fournir aux entreprises une solution complète d’aménagement professionnel, de la conception à la livraison, en intégrant bureau d’études, produits certifiés européens et exécution terrain sous un même toit. Chaque espace que nous livrons porte l’identité du client.',
      variant: 'primary' as const,
    },
    {
      heading: 'Notre vision',
      body: 'Être la référence tunisienne de l’aménagement professionnel intégré. Imposer le standard d’un acteur qui conçoit, fournit et réalise, là où le marché reste fragmenté entre intervenants multiples et responsabilités diluées.',
      variant: 'secondary' as const,
    },
  ],
}

/**
 * "Nos valeurs". Fixed copy, like the sections above it.
 *
 * The design's 01–04 are not written here: they are the position in this array,
 * so reordering a value renumbers it rather than leaving the labels wrong.
 */
const values = {
  badge: 'Nos valeurs',
  titleLines: ['Ce que nous défendons', 'sur chaque projet.'],
  items: [
    {
      name: 'Exigence',
      description:
        'Sur la qualité des produits comme sur la précision de l’exécution. Chaque détail compte, du premier plan à la dernière finition.',
    },
    {
      name: 'Intégrité',
      description:
        'Dans la relation client et dans nos engagements. Nous disons ce que nous faisons, et nous faisons ce que nous disons.',
    },
    {
      name: 'Innovation',
      description:
        'Dans le sourcing, les solutions techniques et les produits que nous proposons. Toujours à l’affût de ce qui élève le standard.',
    },
    {
      name: 'Proximité',
      description:
        'Avec chaque client, du brief à la livraison. Un interlocuteur dédié, une équipe accessible, une relation qui dure au-delà du projet.',
    },
  ],
}

/**
 * "L'écosystème du groupe". Fixed copy, like the sections above it.
 *
 * Instant Ideation and BigArt Events are the two the design tints — one red,
 * one orange — so they read as the poles of the group's range.
 */
const entities = {
  badge: 'L’écosystème du groupe',
  titleLines: ['Quatre entités. Une', 'vision commune.'],
  lede: 'Groupe BigArt s’est structuré autour de quatre entités complémentaires qui couvrent l’intégralité du cycle de l’espace professionnel.',
  items: [
    {
      name: 'Instant Ideation',
      tagline: 'Aménagement & Réalisation',
      description:
        'Le cœur opérationnel du groupe. Six métiers intégrés, une seule équipe, de la conception à la pose sur chaque projet.',
      tint: 'accent' as const,
    },
    {
      name: 'Smart Adaptability',
      tagline: 'Bureau d’études intégré',
      description:
        'Architectes d’intérieur et graphistes qui interviennent dès le brief, produisent plans et visualisations 3D, et accompagnent chaque projet jusqu’à la livraison.',
    },
    {
      name: 'BigArt Shop',
      tagline: 'Distribution directe B2B & B2C',
      description:
        'Cloisons, films, revêtements muraux et textiles des marques exclusives du groupe, accessibles aux professionnels et aux particuliers via un catalogue dédié.',
    },
    {
      name: 'BigArt Events',
      tagline: 'Expériences sur mesure',
      description:
        'De l’événement corporate à la compétition sportive, BigArt Events conçoit et orchestre des expériences qui rassemblent, engagent et marquent les esprits.',
      tint: 'ember' as const,
    },
  ],
}

export default async function AboutPage() {
  const payload = await getPayload({ config: await config })

  const [
    footerDoc,
    siteInfo,
    servicesResult,
    clientsResult,
    statsDoc,
    founderQuoteDoc,
    certificationsDoc,
  ] = await Promise.all([
      payload.findGlobal({ slug: 'footer', depth: 0 }),
      payload.findGlobal({ slug: 'site-info', depth: 0 }),
      // The footer only needs the titles, so depth 0 is enough here.
      payload.find({ collection: 'services', depth: 0, limit: 20, sort: 'order' }),
      payload.find({ collection: 'clients', depth: 1, limit: 50, sort: 'order' }),
      payload.findGlobal({ slug: 'stats', depth: 0 }),
      payload.findGlobal({ slug: 'founder-quote', depth: 0 }),
      payload.findGlobal({ slug: 'certifications', depth: 0 }),
    ])

  return (
    <>
      <Navbar {...navbarPlaceholder} activeHref="/a-propos" />
      <Hero {...hero} />
      <ClientLogos {...adaptClientLogos(clientsResult.docs)} />
      <AboutStory {...story} />
      <FounderQuote {...adaptFounderQuote(founderQuoteDoc)} />
      <MissionVision {...missionVision} />
      <Values {...values} />
      <Entities {...entities} />
      <Certifications {...adaptCertifications(certificationsDoc)} />
      <Contact {...adaptContact(siteInfo)} />
      {/* The design places the stats band low on this page, above the footer —
          not under the hero as on the homepage. */}
      <Stats {...adaptStats(statsDoc)} />
      <Footer {...adaptFooter(footerDoc, servicesResult.docs, siteInfo)} />
    </>
  )
}
