const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/index.es6'],
  bundle: true,
  format: 'esm',                  // Output as ES module
  platform: 'node',               // Output for Node.js
  outfile: 'bundle.js',           // Output bundle
  loader: { '.es6': 'js' },       // Treat .es6 files as JS
})
.then(() => {
  console.log('Build succeeded');
})
.catch(() => process.exit(1));
