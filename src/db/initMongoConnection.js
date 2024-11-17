import mongoose from 'mongoose';

export const initMongoConnection = async () => {
  try {
    const user = process.env.MONGODB_USER;
    const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
    const url = process.env.MONGODB_URL;
    const dbName = process.env.MONGODB_DB;

    await mongoose.connect(
      `mongodb+srv://${user}:${password}@${url}/${dbName}?retryWrites=true&w=majority&appName=ClusterHW`,
    );

    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
};
