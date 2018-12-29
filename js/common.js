function getAllParameters() {
     const params = new URLSearchParams(location.search);
     return Array.from(params);
}

function getParameter(key) {
	const params = new URLSearchParams(location.search);
	return params.get(key);
}
	
function updateParameter(key, value) {
	const params = new URLSearchParams(location.search);
	params.set(key, value);
	
	window.history.replaceState({}, '', `${location.pathname}?${params}`);
}

function deleteParameter(key) {
     const params = new URLSearchParams(location.search);
     params.delete(key);
     
     window.history.replaceState({}, '', `${location.pathname}?${params}`);
}