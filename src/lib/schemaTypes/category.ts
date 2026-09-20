import { defineType } from '@aphexcms/cms-core';
import { Tags } from '@lucide/svelte';

/**
 * Category — the one taxonomy in this template.
 *
 * Deliberately two fields. It exists so posts can be grouped and the archive
 * block can be narrowed; anything richer belongs on the post itself.
 */
export const category = defineType({
	type: 'document',
	name: 'category',
	title: 'Category1',
	description: 'Метки для статей',
	icon: Tags,
	preview: { select: { title: 'title', subtitle: 'slug' } },
	fields: [
		{
			name: 'title',
			type: 'string',
			title: 'Заголовок',
			validation: (Rule) => Rule.required()
		},
		{
			name: 'slug',
			type: 'slug',
			title: 'УРЛ',
			source: 'title',
			validation: (Rule) => Rule.required()
		}
	]
});

export default category;
