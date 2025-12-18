import { cuid } from '@adonisjs/core/helpers'
import { MultipartFile } from '@adonisjs/core/types/bodyparser'
import drive from '@adonisjs/drive/services/main'

export async function upload(file: MultipartFile,folder:string): Promise<string> {
    if (!file) {
        throw new Error("No file provided")
    }

    let fileName = ''

    if(folder===null){
        fileName = `uploads/${cuid()}.${file.extname}`
    }else{
        fileName = `uploads/${folder}/${cuid()}.${file.extname}`
    }


    try {
        await file.moveToDisk(fileName)
        return fileName
    } catch (error) {
        console.error("File upload error:", error)
        throw new Error("File upload failed")
    }
}

export async function deleteFile(filePath: string) {
    const result = await drive.use().delete(filePath)

}
