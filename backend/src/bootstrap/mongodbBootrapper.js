import mongoose from 'mongoose';

export default mongoDbUri => {
  mongoose.connect(mongoDbUri, { useNewUrlParser: true, useUnifiedTopology: true });
  mongoose.connection.on(
    'error',
    console.error.bind(console, 'MongoDB connection error:')
  );
};
