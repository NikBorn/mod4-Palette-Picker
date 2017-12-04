exports.seed = function (knex, Promise) {
  return knex('palettes').del() //delete all footnotes
    .then(() => knex('projects').del()) //delete all papers
  /* eslint-disable no-console */
    .then(() => {
      return Promise.all([
        knex('projects').insert([
          { id: 1, name: 'turing' },
          { id: 2, name: 'personal' },
          { id: 3, name: 'others' }
        ])
          .then(() => {
            return knex('palettes').insert([
              {
                color1: '#DF0B24',
                color2: '#2AD75D',
                color3: '#516ACD',
                color4: '#E7DE3C',
                color5: '#A151C5',
                project_id: 1,
                name: 'first palette',
                id: 1
              },
              {
                color1: '#EB40EB',
                color2: '#D4E64A',
                color3: '#565FCA',
                color4: '#149DFF',
                color5: '#81C6F',
                project_id: 1,
                name: 'second palette',
                id: 2
              },
              {
                color1: '#83E3FC',
                color2: '#C5FCF0',
                color3: '#2F3076',
                color4: '#DB81DE',
                color5: '#2B3D64',
                project_id: 1,
                name: 'third palette',
                id: 3
              },
              {
                color1: '#F46767',
                color2: '#1ABBFA',
                color3: '#E1CBCC',
                color4: '#A37AF5',
                color5: '#41347C',
                project_id: 2,
                name: 'fourth palette',
                id: 4
              },
              {
                color1: '#D77ED',
                color2: '#DF9568',
                color3: '#239B56',
                color4: '#F8EF88',
                color5: '#7F4B56',
                project_id: 2,
                name: 'fifth palette',
                id: 5
              },
              {
                color1: '#A73241',
                color2: '#E82656',
                color3: '#CF110F',
                color4: '#C44761',
                color5: '#5F645',
                project_id: 3,
                name: 'sixth palette',
                id: 6
              }

            ]);
          })
          .then(() => console.log('Test Seeding Complete!'))
          .catch(error => console.log({ error }))
      ]);
    })
    .catch(error => console.log({ error }));
};