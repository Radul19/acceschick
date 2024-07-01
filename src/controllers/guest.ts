//@ts-ignore
import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import path from "path";
import UserSch from "../models/UserSch";
import { deleteImage, uploadImage } from "../helpers/uploadImages";
import ItemSch from "../models/ItemSch";
const debug = false;

const indexPath = path.resolve(__dirname, "../app", "index.html");
// console.log(indexPath);

export const file: RequestHandler = async (req, res) => {
  if (debug) console.log("#test");
  res.sendFile(indexPath);
};

export const test: RequestHandler = async (req, res) => {
  if (debug) console.log("#test");
  try {
    res.send("ok");
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};
export const register: RequestHandler = async (req, res) => {
  if (debug) console.log("#test");
  try {
    const { name, email, pass } = req.body;

    let findEmail = await UserSch.findOne({ email });
    if (findEmail)
      return res.status(409).json({ msg: "El correo ya esta en uso" });

    let password = bcrypt.hashSync(pass, bcrypt.genSaltSync(10));
    const result = await UserSch.create({ name, email, password });

    const { name: n, email: e, address, phone, favorites, cart,_id } = result;
    return res.send({ name: n, email: e, address, phone, favorites, cart,_id });
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};
export const editUser: RequestHandler = async (req, res) => {
  if (debug) console.log("#editUser");
  try {
    const { _id, name: na, address: ad, phone: ph } = req.body;
    let result = await UserSch.findOneAndUpdate(
      { _id },
      {
        name: na,
        address: ad,
        phone: ph,
      },
      { new: true }
    );
    if (result) {
      const { name, email, address, phone, favorites, cart,_id } = result;
      return res.send({ name, email, address, phone, favorites, cart,_id });
    } else res.status(400).json({ msg: "Usuario no encontrado" });
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};
export const login: RequestHandler = async (req, res) => {
  if (debug) console.log("#login");
  try {
    const { email, pass } = req.body;

    const user = await UserSch.findOne({ email });
    if (!user) return res.status(401).json({ msg: "Correo incorrecto" });
    bcrypt.compare(pass, user.password, function (_: any, result: any) {
      if (!result)
        return res.status(401).json({ msg: "Contraseña incorrecta" });
      const { name, email, address, phone, favorites, cart, _id } = user;
      return res.send({ name, email, address, phone, favorites, cart, _id });
    });
  } catch (error: any) {
    console.log(error);
    res.status(404).json({ msg: error.message });
  }
};
export const createItem: RequestHandler = async (req, res) => {
  if (debug) console.log("#createItem");
  try {
    const {
      secure_url: base64,
      name,
      description,
      price,
      categories,
    } = req.body;
    const { secure_url, public_id } = await uploadImage(base64);
    const result = await ItemSch.create({
      secure_url,
      public_id,
      name,
      description,
      price,
      categories,
    });

    res.send(result);
  } catch (error: any) {
    console.log(error);
    res.status(404).json({ msg: error.message });
  }
};
export const editItem: RequestHandler = async (req, res) => {
  if (debug) console.log("#editItem");
  try {
    const {
      secure_url: base64,
      public_id: pi,
      name,
      description,
      price,
      categories,
      promotion,
      _id,
    } = req.body;

    const regx =
      /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    // console.log(req.body);
    let auxFile = {
      su: "",
      pi: "",
    };
    if (regx.test(base64)) {
      const { secure_url, public_id } = await uploadImage(base64);
      auxFile.su = secure_url;
      auxFile.pi = public_id;
    } else {
      auxFile.su = base64;
      auxFile.pi = pi;
    }
    const result = await ItemSch.findOneAndUpdate(
      { _id },
      {
        secure_url: auxFile.su,
        public_id: auxFile.pi,
        name,
        description,
        price,
        categories,
        promotion,
      }
    );
    res.send(result);
  } catch (error: any) {
    console.log(error);
    res.status(404).json({ msg: error.message });
  }
};

export const deleteItem: RequestHandler = async (req, res) => {
  if (debug) console.log("#deleteItem");
  try {
    const { _id } = req.body;
    const result = await ItemSch.deleteOne({ _id });
    res.send(result);
  } catch (error: any) {
    console.log(error);
    res.status(404).json({ msg: error.message });
  }
};

export const removePic: RequestHandler = async (req, res) => {
  if (debug) console.log("#removePic");
  try {
    const { public_id } = req.body;
    await deleteImage(public_id);

    res.send("ok");
  } catch (error: any) {
    console.log(error);
    res.status(404).json({ msg: error.message });
  }
};
export const getItems: RequestHandler = async (req, res) => {
  if (debug) console.log("#getItems");
  try {
    const results = await ItemSch.find();
    res.send(results);
  } catch (error: any) {
    console.log(error);
    res.status(404).json({ msg: error.message });
  }
};
export const toggleHeart: RequestHandler = async (req, res) => {
  if (debug) console.log("#toggleHeart");
  try {
    const { user_id, item_id } = req.body;
    const user = await UserSch.findById(user_id);
    if (user) {
      if (user.favorites.includes(item_id)) {
        let i = user.favorites.findIndex((itm) => itm === item_id);
        user.favorites.splice(i, 1);
      } else {
        user.favorites.push(item_id);
      }
      await user.save();
      res.send(user);
    } else {
      res.status(404).json({ msg: "Error inesperado: Usuario no encontrado" });
    }
  } catch (error: any) {
    console.log(error);
    res.status(404).json({ msg: error.message });
  }
};
export const toggleCart: RequestHandler = async (req, res) => {
  if (debug) console.log("#toggleCart");
  try {
    const { user_id, item_id } = req.body;
    const user = await UserSch.findById(user_id);
    if (user) {
      if (user.cart.includes(item_id)) {
        let i = user.cart.findIndex((itm) => itm === item_id);
        user.cart.splice(i, 1);
      } else {
        user.cart.push(item_id);
      }
      await user.save();
      res.send(user);
    } else {
      res.status(404).json({ msg: "Error inesperado: Usuario no encontrado" });
    }
  } catch (error: any) {
    console.log(error);
    res.status(404).json({ msg: error.message });
  }
};

// export const namehere:RequestHandler = async (req,res)=>{
//     if(debug) console.log('#namehere')
//     try {
//         res.send('ok')
//     } catch (error:any) {
//         res.status(400).json({ msg: error.message })
//     }

// }
