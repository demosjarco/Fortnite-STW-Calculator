function getParameter(key) {
	const params = new URLSearchParams(location.search);
	return params.get(key);
}
	
function updateParameter(key, value) {
	const params = new URLSearchParams(location.search);
	params.set(key, value);
	
	window.history.replaceState({}, '', `${location.pathname}?${params}`);
}