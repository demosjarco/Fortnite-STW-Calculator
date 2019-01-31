const perks = {
	damage: {
		name: 'Damage',
		values: {
			c: 10,
			u: 15,
			r: 20,
			e: 25,
			l: 30
		}
	},
	critRate: {
		name: 'Critical Rating',
		values: {
			c: 10,
			u: 15,
			r: 20,
			e: 25,
			l: 30
		}
	},
	critDmg: {
		name: 'Crit Damage',
		values: {
			c: 45,
			u: 67.5,
			r: 90,
			e: 112.5,
			l: 135
		}
	},
	fireRate: {
		name: 'Fire Rate',
		values: {
			c: 14,
			u: 21,
			r: 28,
			e: 35,
			l: 42
		}
	},
	magSize: {
		name: 'Magazine Size',
		values: {
			c: 25,
			u: 37.5,
			r: 50,
			e: 62.5,
			l: 75
		}
	},
	reload: {
		name: 'Reload Speed',
		values: {
			c: 25,
			u: 37.5,
			r: 50,
			e: 62.5,
			l: 75
		}
	},
	headshotMs: {
		name: 'Headshot Multiplier',
		values: {
			c: 13.3,
			u: 20,
			r: 26.7,
			e: 33.4,
			l: 40
		}
	},
	durability: {
		name: 'Durability',
		values: {
			c: 14,
			u: 21,
			r: 28,
			e: 35,
			l: 42
		}
	},
     energy: {
		name: 'Element Energy & Damage',
		values: {
			c: 0,
			u: 5,
			r: 10,
			e: 15,
			l: 20
		}
	},
     fire: {
		name: 'Element Fire & Damage',
		values: {
			c: 0,
			u: 5,
			r: 10,
			e: 15,
			l: 20
		}
	},
     water: {
		name: 'Element Water & Damage',
		values: {
			c: 0,
			u: 5,
			r: 10,
			e: 15,
			l: 20
		}
	},
     nature: {
		name: 'Element Nature & Damage',
		values: {
			c: 0,
			u: 5,
			r: 10,
			e: 15,
			l: 20
		}
	},
     physical: {
		name: 'Element Physical & Damage',
		values: {
			c: 20,
			u: 26,
			r: 32,
			e: 38,
			l: 44
		}
	}
};

var weaponInfo = [];

$(document).ready(function() { 
	if (typeof(Storage) !== "undefined") {
		var maxAge = new Date();
		maxAge.setDate(maxAge.getDate()-2);
		
		let needToLoadRanged = true;
		let needToLoadMelee = true;
		
		if (localStorage.getItem("rangedStats") !== null && localStorage.getItem("rangedStatsDate") !== null && new Date(localStorage.getItem("rangedStatsDate")) > maxAge) {
			needToLoadRanged = false;
			weaponInfo = weaponInfo.concat(JSON.parse(localStorage.getItem("rangedStats")));
		}
		if (localStorage.getItem("meleeStats") !== null && localStorage.getItem("meleeStatsDate") !== null && new Date(localStorage.getItem("meleeStatsDate")) > maxAge) {
			needToLoadMelee = false;
		}
		
		loadFromSheets('AIzaSyAN6zwwPn17G4Sr7NOs_j4Jo8GgZ7wPHHI', needToLoadRanged, needToLoadMelee);
	} else {
		console.warn('Local storage not supported or disabled for this site. Will run off live copy from API. This may cause problems due to low rate limits.');
		// This key is generated and whitelisted only for this website (https://victhebeast.github.io/Fortnite-STW-Calculator/). No use in stealing it, it won't work anywhere else
		loadFromSheets('AIzaSyAN6zwwPn17G4Sr7NOs_j4Jo8GgZ7wPHHI');
	}
});

function cacheJson(key, array = []) {
	if (typeof(Storage) !== "undefined") {
		localStorage.setItem(key, array);
		localStorage.setItem(key + 'Date', new Date());
	}
}

