import { Schema, model, SchemaTypes } from "mongoose";
const objId = SchemaTypes.ObjectId;

const ItemSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    favorites: { type: Array, default: [] },
    address: { type: String, default: "" },
    phone: { type: String, default: "" },
    cart: {
      type: [
        {
          item_id: { type: String, required: true },
          color: { type: String, default: undefined },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default model("User", ItemSchema);

// module.exports = model('Item', ItemSchema)
