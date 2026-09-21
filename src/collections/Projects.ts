import type { CollectionConfig } from 'payload'

import { adminOnly, canEdit, hideUnless } from '@/access'
import { GROUP, ORDER } from '@/admin/i18n'
import { PROJECT_CATEGORIES } from '@/blocks/Projects/categories'
import { logCollectionChange, logCollectionDelete } from '@/hooks/logActivity'
import { revalidateHomeCollection } from '@/hooks/revalidateHome'

/** "EY Ernst & Young" → "ey-ernst-young" */
const slugify = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * Delivered projects — "Nos réalisations".
 *
 * A collection because there are many, they are added over time, and each will
 * eventually get its own page. The homepage carousel is a query against this,
 * so publishing a project puts it on the site without anyone editing a list.
 */
export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    singular: { fr: 'Réalisation', en: 'Project' },
    plural: { fr: 'Réalisations', en: 'Projects' },
  },
  access: {
    read: () => true,
    create: canEdit('projects'),
    update: canEdit('projects'),
    readVersions: canEdit('projects'),
    // Deleting takes the version history with it — the one action the panel
    // cannot undo.
    delete: adminOnly,
  },
  admin: {
    group: GROUP.content,
    hidden: hideUnless('projects'),
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'city', 'featured', 'order'],
    description: {
      fr: 'Visible sur : la page Nos projets (toutes), et le carrousel de la page d’accueil (uniquement celles cochées « Afficher sur la page d’accueil »).',
      en: 'Visible on: the Nos projets page (all of them), and the homepage carousel (only those ticked “Show on the homepage”).',
    },
  },
  hooks: {
    afterChange: [revalidateHomeCollection, logCollectionChange],
    afterDelete: [logCollectionDelete],
  },
  versions: {
    drafts: true,
    maxPerDoc: 20,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: { fr: 'Titre', en: 'Title' },
      admin: { placeholder: 'EY Ernst & Young' },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      label: { fr: 'Identifiant URL', en: 'URL slug' },
      admin: {
        position: 'sidebar',
        description: {
          fr: 'Rempli automatiquement à partir du titre si vous le laissez vide. Sert à l’adresse de la page du projet.',
          en: 'Filled in from the title if you leave it empty. Used for the project page’s address.',
        },
      },
      hooks: {
        // Derived on save so every project has a stable URL from day one, even
        // though the detail page does not exist yet. Backfilling slugs onto
        // published documents later is the expensive version of this.
        beforeValidate: [
          ({ value, data }) => value || (data?.title ? slugify(data.title) : undefined),
        ],
      },
    },
    {
      name: 'category',
      type: 'select',
      label: { fr: 'Catégorie', en: 'Category' },
      // Option labels stay French in both languages: they are the filter buttons
      // on the public site, so they are content, not admin text.
      options: PROJECT_CATEGORIES.map(({ value, label }) => ({ value, label })),
      admin: {
        description: {
          fr: 'Détermine les boutons de filtre de la page Nos projets. Un projet sans catégorie apparaît quand même dans « Tous les projets », mais aucun filtre ne le trouvera.',
          en: 'Drives the filter buttons on the Nos projets page. A project without a category still appears under « Tous les projets », but no filter will find it.',
        },
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'sector',
          type: 'text',
          label: { fr: 'Secteur', en: 'Sector' },
          admin: {
            width: '50%',
            placeholder: 'Multinationale',
            description: {
              fr: 'La ligne affichée sur la carte, avec vos propres mots. Ce n’est pas le filtre.',
              en: 'The line shown on the card, in your own words. Not the filter.',
            },
          },
        },
        {
          name: 'city',
          type: 'text',
          label: { fr: 'Ville', en: 'City' },
          admin: { width: '50%', placeholder: 'Tunis' },
        },
      ],
    },
    {
      name: 'summary',
      type: 'textarea',
      label: { fr: 'Résumé', en: 'Summary' },
      admin: {
        description: {
          fr: 'Une ou deux lignes, affichées sous le titre sur la carte.',
          en: 'One or two lines, shown under the title on the card.',
        },
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Photo',
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      label: { fr: 'Métiers', en: 'Services' },
      admin: {
        description: {
          fr: 'Affichés en étiquettes sur la carte. Choisis dans la liste des Métiers pour que les noms restent toujours identiques.',
          en: 'Shown as tags on the card. Picked from the Services list so the names always match.',
        },
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: { fr: 'Afficher sur la page d’accueil', en: 'Show on the homepage' },
      admin: {
        position: 'sidebar',
        description: {
          fr: 'Seules les réalisations cochées apparaissent dans le carrousel de la page d’accueil.',
          en: 'Only ticked projects appear in the homepage carousel.',
        },
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: ORDER.label,
      admin: {
        position: 'sidebar',
        description: ORDER.description,
      },
    },
  ],
}
