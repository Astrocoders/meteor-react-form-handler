Package.describe({
  name: "astrocoders:react-form-handler",
  summary: "React form validation using aldeed:simple-schema" ,
  git: 'https://github.com/coniel/meteor-react-form-handler.git',
  version: "0.6.3"
});

Package.onUse(function(api) {
  api.versionsFrom("1.0.1");

  // Dependencies
  api.use([
      'react',
      'aldeed:simple-schema@1.3.3',
      'check'
  ]);

  // Shared files
  api.addFiles([
      'lib/utils.js',
      'lib/react-form-handler.jsx',
      'lib/simple-schema-extensions.js',
      'lib/layout-styles.js',
     'lib/components/Form.jsx'
  ]);

  // Server files
  api.addFiles([
    // 'server/'
  ], "server");

  // Client files
  api.addFiles([
    // 'client/'
  ], "client");

  // Exports
  api.export([
      'FormHandler',
      'Form',
      'FormLayoutStyles',
      'AvailableFormLayoutStyles'
  ]);
});


Package.onTest(function (api) {
  // api.use("tinytest");
});
