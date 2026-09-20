import { Settings } from '@lucide/svelte';
import { defineType } from '@aphexcms/cms-core';

/**
 * A singleton: exactly one of these exists per organization, so the admin skips
 * the list and opens the editor directly — no create, no delete. `singleton: true`
 * is the whole difference; everything else is an ordinary document type.
 *
 * Use it for the things a site has one of. Here that's the name in the tab
 * title, the default share description, and a logo.
 */
const siteSettings = defineType({
	type: 'document',
	name: 'siteSettings',
	title: 'Настройки сайта',
	description: 'Название сайта, описание и логотип',
	icon: Settings,
	// Files this under a "Settings" heading in the admin's type list rather than
	// mixing it in with content types.
	group: 'Settings',
	singleton: true,
	groups: [
		{ name: 'general', title: 'Общий', default: true },
		{ name: 'branding', title: 'Брендирование' }
	],
	fields: [
		{
			name: 'title',
			type: 'string',
			title: 'Название сайта',
			description: 'Отображается во вкладке браузера и используется в качестве резервного варианта, если логотип не задан.',
			group: 'general'
		},
		{
			name: 'description',
			type: 'text',
			title: 'Description',
			rows: 3,
			description: "Мета-описание по умолчанию, используемое на страницах, которые не задают собственное описание.",
			group: 'general'
		},
		{
			name: 'logo',
			type: 'image',
			title: 'Логотип',
			description:
				'Заменяет название сайта в шапке сайта. Используйте одноцветный SVG (или прозрачный PNG) с темными метками: на некоторых страницах шапка сайта располагается поверх главного изображения и переворачивает логотип на белый цвет, что работает только с монохромным логотипом с прозрачным фоном.',
			group: 'branding'
		},
		{
			name: 'favicon',
			type: 'image',
			title: 'Favicon',
			description:
				'Значок вкладки браузера для общедоступного сайта и административной панели. Квадратный PNG или SVG-файл размером 32 пикселя или больше.',
			group: 'branding'
		},
		{
			// `layout: 'slider'` swaps the number input for a drag slider — the right
			// control when the useful range is small and the feedback is visual.
			name: 'logoHeight',
			type: 'number',
			title: 'Высота логотипа',
			description: 'Высота логотипа в заголовке в пикселях. Ширина соответствует соотношению сторон.',
			group: 'branding',
			min: 16,
			max: 80,
			step: 2,
			initialValue: 40,
			options: { layout: 'slider' }
		}
	]
});

export default siteSettings;
