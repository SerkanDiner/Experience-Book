import User from '../models/user.model';
import { connect } from '../mongodb/mongoose';

export const createOrUpdateUser = async (
  id,
  first_name,
  last_name,
  image_url,
  email_addresses,
  username
) => {
  try {
    await connect();

    if (!email_addresses?.[0]?.email_address) {
      throw new Error('Email address is missing from Clerk webhook payload.');
    }

    const user = await User.findOneAndUpdate(
      { clerkId: id },
      {
        $set: {
          firstName: first_name || '',
          lastName: last_name || '',
          profilePicture: image_url || '',
          email: email_addresses[0].email_address,
          username: username || email_addresses[0].email_address.split('@')[0],
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    if (!user) throw new Error('Failed to create or update user.');
    console.log('✅ User upserted in MongoDB:', user);

    return user;
  } catch (error) {
    console.error('❌ Error in createOrUpdateUser:', error);
    return null;
  }
};

export const deleteUser = async (id) => {
  try {
    await connect();
    await User.findOneAndDelete({ clerkId: id });
    console.log('🗑️ User deleted from MongoDB:', id);
  } catch (error) {
    console.error('❌ Error deleting user:', error);
  }
};
