const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/mongo-exercises', { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => console.log('MongoDB not connected', err));

const userSchema = new Schema({
  email: { type: String, required: true },
  name: { type: String, required: true }
}, { timestamps: true });

User = mongoose.model('User', userSchema);

exports.getUsers = async () => {
  try {
    return await User.find()
  } catch (error) {
    console.error(error.message);
  }
}

exports.createUser = async (userData) => {
  const user = new User(userData);

  try {
    return await user.save();
  } catch (error) {
    console.error(error.message);
  }
}

exports.getUser = async (id) => {
  try {
    return await User.findById(id)
  } catch (error) {
    console.error(error.message);
  }
}

exports.updateUser = async (id, data) => {
  try {
    return await User.findByIdAndUpdate(id, { $set: { ...data }}, {new: true});
  } catch (error) {
    console.error(error.message);
  }
}

exports.deleteUser = async (id) => {
  try {
    return await User.findByIdAndRemove(id);
  } catch (error) {
    console.error(error.message);
  }
}