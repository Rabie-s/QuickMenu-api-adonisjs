import { cuid } from '@adonisjs/core/helpers'
import drive from '@adonisjs/drive/services/main'

export async function upload(file: any): Promise<string> {
    if (!file) {
        throw new Error("No file provided")
    }
    const fileName = `${cuid()}.${file.extname}`

    try {
        
        await file.moveToDisk(fileName)
        return fileName
    } catch (error) {
        console.error("File upload error:", error)
        throw new Error("File upload failed")
    }
}

export async function deleteFile(filePath:any){
    const result = await drive.use().delete(filePath)
    
}
