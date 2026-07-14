<script lang="ts">
	import { Lock } from '@lucide/svelte';
</script>

<div class="card grid gap-4 p-6 text-center">
	<div class="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-raqm-background text-raqm-secondary">
		<Lock size={24} />
	</div>
	<div>
		<h2 class="text-xl font-black">Unlock your local vault</h2>
		<p class="mt-2 text-raqm-muted">
			Financial data is encrypted in this browser. Unlock before opening protected preparation pages.
		</p>
	</div>
	<a class="btn btn-primary mx-auto" href="/app/vault">Open vault</a>
</div>
