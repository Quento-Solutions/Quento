import {Component, Vue} from 'nuxt-property-decorator'
import functions from '~/plugins/firebaseFunctions'
import type {StoredImage} from '~/types/firebaseTypes'
import UploadImage from '~/utils/uploadImage'
@Component<PasteImagesMixin>({})
export default class PasteImagesMixin extends Vue {
  images: StoredImage[] = []
  contents!: string

  async uploadImage(image: File, evt?: any) {
    const imageUpload = await UploadImage(image)
    if (evt) {
      this.insertAtCursor(evt.target, `\n![image](${imageUpload.imageURL})\n`)
    }
    this.images.push(imageUpload)
    return imageUpload;
  }

  async onPaste(evt: any) {
    if (evt.clipboardData.files.length) {
      const loading = this.$vs.loading()
      const files = [...evt.clipboardData.files] as File[]
      // this.reader.readAsDataURL
      const uploadRefs = files.map(async (image: File) => {
        const reader = new FileReader()
        const promise = new Promise((resolve, reject) => {
          reader.addEventListener('load', async () => {
            const base64image = reader.result
            try {
              const imageResponse = await functions.httpsCallable(
                'functionPostImage'
              )({name: image.name, image: base64image})

              const imageURL = imageResponse.data.imageURL as string
              const fileName = imageResponse.data.fileName as string

              this.insertAtCursor(evt.target, `\n![image](${imageURL})\n`)
              this.images.push({
                imageURL,
                fileName
              })
              return resolve(imageURL)
            } catch (error) {
              console.log({error})
              return reject(error)
            }
          })
        })
        reader.readAsDataURL(image)
        return promise
        // https://firebasestorage.googleapis.com/v0/b/supplant-44e15.appspot.com/o/thumb%40256_e9320c0e-a80e-485d-864d-0fa97d665cff.jpg?alt=media&token=2315a102-391e-48f4-a05b-37ed2fd96fb3
      })
      await Promise.all(uploadRefs)
      loading.close()
    }
  }

  insertAtCursor(myField: HTMLInputElement, myValue: string) {
    //IE support
    //MOZILLA and others
    if (myField.selectionStart || myField.selectionStart == 0) {
      var startPos = myField.selectionStart
      var endPos = myField.selectionEnd || myField.selectionStart

      this.contents =
        myField.value.substring(0, startPos) +
        myValue +
        myField.value.substring(endPos!, myField.value.length)

      setTimeout(() => {
        startPos += myValue.length
        myField.selectionStart = myField.selectionEnd = startPos
      }, 10)
    } else {
      this.contents += myValue
    }
  }
}
