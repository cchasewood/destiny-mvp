exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable("guardians", table => {
      table.increments('id').primary()
      table.string("displayName")
      table.integer("membershipType")
      table.string("membershipId")
      table.string("characterId")
      table.integer("level")
      table.integer("light")
      table.string("emblemPath")
      table.string("emblemBackgroundPath")
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable("guardians")
  ]);
};
