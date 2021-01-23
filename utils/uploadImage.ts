import {Context as AppContext} from '@nuxt/types'
import {StoredImage} from '~/types/firebaseTypes'

const UploadImage =  async ({$fire}: AppContext, image: File): Promise<StoredImage> => {
  const reader = new FileReader()

  const promise = new Promise<{imageURL: string; fileName: string}>((resolve, reject) => {
      reader.addEventListener('load', async () => {
        const base64image = reader.result
        try {
          const imageResponse = await $fire.functions.httpsCallable('functionPostImage')({name: image.name, image: base64image})
          const {imageURL, fileName}: {imageURL: string, fileName: string}  = imageResponse.data
          return resolve({imageURL, fileName})
        } catch (error) {
          console.log({error})
          return reject(error)
        }
      })
    }
  )
  reader.readAsDataURL(image)
  return promise
}

export default UploadImage;