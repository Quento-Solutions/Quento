import functions from '~/plugins/firebaseFunctions'

const UploadImage =  async (image: File) => {
  const reader = new FileReader()
  const promise = new Promise<{imageURL: string; fileName: string}>(
    (resolve, reject) => {
      reader.addEventListener('load', async () => {
        const base64image = reader.result
        try {
          const imageResponse = await functions.httpsCallable(
            'functionPostImage'
          )({name: image.name, image: base64image})

          const imageURL = imageResponse.data.imageURL as string
          const fileName = imageResponse.data.fileName as string
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