function loadFromSheets(key, ranged = true, melee = true) {
	let rangedDone = false;
	if (!ranged)
		rangedDone = true;
	let meleeDone = false;
	if (!melee)
		meleeDone = true;
	
	if (ranged) {
		loadRanged(key, function(success) {
			rangedDone = true;
			checkIfDone(success);
		});
	}
	if (melee) {
		// Temp
		meleeDone = true;
		checkIfDone(true);
	}
	
	function checkIfDone(success = true) {
		if (!success) {
			beginUI(success);
		} else if (rangedDone && meleeDone) {
			weaponInfo.sort(function(a, b) {
				return a.name.localeCompare(b.name);
			});
			
			beginUI(success);
		}
	}
	if (!ranged && !melee) {
		beginUI();
	}
}

function loadRanged(key, callback) {
	$.getJSON('https://sheets.googleapis.com/v4/spreadsheets/1iWt-LgADVmRdQnS9OomDFqjqXQT7wyyPA1unctnaPHM/values/Ranged?key=' + key, function(jsonData) {
		if (jsonData && ('values' in jsonData)) {
			let tempWeaponArray = [];
			for(var i = 3; i < jsonData.values.length; i++) {
				tempWeaponArray.push({
					name: jsonData.values[i][1],
					rarity: jsonData.values[i][2].toLowerCase(),
					dmg: jsonData.values[i][4],
					chc: jsonData.values[i][7],
					chd: jsonData.values[i][8],
					fireRate: jsonData.values[i][10],
					magSize: jsonData.values[i][11],
					reload: jsonData.values[i][14],
					hs: jsonData.values[i][9],
					ammo: jsonData.values[i][15],
				});
			}
			tempWeaponArray.sort(function(a, b) {
				return a.name.localeCompare(b.name);
			});
			
			cacheJson('rangedStats', JSON.stringify(tempWeaponArray));
			weaponInfo = weaponInfo.concat(tempWeaponArray);
			
			callback(true);
		} else {
			callback(false);
		}
	});
}

function beginUI(success = true) {
	if (success) {
		$("#loading").remove();
		$("main").append('<div id="newWeapon" onClick="weaponAdd()"><i class="material-icons md-48">add_circle_outline</i></div>');
		
		// Load from url
		loadExisting();
	} else {
		$("main").append('<p id="error">Error loading from Whitesushi spreadsheet</p>');
	}
}

var counter = {};

