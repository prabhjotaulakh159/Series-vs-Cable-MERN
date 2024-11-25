import {generate} from 'critical';

generate({
  base: 'client/dist/',

  src: 'index.html',

  target: {
    html: 'index.html',
    uncritical: 'assets/uncritical.css'
  },

  css: ['client/dist/assets/*.css'],

  inline: true,

  extract: true,

  ignore: {
    atrule: ['@import']
  }

}, (err, output) => {
  if (err) {
    console.error('Error generating and inlining critical CSS:', err);
  } else {
    console.log('Successfully inlined critical CSS into index.html');
  }
});