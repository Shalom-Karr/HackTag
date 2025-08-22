// This code runs securely on Netlify's servers

exports.handler = async function(event, context) {
  // Get the secret API key from the environment variables we set in Netlify
  const apiKey = process.env.YOUTUBE_API_KEY;

  // Get the search query from the URL (e.g., .../youtube-search?q=cats)
  const query = event.queryStringParameters.q;

  if (!query) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Search query is missing' }) };
  }
  
  if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ error: 'YouTube API key is not configured on the server.' }) };
  }

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=5&type=video&key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      // If Google's API returns an error, pass it along
      const errorData = await response.json();
      return { statusCode: response.status, body: JSON.stringify(errorData) };
    }
    
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data from YouTube API' })
    };
  }
};
