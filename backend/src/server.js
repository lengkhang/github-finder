import mongodbBootrapper from './bootstrap/mongodbBootrapper';
import appBootstrapper from './bootstrap/appBootstrapper';

(async () => {
  try {
    const API_PORT = 3001;
    const mongoDbUri = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017';

    await mongodbBootrapper(mongoDbUri);
    const app = await appBootstrapper();
    app.listen(API_PORT, () => console.log(`Listening on port: ${API_PORT}`));
  } catch (err) {
    console.error('Unable to bootstrap application', err);
  }
})();
