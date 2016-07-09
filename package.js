Package.describe({
  name: "astrocoders:react-form-handler",
  summary: "React form validation using aldeed:simple-schema" ,
  git: 'https://github.com/coniel/meteor-react-form-handler.git',
  version: "0.6.4"
});

Package.onUse(function(api) {
  api.versionsFrom("1.0.1");

  // Dependencies
  api.use([
    'aldeed:simple-schema@1.3.3',
    'stevezhu:lodash',
    'check',
    'ecmascript',
  ]);

  // Shared files
  api.addFiles([
    'lib/utils.js',
    'lib/react-form-handler.js',
    'lib/simple-schema-extensions.js',
    'lib/form-builder.js',
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
    'FormBuilder',
  ]);
});
