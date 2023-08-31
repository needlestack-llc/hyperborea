const previewContainer = document.querySelector('#preview');
const previewImage = previewContainer.querySelector('#img');
const previewName = previewContainer.querySelector('#filename');
const previewOpen = previewContainer.querySelector('a');

/**
 * @param {HTMLElement} el
 * @returns {Record<string, string>}
 */
function getData(el) {
	console.log(el.attributes['data-filename']);
	let data = {};
	const attributes = el.getAttributeNames();
	attributes.forEach((a) => {
		data[a.slice('data-'.length)] = el.getAttribute(a);
	});
	console.log(attributes);
	return data;
}

document.querySelector('#filter-input').addEventListener('input', (ev) => {
	document.querySelectorAll('[data-filterable]').forEach((el) => {
		const value = el.getAttribute('data-filterable');
		if (!value.toLocaleLowerCase().includes(ev.target.value)) {
			el.style.display = 'none';
		} else {
			el.style.display = '';
		}
	});
});

document.querySelector('#close-preview').addEventListener('click', () => {
	previewContainer.classList.add('hidden');
	previewName.textContent = '';
	previewImage.src = '';
	document.querySelectorAll('[data-previewing="true"]').forEach((el) => {
		el.removeAttribute('data-previewing');
	});
});

document.querySelectorAll('[data-can-preview="true"]').forEach((el) => {
	el.addEventListener('click', (ev) => {
		ev.bubbles = false;
		ev.preventDefault();
		/** @type {HTMLAnchorElement} */
		const el = ev.currentTarget;
		console.log(el);
		console.log(getData(el));
		const name = el.getAttribute('data-filename');
		const href = el.getAttribute('data-href');
		const size = el.getAttribute('data-size');
		const previewing = el.getAttribute('data-previewing') ? true : false;
		if (!previewing) {
			previewContainer.classList.remove('hidden');
			previewName.textContent = name;
			previewImage.src = `/__static/${href}`;
			previewOpen.href = `/__static/${href}`;
			document
				.querySelectorAll('[data-previewing="true"]')
				.forEach((el) => {
					el.removeAttribute('data-previewing');
				});
			el.setAttribute('data-previewing', true);
		} else {
			document.location.href = `/__static/${href}`;
		}
	});
});
