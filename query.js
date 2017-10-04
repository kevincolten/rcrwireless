const jsonQuery = require('json-query');
const data = { forms: require('./forms') }

console.log(jsonQuery('forms[*name~/^Dell/i].name', {
  data: data,
  allowRegexp: true
}))
