exports.seed = async (knex, Promise) => {
  await knex('guardians').del()
  let data = {
    displayName: 'Timorem_Dei',
    membershipType: 2,
    membershipId: "4611686018463725857",
    characterId: "2305843009278948008",
    level: 50,
    light: 700,
    emblemPath:"/common/destiny2_content/icons/ba8f6b82841b5bb18b1cca71bd9b3edd.jpg",
    emblemBackgroundPath: "/common/destiny2_content/icons/cd789502d269dd2f4f909bb0e7d1cd11.jpg"
  };
  await knex('guardians').insert(data);
};
