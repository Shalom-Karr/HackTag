exports.handler = async (event) => {
  const targetUrl = event.queryStringParameters?.url;
  const allowedDomains = ['forums.jtechforums.org'];
  
  // Validate URL
  if (!targetUrl || !allowedDomains.some(domain => targetUrl.includes(domain))) {
    return {
      statusCode: 403,
      body: 'Forbidden domain'
    };
  }
  
  try {
    const res = await fetch(targetUrl);
    const body = await res.text();
    
    return {
      statusCode: res.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': res.headers.get('content-type') || 'text/html'
      },
      body
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: 'Proxy error: ' + error.message
    };
  }
};
