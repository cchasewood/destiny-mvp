const fetch = require('node-fetch')
const keychain = require('../ignore/APIKEYS.js');

module.exports = {
  buildGuardian: (displayName, callback) => {
  	let guardian = {
      displayName: displayName,
      membershipType: -1,
      membershipId: null,
      characterId: null,
      level: 0,
      light: 0,
      emblemPath:null,
      emblemBackgroundPath: null
  };
    fetch(`https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/-1/${displayName}/`, {
    	headers: {
    	  'X-API-Key': keychain.BUNGIE_API_KEY 
    	}
      }).then(res => res.json())
      .then(data => {
      	guardian.membershipId = data.Response[0].membershipId;
      	guardian.membershipType = data.Response[0].membershipType;
      	fetch(`https://www.bungie.net/Platform/Destiny2/${guardian.membershipType}/Profile/${guardian.membershipId}/?components=100`, {
      	  headers: {
    	    'X-API-Key': keychain.BUNGIE_API_KEY 
    	  }
      	}).then(res => res.json())
      	  .then(data => {
      	  	guardian.characterId = data.Response.profile.data.characterIds[0];
      	  	fetch(`https://www.bungie.net/Platform/Destiny2/${guardian.membershipType}/Profile/${guardian.membershipId}/Character/${guardian.characterId}/?components=200`, {
      	      headers: {
    	        'X-API-Key': keychain.BUNGIE_API_KEY 
    	      }
      	    }).then(res => res.json())
      	      .then(data => {
      	      	guardian.light = data.Response.character.data.light;
      	      	guardian.level = data.Response.character.data.levelProgression.level
      	      	guardian.emblemPath = data.Response.character.data.emblemPath;
      	      	guardian.emblemBackgroundPath = data.Response.character.data.emblemBackgroundPath;
      	      	callback(guardian)
      	      })
      	  });
      })
  }
}
