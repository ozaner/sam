const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/index.js'],
  bundle: true,
  format: 'esm',                  // Output as ES module
  platform: 'node',               // Output for Node.js
  outfile: 'bundle.js',           // Output bundle
})
.then(() => {
  console.log('Build succeeded');
})
.catch(() => process.exit(1));
