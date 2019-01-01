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

function deleteParameter(key, checkAll = false) {
     const params = new URLSearchParams(location.search);
     if (checkAll) {
          getAllParameters().forEach(function(parameters) {
               const key1 = parameters[0];
               if (key1.includes(key))
                    params.delete(key1);
          });
     } else {
          params.delete(key1);
     }
     
     window.history.replaceState({}, '', `${location.pathname}?${params}`);
}