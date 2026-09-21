import { defineType } from '@aphexcms/cms-core';
import { searchableFields } from '@aphexcms/cms-core/schema';
import { Newspaper } from '@lucide/svelte';
import { richTextBlocks } from './objects/blocks.js';

/**
 * Post — a dated article with a body, categories and related reading.
 *
 * Where `page` is assembled from layout blocks, a post is one long rich-text
 * field. The blocks it can contain (banner, code, media) are declared as siblings
 * of `{ type: 'block' }` in `content.of`, which is what makes them appear between
 * paragraphs rather than inside them.
 *
 * Served at `/posts/<slug>`; listed at `/posts`.
 */
const postType = defineType({
	type: 'document',
	name: 'post',
	title: 'Блог',
	description: 'Устаревшая статья',
	icon: Newspaper,
	groups: [
		{ name: 'content', title: 'Содержание', default: true },
		{ name: 'meta', title: 'МЕТА' },
		{ name: 'seo', title: 'SEO' }
	],
	preview: {
		select: {
			title: 'title',
			subtitle: 'excerpt',
			media: 'heroImage'
		}
	},
	previewUrl: (doc) => {
		const slug = doc.slug as string | undefined;
		return slug ? `/posts/${slug}?aphex-preview=1` : null;
	},
	// No `orderings` on `publishedAt`: `orderings` may only name fields the
	// schema itself declares, and `publishedAt` is a document column rather than
	// a field. The public archive still sorts by it — `sort` in a query accepts
	// document columns, `orderings` (an admin-list affordance) does not.
	fields: [
		{
			name: 'title',
			type: 'string',
			title: 'Заголовок',
			group: 'content',
			validation: (Rule) => Rule.required()
		},
		{
			name: 'slug',
			type: 'slug',
			title: 'УРЛ',
			source: 'title',
			group: 'content',
			validation: (Rule) => Rule.required()
		},
		{
			name: 'excerpt',
			type: 'text',
			title: 'Аннотация',
			rows: 2,
			description: 'Одна-две строки. Отображаются на карточках и используются в качестве резервного варианта для SEO.',
			group: 'content'
		},
		{
			name: 'heroImage',
			type: 'image',
			title: 'Главное изображение',
			group: 'content'
		},
		{
			name: 'content',
			type: 'array',
			title: 'Содержание',
			group: 'content',
			of: [
				{
					type: 'block',
					marks: {
						annotations: [
							{
								name: 'link',
								title: 'Link',
								fields: [
									{ name: 'href', type: 'url', title: 'УРЛ' },
									{ name: 'blank', type: 'boolean', title: 'Открыть в новой вкладке' }
								]
							}
						]
					}
				},
				{ type: 'image', title: 'Image' },
				...richTextBlocks
			],
			validation: (Rule) => Rule.required()
		},
		{
			name: 'categories',
			type: 'array',
			title: 'Разделы',
			group: 'meta',
			of: [{ type: 'reference', to: [{ type: 'category' }] }]
		},
		{
			// Hand-picked further reading, rendered under the article. A post can't
			// reference itself in practice because the picker lists other documents,
			// but the renderer filters the current id out anyway — a copied document
			// can carry one.
			name: 'relatedPosts',
			type: 'array',
			title: 'Похожие публикации',
			group: 'meta',
			of: [{ type: 'reference', to: [{ type: 'post' }] }]
		}
		// No `publishedAt` field: Aphex stamps one on the document when it's first
		// published (`_meta.publishedAt`), and `publishedAt` is a reserved column
		// name — a schema that declares one is rejected at startup. The archive sorts
		// on that column directly with `sort: '-publishedAt'`.
	]
});

// `search` is derived from the declared fields, so it can't sit inside the
// `defineType` call that declares them.
export const post = { ...postType, search: searchableFields(postType) };

export default post;
