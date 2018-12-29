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
$.getJSON('https://sheets.googleapis.com/v4/spreadsheets/1iWt-LgADVmRdQnS9OomDFqjqXQT7wyyPA1unctnaPHM/values/Ranged?key=AIzaSyBhDA4fPi9lpOKZN5__QqPXqyqCWdMQAC0' , function(jsonData) {
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
     } else {
          $("main").append('<p id="error">Error loading from Whitesushi spreadsheet</p>');
     }
});