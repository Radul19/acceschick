import { Schema, model, SchemaTypes } from "mongoose";
const objId = SchemaTypes.ObjectId;

const ItemSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
    // promotion: { type: String },
    promotion: { type: Boolean, default: false },
    description: { type: String, required: true },
    categories: { type: Array, required: true },
    favorites: { type: Array, default: [] },
    secure_url: { type: String, required: true },
    public_id: { type: String, required: true },
    colors: { type: [String], default:undefined },
  },
  {
    timestamps: true,
  }
);

export default model("Item", ItemSchema);

// module.exports = model('Item', ItemSchema)
