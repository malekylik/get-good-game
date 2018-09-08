const mode = process.env.NODE_ENV && process.env.NODE_ENV.trim();

if (mode === 'production' || !mode) {
  module.exports = require('./webpack.main.config');
} else {
  switch(mode) {
    case 'loading-screen': {
      module.exports = require('./webpack.loading-screen.config');
      break;
    }
    case 'modal': {
      module.exports = require('./webpack.modal.config');
      break;
    }
  }
}
