const app = require('./src/app.js');
console.log('app loaded');
console.log('root routes:', app._router.stack.filter(layer => layer.route && layer.route.path).map(layer => ({path: layer.route.path, methods: Object.keys(layer.route.methods)})));
const directoryRoutes = require('./src/routes/directory.routes');
console.log('directoryRoutes type:', typeof directoryRoutes);
console.log('directoryRoutes stack length:', directoryRoutes.stack ? directoryRoutes.stack.length : 'no stack');
