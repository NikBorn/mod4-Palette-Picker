
exports.seed = function (knex, Promise) {
  return knex('palettes').del() //delete all footnotes
    .then(() => knex('projects').del()) //delete all papers

    .then(() => {
      return Promise.all([
        knex('projects').insert({
          name: 'example project'
        }, 'id')
          .then(project => {
            return knex('palettes').insert([
              {
                color1: '#DF0B24', 
                color2: '#2AD75D',
                color3: '#516ACD',
                color4: '#E7DE3C',
                color5: '#A151C5',
                project_id: project[0],
                name: 'first palette'
              },
              {
                color1: '#EB40EB',
                color2: '#D4E64A',
                color3: '#565FCA',
                color4: '#149DFF',
                color5: '#81C6F',
                project_id: project[0],
                name: 'second palette'
              }
            ])
          })
          .then(() => console.log('Seeding Complete!'))
          .catch(error => console.log({ error }))
      ])
    })
    .catch(error => console.log({ error }))
};