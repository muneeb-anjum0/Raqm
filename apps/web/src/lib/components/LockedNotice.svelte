<script>
	import { Lock } from '@lucide/svelte';
</script>

<div class="card reveal mx-auto grid max-w-xl gap-4 p-5 text-center">
	<div class="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-raqm-background text-raqm-secondary">
		<Lock size={24} />
	</div>
	<div>
		<h2 class="text-lg font-bold">Unlock your local vault</h2>
		<p class="mt-2 text-sm leading-6 text-raqm-muted">
			Financial data is encrypted in this browser. Unlock before opening protected preparation pages.
		</p>
	</div>
	<a class="btn btn-primary mx-auto" href="/app/vault">Open vault</a>
</div>
