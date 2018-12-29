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
     $("#newWeapon").before('');
}

function addPerk(weapon, variation) {
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
     counter[weapon][variation] += 1;
     $('.newPerk.w' + weapon + '.v' + variation).before('<div class="perkRow w' + weapon + ' v' + variation + ' p' + counter[weapon][variation] + '"><select class="perkType w' + weapon + ' v' + variation + ' p' + counter[weapon][variation] + '" onchange="perkTypeChanged(' + weapon + ', ' + variation + ', ' + counter[weapon][variation] + ')"> ' + perkTypeOptionString + ' </select><select class="perkValue w' + weapon + ' v' + variation + ' p' + counter[weapon][variation] + '" onchange="perkValueChanged(' + weapon + ', ' + variation + ', ' + counter[weapon][variation] + ')">' + perkValueOptionString + '</select></div>');
     updateParameter('w' + weapon + '.v' + variation + '.p' + counter[weapon][variation], $('.perkType.w' + weapon + '.v' + variation + '.p' + counter[weapon][variation]).val() + '.' + perks[$('.perkType.w' + weapon + '.v' + variation + '.p' + counter[weapon][variation]).val()].values[$('.perkValue.w' + weapon + '.v' + variation + '.p' + counter[weapon][variation]).val()]);
}

function addVariation() {
     $("").append();
}

function perkTypeChanged(weapon, variation, perk) {
     $('.perkValue.w' + weapon + '.v' + variation + '.p' + perk).empty();
     var y;
     for(y in perks.damage.values) {
          $('.perkValue.w' + weapon + '.v' + variation + '.p' + perk).append('<option value="' + y + '">' + perks[$('.perkType.w' + weapon + '.v' + variation + '.p' + perk).val()].values[y] + '</option>');
     }
     updateParameter('w' + weapon + '.v' + variation + '.p' + perk, $('.perkType.w' + weapon + '.v' + variation + '.p' + perk).val() + '.' + perks[$('.perkType.w' + weapon + '.v' + variation + '.p' + perk).val()].values[$('.perkValue.w' + weapon + '.v' + variation + '.p' + perk).val()]);
     recalculate(weapon, variation);
}

function perkValueChanged(weapon, variation, perk) {
     updateParameter('w' + weapon + '.v' + variation + '.p' + perk, $('.perkType.w' + weapon + '.v' + variation + '.p' + perk).val() + '.' + perks[$('.perkType.w' + weapon + '.v' + variation + '.p' + perk).val()].values[$('.perkValue.w' + weapon + '.v' + variation + '.p' + perk).val()]);
     recalculate(weapon, variation);
}

function recalculate(weapon, variation, headshot = 50, level = 130, crystal = true, offense = 1000) {
     $('.perkType.w' + weapon + '.v' + variation).each(function(index, element) {
          console.log($('.perkType.w' + weapon + '.v' + variation + '.p' + (index + 1)).val() + ' is ' + perks[$('.perkType.w' + weapon + '.v' + variation + '.p' + (index + 1)).val()].values[$('.perkValue.w' + weapon + '.v' + variation + '.p' + (index + 1)).val()]);
     });
     weaponInfo.forEach(function(weapon) {
          if (weapon.name == $('.weaponPick.w' + weapon).val()) {
               var s31 = (weapon.dmg * Math.max(1+(Math.ceil(level/10)-1)*0.2, 1) * (1+(Math.floor(Math.max(130, 1))-1) * 0.05) * (1+ crystal ? 0.2 : 0) * (1+offense/100) * 100);
               $('.statRow.dmgShot.w' + weapon + '.v' + variation).text(s31*(1+));
          }
     });
     // =S31*(1+S55) * (1+MIN((S32 + ROUND((3*S56/100)/(4*S56/100+2),2)),1) * (S33+S57) + ((1+S37)*(1+S61)-1)*C35) * (1+(S47*S48)) * C36
}