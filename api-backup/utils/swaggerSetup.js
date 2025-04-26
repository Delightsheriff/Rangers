const listEndpoints = require('express-list-endpoints');

function generateSwaggerSpec(app, options = {}) {
  const {
    title = 'Auto-generated Swagger Docs',
    version = '1.0.0',
    description = '',
    servers = [{ url: 'http://localhost:5000' }],
  } = options;

  const endpoints = listEndpoints(app);
  const paths = {};

  endpoints.forEach((ep) => {
    const routePath = ep.path;
    if (!paths[routePath]) paths[routePath] = {};

    ep.methods.forEach((method) => {
      paths[routePath][method.toLowerCase()] = {
        summary: `${method} ${routePath}`,
        tags: [routePath.split('/')[2] || 'root'],
        responses: {
          200: {
            description: 'Success',
          },
        },
      };
    });
  });

  return {
    openapi: '3.0.0',
    info: {
      title,
      version,
      description,
    },
    servers,
    paths,
  };
}

module.exports = generateSwaggerSpec;
