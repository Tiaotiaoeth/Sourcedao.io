const path = require('path')

module.exports = {
  '@api': path.resolve(__dirname, '../../src/api'), 
  '@css': path.resolve(__dirname, '../../src/assets/css'), 
  '@img': path.resolve(__dirname, '../../src/assets/images'), 
  '@views': path.resolve(__dirname, '../../src/views'), 
  '@components': path.resolve(__dirname, '../../src/components'), 
  '@routes': path.resolve(__dirname, '../../src/routes'),
  '@utils': path.resolve(__dirname, '../../src/utils'), 
  '@constants': path.resolve(__dirname, '../../src/constants'), 
  '@context': path.resolve(__dirname, '../../src/context'), 
  '@store': path.resolve(__dirname, '../../src/store'), 
  '@langs': path.resolve(__dirname, '../../src/langs'), 
  '@hooks': path.resolve(__dirname, '../../src/hooks'), 
}