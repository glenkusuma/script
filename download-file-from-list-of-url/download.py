"""Module providing a function to download a file from url"""
import os
import requests
from tqdm import tqdm

def file(url_file, output_directory, base_url="http://"):
    """file(url_file, output_directory)
    download files from list of file
    """
    # Get the current directory
    current_dir = os.path.dirname(os.path.realpath(__file__))
    output_directory = os.path.join(current_dir,output_directory)
    url_file = os.path.join(current_dir,url_file)

    # Create output directory if it doesn't exist
    os.makedirs(output_directory, exist_ok=True)
    
    # Read URLs from the file
    with open(url_file, 'r') as file:
        urls = file.read().splitlines()

    # Download file
    for i, url in enumerate(urls, start=1):
        if url.startswith("#"):
            continue
        try:
            # Use os.path.join to create a proper file path
            filename = os.path.join(output_directory, *url.split('/'))

            if os.path.exists(filename):
                print(f"file from line {i} already exists: {filename}")
                continue

            response = requests.get(base_url + url, stream=True, timeout=1000)
            response.raise_for_status()  # Check for errors

            # Create the directory structure if it doesn't exist
            os.makedirs(os.path.dirname(filename), exist_ok=True)

            # Get the total file size in bytes
            total_size = int(response.headers.get('content-length', 0))

            # Initialize tqdm with the total file size
            with tqdm(total=total_size, unit='B', unit_scale=True, desc=f"{url}") as pbar:
                with open(filename, 'wb') as file:
                    for chunk in response.iter_content(chunk_size=1024):
                        if chunk:  # filter out keep-alive new chunks
                            file.write(chunk)
                            pbar.update(len(chunk))

        except requests.exceptions.RequestException as e:
            print(f"Error downloading image {i}: {e}")

if __name__ == "__main__":
    # Replace 'url_list.txt' with the name of your file containing image URLs
    URL_PATH_DIR = 'url_list.txt.example'
    # Replace 'downloaded_images' with the desired output directory
    OUTPUT_PATH_DIR = 'download'
    file(URL_PATH_DIR, OUTPUT_PATH_DIR, base_url="https://sabnzbd.org/")
