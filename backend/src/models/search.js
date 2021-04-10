import mongoose from 'mongoose';

const { Schema } = mongoose;

const SearchSchema = new Schema(
  {
    keyword: String,
    type: String
  },
  { timestamps: true }
);

export default mongoose.model('Search', SearchSchema);
