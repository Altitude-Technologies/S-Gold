// Compress + resize an image File into a JPEG data URL so multiple images
// fit into localStorage (~5 MB total). Strips EXIF, downscales large photos,
// and re-encodes to JPEG with the given quality.
export function compressImage(
  file,
  { maxWidth = 1200, maxHeight = 1200, quality = 0.78 } = {}
) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type?.startsWith('image/')) {
      reject(new Error('Not an image'))
      return
    }
    const reader = new FileReader()
    reader.onerror = () => reject(reader.error || new Error('Read failed'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Decode failed'))
      img.onload = () => {
        let w = img.naturalWidth || img.width
        let h = img.naturalHeight || img.height
        const ratio = Math.min(maxWidth / w, maxHeight / h, 1)
        w = Math.max(1, Math.round(w * ratio))
        h = Math.max(1, Math.round(h * ratio))
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, w, h)
        try {
          const dataURL = canvas.toDataURL('image/jpeg', quality)
          resolve(dataURL)
        } catch (e) {
          reject(e)
        }
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}
