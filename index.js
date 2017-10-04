const fetch = require('node-fetch');
const btoa = require('btoa');
const fs = require('fs');
const moment = require('moment')
const forms = [];
let baseUrl = '';

const headers = {
  Authorization: `Basic ${btoa('ArdenMediaCompanyLLC\\Luke.Filipos:#4fYuZ@g%Vab')}`,
  Accept: 'application/json'
}

console.log('fetching authorized base url')
fetch('https://login.eloqua.com/id', { headers }).then(res => res.json())
.then(json => {
  console.log('fetched authorized base url', json.urls.base)
  baseUrl = json.urls.base;
  fetchForms(1);
}).catch(err => console.error(err))

function fetchForms(page) {
  console.log('fetching forms page', page)
  fetch(`${baseUrl}/api/rest/2.0/assets/forms?page=${page}&depth=partial&lastUpdatedAt=${moment().subtract(1, 'year').unix()}`, { headers })
  .then(res => res.json())
  .then(json => {
    Array.prototype.push.apply(forms, json.elements)
    console.log('forms fetched', forms.length)
    if (++page < Math.ceil(json.total / json.pageSize) + 1) {
      fetchForms(page)
    } else {
      fetchFormData(0)
      
    }
  }).catch(err => console.error(err))
}

function fetchFormData(idx) {
  if (idx < forms.length) {
    const form = forms[idx];
    console.log(`fetching form ${idx + 1} of ${forms.length}:`, form.name)
    fetchFormDataPage(1, idx);
  } else {
    console.log('writing forms.json')
    fs.writeFileSync('forms.json', JSON.stringify(forms, null, 2));
    process.exit();
  }
}

function fetchFormDataPage(page, idx) {
  const form = forms[idx];
  console.log(`fetching page ${page} of`, form.name);
  fetch(`${baseUrl}/api/rest/2.0/data/form/${form.id}?page=${page}`, { headers })
  .then(res => res.json())
  .then(json => {
    if (!form.data) form.data = [];
    // console.log(form.data.length)
    Array.prototype.push.apply(form.data, json.elements)
    if (++page < Math.ceil(json.total / json.pageSize) + 1) {
      return fetchFormDataPage(page, idx)
    } else {
      fetchFormData(++idx);
    }
  }).catch(err => console.error(err))
}
