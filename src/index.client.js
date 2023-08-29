document.getElementById('filter-input').addEventListener('input', (ev) => {
	[...document.querySelectorAll('[data-filterable]')].forEach((el) => {
		const value = el.getAttribute('data-filterable');
		if (!value.includes(ev.target.value)) {
			el.style.display = 'none';
		} else {
			el.style.display = '';
		}
	});
});
