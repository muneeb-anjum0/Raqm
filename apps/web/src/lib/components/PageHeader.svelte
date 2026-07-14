<script lang="ts">
	let {
		eyebrow = 'Private preparation',
		title,
		description
	} = $props<{
		eyebrow?: string;
		title: string;
		description: string;
	}>();
</script>

<div class="mb-5">
	<p class="mb-2 text-sm font-extrabold uppercase tracking-[0.12em] text-raqm-secondary">{eyebrow}</p>
	<h1 class="text-3xl font-black text-raqm-text md:text-4xl">{title}</h1>
	<p class="mt-2 max-w-3xl text-raqm-muted">{description}</p>
</div>
