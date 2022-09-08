function searchAutorun () {
	const headerSearch = document.getElementById('header-search');
	const notFoundSearch = document.getElementById('not-found-search');
	headerSearch.style = notFoundSearch.style = '';
	headerSearch.onclick = notFoundSearch.onclick = () => {
		const headerContent = document.getElementById('header-content');
		headerContent.setAttribute('search', true);
		const overlay = document.getElementById('search-overlay');
		overlay.setAttribute('search', true);
		overlay.onclick = () => {
			headerContent.removeAttribute('search');
			overlay.removeAttribute('search');
		};
		document.getElementById('search-submit').onclick = e => {
			e.stopPropagation();
		};
		const input = document.getElementById('search-input');
		input.onclick = e => {
			e.stopPropagation();
		};
		input.value = '';
		input.focus();
		input.oninvalid = () => { shake(input); };
		document.getElementById('search-form').onsubmit = e => {
			e.preventDefault();
			return false;
		};
		return false;
	};
}