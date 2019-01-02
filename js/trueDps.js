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
	}
};

var weaponInfo = [];

// This key is generated and whitelisted only for this website (https://victhebeast.github.io/Fortnite-STW-Calculator/). No use in stealing it, it won't work anywhere else
$.getJSON('https://sheets.googleapis.com/v4/spreadsheets/1iWt-LgADVmRdQnS9OomDFqjqXQT7wyyPA1unctnaPHM/values/Ranged?key=AIzaSyAN6zwwPn17G4Sr7NOs_j4Jo8GgZ7wPHHI' , function(jsonData) {
     if (jsonData && ('values' in jsonData)) {
          for(var i = 3; i < jsonData.values.length; i++) {
               weaponInfo.push({
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
          $("#loading").remove();
          $("main").append('<div id="newWeapon" onClick="weaponAdd()"><i class="material-icons md-48">add_circle_outline</i></div>');
          
          // Load from url
          loadExisting();
     } else {
          $("main").append('<p id="error">Error loading from Whitesushi spreadsheet</p>');
     }
});

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
     
     var weaponOptionString = '';
     weaponInfo.forEach(function(weapon) {
          weaponOptionString += '<option value="' + weapon.name + '">' + weapon.name + '</option>';
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
     
     $("#newWeapon").before('<div class="weapon w' + newWeapon + '"><header><select class="weaponPick w' + newWeapon + '" onchange="weaponChange(' + newWeapon + ')">' + weaponOptionString + '</select><div class="delete" onClick="weaponRemove(' + newWeapon + ')"><i class="material-icons md-24">delete_sweep</i></div></header><div class="variations w' + newWeapon + '"><div class="variation w' + newWeapon + ' v1"><header><span>Variation 1</span><div class="delete" onClick="variationRemove(' + newWeapon + ', 1)"><i class="material-icons md-24">delete_forever</i></div></header><div class="perks w' + newWeapon + ' v1"><div class="perkRow w' + newWeapon + ' v1 p1"><select class="perkType w' + newWeapon + ' v1 p1" onChange="perkTypeChange(' + newWeapon + ', 1, 1)">' + perkTypeOptionString + '</select><select class="perkValue w' + newWeapon + ' v1 p1" onChange="perkValueChange(' + newWeapon + ', 1, 1)">' + perkValueOptionString + '</select><div class="delete" onClick="perkRemove(' + newWeapon + ',1,1)"><i class="material-icons md-24">delete</i></div></div><div class="newPerk w' + newWeapon + ' v1" onClick="perkAdd(' + newWeapon + ', 1)"><i class="material-icons md-24">add_circle_outline</i></div></div></div><div class="newVariation w' + newWeapon + '" onClick="variationAdd(' + newWeapon + ')"><i class="material-icons md-24">add_circle_outline</i></div></div><div class="results w' + newWeapon + '"><div class="result w' + newWeapon + ' v1"><header><span>Variation 1</span></header><div class="stats"><div class="statRow"><span class="w' + newWeapon + ' v1 value dmgShot"></span><span class="statName"> Dmg/shot</span></div><div class="statRow"><span class="w' + newWeapon + ' v1 value dmgSec"></span><span class="statName"> Dmg/sec</span></div><div class="statRow"><span class="w' + newWeapon + ' v1 value dur"></span><span class="statName"> Durability</span></div><div class="statRow"><span class="w' + newWeapon + ' v1 value effDmg"></span><span class="statName"> Effective Dmg</span></div></div></div></div>');
     
     if (weaponNumber != undefined && weaponName != undefined) {
          $('.weaponPick.w' + weaponNumber).val(weaponName);
     }
     
     updateParameter('w' + newWeapon, $('.weaponPick.w' + newWeapon).val());
     updateParameter('w' + newWeapon + 'v1p1', $('.perkType.w' + newWeapon + '.v1.p1').val() + '.' + $('.perkValue.w' + newWeapon + '.v1.p1').val());
     weaponChange(newWeapon);
}
function weaponChange(weapon) {
     // Remove old rarity classes
     $('.weaponPick.w' + weapon).removeClass('common');
     $('.weaponPick.w' + weapon).removeClass('uncommon');
     $('.weaponPick.w' + weapon).removeClass('rare');
     $('.weaponPick.w' + weapon).removeClass('epic');
     $('.weaponPick.w' + weapon).removeClass('legendary');
     
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
     $('.results.w' + weapon)).append('<div class="result w' + weapon + ' v' + newVariation + '"><header><span>Variation ' + newVariation + '</span></header><div class="stats"><div class="statRow"><span class="w' + weapon + ' v' + newVariation + ' value dmgShot"></span><span class="statName"> Dmg/shot</span></div><div class="statRow"><span class="w' + weapon + ' v' + newVariation + ' value dmgSec"></span><span class="statName"> Dmg/sec</span></div><div class="statRow"><span class="w' + weapon + ' v' + newVariation + ' value dur"></span><span class="statName"> Durability</span></div><div class="statRow"><span class="w' + weapon + ' v' + newVariation + ' value effDmg"></span><span class=""> Effective Dmg</span></div></div></div>');
     
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