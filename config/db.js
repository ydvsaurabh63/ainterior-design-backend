import mongoose from 'mongoose';
import dns from 'dns';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/interior_design';

    // Ensure SRV records resolve cleanly on Windows network/ISP environments
    if (mongoUri.startsWith('mongodb+srv://')) {
      try {
        dns.setServers(['8.8.8.8', '1.1.1.1']);
      } catch (dnsErr) {
        console.warn('DNS server override note:', dnsErr.message);
      }
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`MongoDB Connection Warning: ${error.message} (Proceeding without MongoDB connection)`);
  }
};

export default connectDB;