function loadExisting() {
     const weaponKey = /^w{1}\d+$/;
     const perkKey = /^w{1}\d+v{1}\d+p{1}\d+$/;
     
     const perkType = /^[^.]+/;
     const perkValue = /[^.]+$/;
     
     const weaponNumber = /(?<=w)\d+/;
     const variationNumber = /(?<=v)\d+/;
     const perkNumber = /(?<=p)\d+/;
     getAllParameters().forEach(function(parameter) {
          if (weaponKey.test(parameter[0])) {
               weaponAdd(weaponNumber.exec(parameter[0]), parameter[1]);
          } else if (perkKey.test(parameter[0])) {
               if ($('.perkType.w' + weaponNumber.exec(parameter[0]) + '.v' + variationNumber.exec(parameter[0]) + '.p' + perkNumber.exec(parameter[0])).length) {
                    $('.perkType.w' + weaponNumber.exec(parameter[0]) + '.v' + variationNumber.exec(parameter[0]) + '.p' + perkNumber.exec(parameter[0])).val(perkType.exec(parameter[1]));
               } else {
                    // Perk doesn't exist
                    if ($('.variation.w' + weaponNumber.exec(parameter[0]) + '.v' + variationNumber.exec(parameter[0])).length) {
                         // Variation exists but not perk
                         // Create new perk
                         perkAdd(weaponNumber.exec(parameter[0]), variationNumber.exec(parameter[0]));
                         // Set perk type
                         $('.perkType.w' + weaponNumber.exec(parameter[0]) + '.v' + variationNumber.exec(parameter[0]) + '.p' + perkNumber.exec(parameter[0])).val(perkType.exec(parameter[1]));
                         // Update perk values
                         $('.perkValue.w' + weaponNumber.exec(parameter[0]) + '.v' + variationNumber.exec(parameter[0]) + '.p' + perkNumber.exec(parameter[0])).empty();
                         var y;
                         for(y in perks.damage.values) {
                              $('.perkValue.w' + weaponNumber.exec(parameter[0]) + '.v' + variationNumber.exec(parameter[0]) + '.p' + perkNumber.exec(parameter[0])).append('<option value="' + y + '">' + perks[$('.perkType.w' + weaponNumber.exec(parameter[0]) + '.v' + variationNumber.exec(parameter[0]) + '.p' + perkNumber.exec(parameter[0])).val()].values[y] + '</option>');
                         }
                    } else {
                         // Variation doesn't exist
                         variationAdd(weaponNumber.exec(parameter[0]));
                         $('.perkType.w' + weaponNumber.exec(parameter[0]) + '.v' + variationNumber.exec(parameter[0]) + '.p' + perkNumber.exec(parameter[0])).val(perkType.exec(parameter[1]));
                         // Update perk values
                         $('.perkValue.w' + weaponNumber.exec(parameter[0]) + '.v' + variationNumber.exec(parameter[0]) + '.p' + perkNumber.exec(parameter[0])).empty();
                         var y;
                         for(y in perks.damage.values) {
                              $('.perkValue.w' + weaponNumber.exec(parameter[0]) + '.v' + variationNumber.exec(parameter[0]) + '.p' + perkNumber.exec(parameter[0])).append('<option value="' + y + '">' + perks[$('.perkType.w' + weaponNumber.exec(parameter[0]) + '.v' + variationNumber.exec(parameter[0]) + '.p' + perkNumber.exec(parameter[0])).val()].values[y] + '</option>');
                         }
                    }
               }
               if ($('.perkValue.w' + weaponNumber.exec(parameter[0]) + '.v' + variationNumber.exec(parameter[0]) + '.p' + perkNumber.exec(parameter[0])).length) {
                    $('.perkValue.w' + weaponNumber.exec(parameter[0]) + '.v' + variationNumber.exec(parameter[0]) + '.p' + perkNumber.exec(parameter[0])).val(perkValue.exec(parameter[1]));
               }
               updateParameter('w' + weaponNumber.exec(parameter[0]) + 'v' + variationNumber.exec(parameter[0]) + 'p' + perkNumber.exec(parameter[0]), $('.perkType.w' + weaponNumber.exec(parameter[0]) + '.v' + variationNumber.exec(parameter[0]) + '.p' + perkNumber.exec(parameter[0])).val() + '.' + $('.perkValue.w' + weaponNumber.exec(parameter[0]) + '.v' + variationNumber.exec(parameter[0]) + '.p' + perkNumber.exec(parameter[0])).val());
          }
     });
}

