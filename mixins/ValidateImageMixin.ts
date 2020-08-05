import {Component, Vue} from "nuxt-property-decorator";
@Component
export default class ValidateImageMixin extends Vue {
    validateImageType(image : File) {
        console.log(image);
        if(!(image instanceof File)) return alert("Invalid File!");
    
        const fileName = image.name.toLowerCase();
        const extMatches = fileName.match(/\.([^\.]+)$/);
        var ext = extMatches ? extMatches[0] : "";
        console.log({ext});
        switch (ext) {
          case ".jpg":
          case ".bmp":
          case ".png":
          case ".tif":
          case ".jpe":
          case ".jpeg":
          case ".svg":
            return true;
            break;
          default:
            alert("Not allowed");
            throw "Invalid File";
            return false;
        }
      }
}