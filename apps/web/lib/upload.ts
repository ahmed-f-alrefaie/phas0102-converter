
import { jupyterUploadFile, jupyterDownloadColabNotebook } from "./api/client";

async function upload_file(code: string, file: File){
    const respones = await jupyterUploadFile({
        query: {
            code: code
        },
        body: { file: file }
    })
    console.log(respones);
    return respones
}


async function download_notebook(code: string, url: string){
    const respones = await jupyterDownloadColabNotebook({
        query: {
            code: code
        },
        body: { url: url }
    })
    console.log(respones);
    return respones
}

export { upload_file, download_notebook };