function weaponAdd(weaponNumber, weaponName) {
	var newWeapon = 1;
	
	if (weaponNumber == undefined) {
		if (Object.keys(counter).length > 0) {
			const biggestLastWeapon = parseInt(Object.keys(counter)[Object.keys(counter).length - 1]);
			newWeapon = biggestLastWeapon + 1;
		}
	} else {
		newWeapon = weaponNumber;
	}
	counter[newWeapon] = {1: {1: null}};
	
	let weaponList = [];
	weaponInfo.forEach(function(weapon) {
		weaponList.push(weapon.name);
	});
	var x;
	var perkTypeOptionString = '';
	for(x in perks) {
		perkTypeOptionString += '<option value="' + x + '">' + perks[x].name + '</option>';
	}
	var y;
	var perkValueOptionString = '';
	for(y in perks.damage.values) {
		perkValueOptionString += '<option value="' + y + '">' + Object.values(perks)[0].values[y] + '</option>';
	}
	
	$("#newWeapon").before('<div class="weapon w' + newWeapon + '"><header><div class="autocomplete w' + newWeapon + '"><input id="weapPickW' + newWeapon + '" class="weaponPick w' + newWeapon + '" type="text" autocomplete="off" placeholder="Weapon" oninput="weaponChange(' + newWeapon + ')" onchange="weaponChange(' + newWeapon + ')" /></div><div class="delete" onClick="weaponRemove(' + newWeapon + ')"><i class="material-icons md-24">delete_sweep</i></div></header><div class="variations w' + newWeapon + '"><div class="variation w' + newWeapon + ' v1"><header><span>Variation 1</span><div class="delete" onClick="variationRemove(' + newWeapon + ', 1)"><i class="material-icons md-24">delete_forever</i></div></header><div class="perks w' + newWeapon + ' v1"><div class="perkRow w' + newWeapon + ' v1 p1"><select class="perkType w' + newWeapon + ' v1 p1" onChange="perkTypeChange(' + newWeapon + ', 1, 1)">' + perkTypeOptionString + '</select><select class="perkValue w' + newWeapon + ' v1 p1" onChange="perkValueChange(' + newWeapon + ', 1, 1)">' + perkValueOptionString + '</select><div class="delete" onClick="perkRemove(' + newWeapon + ',1,1)"><i class="material-icons md-24">delete</i></div></div><div class="newPerk w' + newWeapon + ' v1" onClick="perkAdd(' + newWeapon + ', 1)"><i class="material-icons md-24">add_circle_outline</i></div></div></div><div class="newVariation w' + newWeapon + '" onClick="variationAdd(' + newWeapon + ')"><i class="material-icons md-24">add_circle_outline</i></div></div><div class="results w' + newWeapon + '"><div class="result w' + newWeapon + ' v1"><header><span>Variation 1</span></header><div class="stats"><div class="statRow"><span class="w' + newWeapon + ' v1 value dmgShot"></span><span class="statName"> Dmg/shot</span></div><div class="statRow"><span class="w' + newWeapon + ' v1 value dmgSec"></span><span class="statName"> Dmg/sec</span></div><div class="statRow"><span class="w' + newWeapon + ' v1 value dur"></span><span class="statName"> Durability</span></div><div class="statRow"><span class="w' + newWeapon + ' v1 value effDmg"></span><span class="statName"> Effective Dmg</span></div></div></div></div>');
	
	autocomplete(document.getElementById('weapPickW' + newWeapon), weaponList);
	
	if (weaponNumber != undefined && weaponName != undefined) {
		$('.weaponPick.w' + weaponNumber).val(weaponName);
	}
	
	updateParameter('w' + newWeapon, $('.weaponPick.w' + newWeapon).val());
	updateParameter('w' + newWeapon + 'v1p1', $('.perkType.w' + newWeapon + '.v1.p1').val() + '.' + $('.perkValue.w' + newWeapon + '.v1.p1').val());
	weaponChange(newWeapon);
}
function weaponChange(weapon) {
     // Remove old rarity classes
     $('.weapon.w' + weapon).removeClass('common');
     $('.weapon.w' + weapon).removeClass('uncommon');
     $('.weapon.w' + weapon).removeClass('rare');
     $('.weapon.w' + weapon).removeClass('epic');
     $('.weapon.w' + weapon).removeClass('legendary');
     
     weaponInfo.forEach(function(weaponInfo) {
          if (weaponInfo.name == $('.weaponPick.w' + weapon).val()) {
               $('.weapon.w' + weapon).addClass(weaponInfo.rarity);
          }
     });
     
     updateParameter('w' + weapon, $('.weaponPick.w' + weapon).val());
}
function weaponRemove(weapon) {
     delete counter[weapon];
     deleteParameter('w' + weapon, true);
     $('.weapon.w' + weapon).remove();
}

