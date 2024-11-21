import {generate} from 'critical';

generate({
  // Your base directory
  base: 'client/dist/',

  // HTML source file
  src: 'index.html',

  // Your CSS Files (optional)
  css: ['assets/*.css'],

  // Viewport width
  width: 1300,

  // Viewport height
  height: 900,

  // Output results to file
  target: {
    css: 'assets/critical.css',
    uncritical: 'assets/uncritical.css',
  },

  // Extract inlined styles from referenced stylesheets
  extract: true,

  // ignore CSS rules
  ignore: {
    atrule: ['@font-face'],
    rule: [/some-regexp/],
    decl: (node, value) => /big-image\.png/.test(value),
  },
}, (err, output) => {
  if (err) {
    console.error(err);
  } else if (output) {
    console.log('Generated critical CSS');
  }
});