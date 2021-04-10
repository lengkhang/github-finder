import mongoose from 'mongoose';

const { Schema } = mongoose;

const SearchSchema = new Schema(
  {
    texts: [String],
    type: String,
    userId: String
  },
  { timestamps: true }
);

export default mongoose.model('SearchHistory', SearchSchema);