function variationAdd(weapon) {
     var newVariation = 1;
     
     if (Object.keys(counter[weapon]).length > 0) {
          const biggestLastVariation = parseInt(Object.keys(counter[weapon])[Object.keys(counter[weapon]).length - 1]);
          newVariation = biggestLastVariation + 1;
     }
     counter[weapon][newVariation] = {1: null};
     
     var x;
     var perkTypeOptionString = '';
     for(x in perks) {
          perkTypeOptionString += '<option value="' + x + '">' + perks[x].name + '</option>';
     }
     var y;
     var perkValueOptionString = '';
     for(y in perks.damage.values) {
          perkValueOptionString += '<option value="' + y + '">' + Object.values(perks)[0].values[y] + '</option>';
     }
     
     $('.newVariation.w' + weapon).before('<div class="variation w' + weapon + ' v' + newVariation + '"><header><span>Variation ' + newVariation + '</span><div class="delete" onclick="variationRemove(' + weapon + ', ' + newVariation + ')"><i class="material-icons md-24">delete_forever</i></div></header><div class="perks w' + weapon + ' v' + newVariation + '"><div class="perkRow w' + weapon + ' v' + newVariation + ' p1"><select class="perkType w' + weapon + ' v' + newVariation + ' p1" onchange="perkTypeChange(' + weapon + ', ' + newVariation + ', 1)">' + perkTypeOptionString + '</select><select class="perkValue w' + weapon + ' v' + newVariation + ' p1" onchange="perkValueChange(' + weapon + ', ' + newVariation + ', 1)">' + perkValueOptionString + '</select><div class="delete" onClick="perkRemove(' + weapon + ',' + newVariation + ',1)"><i class="material-icons md-24">delete</i></div></div><div class="newPerk w' + weapon + ' v' + newVariation + '" onclick="perkAdd(' + weapon + ', ' + newVariation + ')"><i class="material-icons md-24">add_circle_outline</i></div></div></div>');
     $('.results.w' + weapon).append('<div class="result w' + weapon + ' v' + newVariation + '"><header><span>Variation ' + newVariation + '</span></header><div class="stats"><div class="statRow"><span class="w' + weapon + ' v' + newVariation + ' value dmgShot"></span><span class="statName"> Dmg/shot</span></div><div class="statRow"><span class="w' + weapon + ' v' + newVariation + ' value dmgSec"></span><span class="statName"> Dmg/sec</span></div><div class="statRow"><span class="w' + weapon + ' v' + newVariation + ' value dur"></span><span class="statName"> Durability</span></div><div class="statRow"><span class="w' + weapon + ' v' + newVariation + ' value effDmg"></span><span class=""> Effective Dmg</span></div></div></div>');
	
     updateParameter('w' + weapon + 'v' + newVariation + 'p1', $('.perkType.w' + weapon + '.v' + newVariation + '.p1').val() + '.' + $('.perkValue.w' + weapon + '.v' + newVariation + '.p1').val());
}
function variationRemove(weapon, variation) {
     delete counter[weapon][variation];
     deleteParameter('w' + weapon + 'v' + variation, true);
     $('.variation.w' + weapon + '.v' + variation).remove();
     $('.result.w' + weapon + '.v' + variation).remove();
}

function perkAdd(weapon, variation) {
     var x;
     var perkTypeOptionString = '';
     for(x in perks) {
          perkTypeOptionString += '<option value="' + x + '">' + perks[x].name + '</option>';
     }
     var y;
     var perkValueOptionString = '';
     for(y in perks.damage.values) {
          perkValueOptionString += '<option value="' + y + '">' + Object.values(perks)[0].values[y] + '</option>';
     }
     var newPerk = 1;
     if (Object.keys(counter[weapon][variation]).length > 0) {
          newPerk = parseInt(Object.keys(counter[weapon][variation])[Object.keys(counter[weapon][variation]).length - 1]) + 1;
     }
     counter[weapon][variation][newPerk] = null;
     $('.newPerk.w' + weapon + '.v' + variation).before('<div class="perkRow w' + weapon + ' v' + variation + ' p' + newPerk + '"><select class="perkType w' + weapon + ' v' + variation + ' p' + newPerk + '" onchange="perkTypeChange(' + weapon + ', ' + variation + ', ' + newPerk + ')"> ' + perkTypeOptionString + ' </select><select class="perkValue w' + weapon + ' v' + variation + ' p' + newPerk + '" onchange="perkValueChange(' + weapon + ', ' + variation + ', ' + newPerk + ')">' + perkValueOptionString + '</select><div class="delete" onClick="perkRemove(' + weapon + ',' + variation + ',' + newPerk + ')"><i class="material-icons md-24">delete</i></div></div>');
     
     updateParameter('w' + weapon + 'v' + variation + 'p' + newPerk, $('.perkType.w' + weapon + '.v' + variation + '.p' + newPerk).val() + '.' + $('.perkValue.w' + weapon + '.v' + variation + '.p' + newPerk).val());
}
function perkTypeChange(weapon, variation, perk) {
     $('.perkValue.w' + weapon + '.v' + variation + '.p' + perk).empty();
     var y;
     for(y in perks.damage.values) {
          $('.perkValue.w' + weapon + '.v' + variation + '.p' + perk).append('<option value="' + y + '">' + perks[$('.perkType.w' + weapon + '.v' + variation + '.p' + perk).val()].values[y] + '</option>');
     }
     updateParameter('w' + weapon + 'v' + variation + 'p' + perk, $('.perkType.w' + weapon + '.v' + variation + '.p' + perk).val() + '.' + $('.perkValue.w' + weapon + '.v' + variation + '.p' + perk).val());
}
function perkValueChange(weapon, variation, perk) {
     updateParameter('w' + weapon + 'v' + variation + 'p' + perk, $('.perkType.w' + weapon + '.v' + variation + '.p' + perk).val() + '.' + $('.perkValue.w' + weapon + '.v' + variation + '.p' + perk).val());
}
function perkRemove(weapon, variation, perk) {
     delete counter[weapon][variation][perk];
     deleteParameter('w' + weapon + 'v' + variation + 'p' + perk, true);
     $('.perkRow.w' + weapon + '.v' + variation + '.p' + perk).remove();
}

