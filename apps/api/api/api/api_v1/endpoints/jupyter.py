from fastapi import APIRouter, HTTPException, File, UploadFile,Response, Body
import tempfile
from api.convert import convert_notebook
from api.colab import download_from_colab
from pydantic import HttpUrl
from api.config import settings
router = APIRouter()

@router.post("/uploadfile/", response_class=Response)
async def upload_file(
    code: str,
    file: UploadFile):

    if code != settings.secret_code:
        raise HTTPException(status_code=403, detail="Invalid secret code")

    print("Received file:", file.filename)
    print("Content type:", file.content_type)
    # Open and read the file (for demonstration purposes, we just read the first 100 bytes)
    # Store file to temporary location or process as needed

    # Here you can add logic to process the notebook file as needed
    data = await file.read()
    data = convert_notebook(data.decode('utf-8'))


    return Response(media_type="application/pdf", content=data, headers={
        "Content-Disposition": f"attachment; filename={file.filename.replace('.ipynb', '.pdf')}"
    })


@router.post("/colab/", response_class=Response)
def download_colab_notebook(
    code: str,
    # But the url in body
    url: HttpUrl = Body(..., embed=True)
):
    

    if code != settings.secret_code:
        raise HTTPException(status_code=403, detail="Invalid secret code")

    url_str = str(url)
    if "colab.research.google.com" not in url_str:
        raise HTTPException(status_code=400, detail="Invalid Colab URL")
    

    # Logic to download and save the notebook would go here
    with tempfile.NamedTemporaryFile(suffix=".ipynb") as temp_file:
        try:
            download_from_colab(url_str, temp_file.name)
            with open(temp_file.name, 'r') as f:
                notebook_content = f.read()
                data = convert_notebook(notebook_content)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error downloading or processing notebook: {str(e)}")
    return Response(media_type="application/pdf", content=data, headers={
        "Content-Disposition": "attachment; filename=converted_notebook.pdf"
    })