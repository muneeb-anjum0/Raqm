<script>
	let {
		items = [],
		active = 0,
		onSelect = () => {},
		accentColor = '#1B3A5C',
		textColor = '#5F6B76',
		markerColor = '#D8DEE6'
	} = $props();
</script>

<nav
	class="line-sidebar"
	style={`--accent-color: ${accentColor}; --text-color: ${textColor}; --marker-color: ${markerColor};`}
	aria-label="Preparation sections"
>
	<ul class="line-sidebar__list">
		{#each items as item, index}
			<li>
				<button
					class:active={active === index}
					class="line-sidebar__item"
					type="button"
					aria-current={active === index ? 'step' : undefined}
					onclick={() => onSelect(index, item)}
				>
					<span class="line-sidebar__marker" aria-hidden="true"></span>
					<span class="line-sidebar__label">
						<span class="line-sidebar__index">{String(index + 1).padStart(2, '0')}</span>
						<span>{item.label}</span>
					</span>
				</button>
			</li>
		{/each}
	</ul>
</nav>