function recalculate() {
	
}

function autocomplete(inp, arr) {
	// the autocomplete function takes two arguments, the text field element and an array of possible autocompleted values:
	var currentFocus;
	// execute a function when someone writes in the text field:
	inp.addEventListener("input", function(e) {
		var a, b, i, val = this.value;
		// close any already open lists of autocompleted values
		closeAllLists();
		if (!val)
			return false;
		currentFocus = -1;
		// create a DIV element that will contain the items (values):
		a = document.createElement("DIV");
		a.setAttribute("id", this.id + "autocomplete-list");
		a.setAttribute("class", "autocomplete-items");
		// append the DIV element as a child of the autocomplete container:
		this.parentNode.appendChild(a);
		// for each item in the array...
		for (i = 0; i < arr.length; i++) {
			/*check if the item starts with the same letters as the text field value:*/
			if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
				/*create a DIV element for each matching element:*/
				b = document.createElement("DIV");
				/*make the matching letters bold:*/
				b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
				b.innerHTML += arr[i].substr(val.length);
				/*insert a input field that will hold the current array item's value:*/
				b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
				/*execute a function when someone clicks on the item value (DIV element):*/
				b.addEventListener("click", function(e) {
					/*insert the value for the autocomplete text field:*/
					inp.value = this.getElementsByTagName("input")[0].value;
					
					const weaponNumber = /(?<=w)\d+/;
					const temp = weaponNumber.exec(inp.className);
					weaponChange(temp);
					
					/*close the list of autocompleted values,
					(or any other open lists of autocompleted values:*/
					closeAllLists();
				});
				a.appendChild(b);
			}
		}
	});
	/*execute a function presses a key on the keyboard:*/
	inp.addEventListener("keydown", function(e) {
		var x = document.getElementById(this.id + "autocomplete-list");
		if (x) x = x.getElementsByTagName("div");
		if (e.keyCode == 40) {
			/*If the arrow DOWN key is pressed,
			increase the currentFocus variable:*/
			currentFocus++;
			/*and and make the current item more visible:*/
			addActive(x);
		} else if (e.keyCode == 38) { //up
			/*If the arrow UP key is pressed,
			decrease the currentFocus variable:*/
			currentFocus--;
			/*and and make the current item more visible:*/
			addActive(x);
		} else if (e.keyCode == 13) {
			/*If the ENTER key is pressed, prevent the form from being submitted,*/
			e.preventDefault();
			if (currentFocus > -1) {
				/*and simulate a click on the "active" item:*/
				if (x) x[currentFocus].click();
			}
		}
	});
	function addActive(x) {
		/*a function to classify an item as "active":*/
		if (!x) return false;
		/*start by removing the "active" class on all items:*/
		removeActive(x);
		if (currentFocus >= x.length) currentFocus = 0;
		if (currentFocus < 0) currentFocus = (x.length - 1);
		/*add class "autocomplete-active":*/
		x[currentFocus].classList.add("autocomplete-active");
	}
	function removeActive(x) {
		/*a function to remove the "active" class from all autocomplete items:*/
		for (var i = 0; i < x.length; i++) {
			x[i].classList.remove("autocomplete-active");
		}
	}
	function closeAllLists(elmnt) {
		/*close all autocomplete lists in the document,
		except the one passed as an argument:*/
		var x = document.getElementsByClassName("autocomplete-items");
		for (var i = 0; i < x.length; i++) {
			if (elmnt != x[i] && elmnt != inp) {
				x[i].parentNode.removeChild(x[i]);
			}
		}
	}
	/*execute a function when someone clicks in the document:*/
	document.addEventListener("click", function (e) {
		closeAllLists(e.target);
	});
}