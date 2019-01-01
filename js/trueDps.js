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
          $("main").append('<div id="newWeapon" onClick="addWeapon()"><i class="material-icons md-48">add_circle_outline</i></div>');
          
          // Load from url
          console.log(getAllParameters());
     } else {
          $("main").append('<p id="error">Error loading from Whitesushi spreadsheet</p>');
     }
});

var counter = {
     1: {
          1: 0
     }
};

function addWeapon() {
     var biggestLastWeapon = 0;
     if (Object.keys(counter).length > 0)
          biggestLastWeapon = Object.keys(counter)[Object.keys(counter).length - 1];
     counter[biggestLastWeapon + 1] = {};
     
     var weaponOptionString = '';
     weaponInfo.forEach(function(weapon) {
          weaponOptionString += '<option value="' + weapon.name + '">' + weapon.name + '</option>';
     });
     
     $("#newWeapon").before('<div class="weapon w' + (biggestLastWeapon + 1) + '"><header><select class="weaponPick w' + (biggestLastWeapon + 1) + '" onchange="weaponChange(' + (biggestLastWeapon + 1) + ')">' + weaponOptionString + '</select><div class="delete" onClick=""><i class="material-icons md-24">delete_sweep</i></div></header><div>');
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
}