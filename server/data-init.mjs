import API_KEY from './api.key.mjs';

async function fetchToken() {
  const response = await fetch('https://api4.thetvdb.com/v4/login', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ 'apikey': API_KEY, 'pin': '' })
  });

  if (!response.ok) {
    throw new Error(`Not 2xx response, ${response.status}`, 
      {cause: response});
  }

  const json = await response.json();

  return json.data.token;
}

export {fetchToken};