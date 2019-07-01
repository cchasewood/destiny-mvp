const fetch = require('node-fetch')
const keychain = require('../ignore/APIKEYS.js');
const db = require('../database/index.js');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const hashToIndex = val => {
  if((val&Math.pow(2,31))!=0) val = val - Math.pow(2,32);
  return val;
}
module.exports = {
  buildGuardian: (displayName, callback) => {
  	let guardian = {
      displayName: '',
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
        guardian.displayName = data.Response[0].displayName;
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
  },
  buildItems: (displayName, callback) => {
    let itemIds = [];
    database('guardians').where({ displayName: displayName }).limit(1)
      .then(guardian => {
        fetch(`https://www.bungie.net/Platform/Destiny2/${guardian[0].membershipType}/Profile/${guardian[0].membershipId}/Character/${guardian[0].characterId}/?components=205`, {
          headers: {
            'X-API-Key': keychain.BUNGIE_API_KEY 
          }
          }).then(res => res.json())
            .then(data => {
            data.Response.equipment.data.items.map(item => itemIds.push(hashToIndex(item.itemHash)));
            let temp = [];
            itemIds.map((id, i) => db.searchDB(`SELECT json FROM DestinyInventoryItemDefinition WHERE id=${id}`, data => i === itemIds.length-1 ? callback(temp.concat([JSON.parse(data.json)]))  : temp.push(JSON.parse(data.json))))
          })

      })
  }
}
