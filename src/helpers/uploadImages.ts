import cloudinary from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config()

// cloudinary.v2.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
// });

cloudinary.v2.config({
  cloud_name: 'dhp2q7rls',
  api_key: '789349674471955',
  api_secret: '14TuaNUiwJwED4bKS3hC-x4NwEA',
});


type Image = {
  secure_url: string,
  public_id: string
}
/** TODO, CHECK IMAGE HANDLER, IF IT IS OBJECT OR STRING FROM 'type Image' */
type UpImage = (base64: string) => Promise<Image>
type UpImages = (arrImages: Image[]) => Promise<Image[]>

const regx = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

export const uploadImage: UpImage = async (base64: string) => {
  const { secure_url, public_id } = await cloudinary.v2.uploader.upload(base64, {})
  return { secure_url, public_id }
}

export const uploadImages: UpImages = async (arrImages) => {
  const sendImg: UpImage = (base64) => {
    return new Promise(async (res, rej) => {
      res(await uploadImage(base64))
    })
  }
  let images = await Promise.all(arrImages.map(img => sendImg(img.secure_url)))

  return images
}

export const deleteImage = async (public_id: string) => {
  await cloudinary.v2.uploader.destroy(public_id)
  // .then(() => true).catch(() => false)
}

export const deleteImages = async (arrImages: Image[]) => {
  const sendImg = (public_id: string) => {
    return new Promise(async (res, rej) => {
      res(await deleteImage(public_id))
    })
  }
  await Promise.all(arrImages.map(img => sendImg(img.public_id)))

  return true
}