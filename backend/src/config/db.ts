import mongoose from 'mongoose';

/**
 * Connect to MongoDB using the MONGODB_URI environment variable.
 */
export const connectDB = async (): Promise<typeof mongoose> => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error(
      'MongoDB connection error: MONGODB_URI environment variable is not defined in the environment configuration.'
    );
  }

  try {
    const connection = await mongoose.connect(mongoUri);
    console.log(
      `Connected to MongoDB successfully: ${connection.connection.name} (${connection.connection.host}:${connection.connection.port})`
    );
    return connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};

export default connectDB;
