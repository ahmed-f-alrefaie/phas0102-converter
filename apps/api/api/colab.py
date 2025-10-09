import gdown

#examplelink = https://colab.research.google.com/drive/1RmSBYWoWVq2-VWgQf7rXC8jqosIGO6DZ?usp=sharing
import re

extract = re.compile(r"(\w|-){26,}")

def getid(url: str) -> str:
    """Extract the file ID from a Google Colab URL.

    Args:
        url (str): The Google Colab URL.

    Returns:
        str: The extracted file ID.
    """
    match = extract.search(url)
    if match:
        return match.group(0)
    else:
        raise ValueError("No valid ID found in the URL.")


def download_from_colab(url: str, output: str) -> str:
    """Download a file from a Google Colab link using gdown.

    Args:
        url (str): The Google Colab URL of the file to download.
        output (str): The local path where the downloaded file will be saved.
    """

    id = getid(url)
    file = gdown.download(id=id, output=output, quiet=False)

    return file


