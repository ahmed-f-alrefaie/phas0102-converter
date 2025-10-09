//@ts-nocheck
"use client"
import React from 'react';
import DropFile from '@/components/dropfile';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { upload_file, download_notebook } from '@/lib/upload';
import { set } from 'react-hook-form';

async function handleResponse(response: Response) {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.blob();
}

export default function Page() {
  const [currentMode, setCurrentMode] = React.useState<'colablink' | 'uploadfile'>('colablink');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [file, setFile] = React.useState<File | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const secretCode = formData.get('secretcode') as string;


    try {
      if (currentMode === 'colablink') {
        const colabLink = formData.get('colablink') as string;
        if (!colabLink?.startsWith('https://colab.research.google.com/')) {
          setErrorMessage('Please enter a valid Colab link.');
          setIsLoading(false);
          return;
        }

        // Process Colab link
        const result = await download_notebook(secretCode, colabLink);
        console.log('Result data type:', typeof result.data);
        console.log('Result data:', result.data);
        // Check if result.data is a Blob or needs conversion
        let blob: Blob;
        if (result.data instanceof Blob) {
          blob = result.data;
        } else {
          // If it's already a string URL, we need to fetch it again
          const response = await fetch(result.data);
          blob = await response.blob();
        }

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "exported.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

      } else if (currentMode === 'uploadfile') {
        if (!file) {
          setErrorMessage('Please upload a .ipynb file.');
          setIsLoading(false);
          return;
        }
        if (!file.name.endsWith('.ipynb')) {
          setErrorMessage('Only .ipynb files are allowed.');
          setIsLoading(false);
          return;
        }

        // Process file upload
        const result = await upload_file(secretCode, file);
        console.log('Result data type:', typeof result.data);
        console.log('Result data:', result.data);
        // Check if result.data is a Blob or needs conversion
        let blob: Blob;
        if (result.data instanceof Blob) {
          blob = result.data;
        } else {
          // If it's already a string URL, we need to fetch it again
          const response = await fetch(result.data);
          blob = await response.blob();
        }

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name.replace('.ipynb', '.pdf') || "exported.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Conversion error:', error);
      setErrorMessage('Failed to convert notebook. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileDrop = (droppedFile: File) => {
    setFile(droppedFile);
    // Also update the hidden file input for form submission
    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(droppedFile);
      fileInputRef.current.files = dataTransfer.files;
    }
  };

  return (
    <div className='flex flex-col items-center justify-center py-2'>
      <h1 className='text-4xl font-bold mb-4 mt-8'>PHAS0102 Notebook to PDF Converter</h1>
      <div className='text-lg mb-8'>
        Produce pretty notebooks for uploading to Moodle
      </div>
      {errorMessage !== '' && (
        <div className='border rounded-xl bg-muted p-4 my-8 flex items-center flex-row'>
          <div className='text-lg text-red-600'>{errorMessage}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className='flex flex-row space-x-2 items-center mb-4'>
          <Label htmlFor='secretcode'>Enter Secret Code:</Label>
          <Input
            id='secretcode'
            name='secretcode'
            placeholder='Secret Code'
            className='w-48'
            required
          />
        </div>

        <Tabs
          defaultValue="colablink"
          onValueChange={(v) => {
            setCurrentMode(v as "colablink" | "uploadfile");
            setFile(null); // Clear file when switching tabs
          }}
          className="w-full"
        >
          <TabsList>
            <TabsTrigger value="colablink">Colab Link</TabsTrigger>
            <TabsTrigger value="uploadfile">Upload .ipynb File</TabsTrigger>
          </TabsList>

          <TabsContent value="colablink">
            <div className="flex flex-col space-y-2 items-center my-10">
              <Label htmlFor='colablink'>Paste Colab Link here</Label>
              <Input
                id='colablink'
                name='colablink'
                placeholder='https://colab.research.google.com/drive/...'
                className='w-full'
              />
              <div className="text-sm text-muted-foreground">
               Click Share - General access - Change to "Anyone with the link" - Copy Link
              </div>
            </div>
          </TabsContent>

          <TabsContent value="uploadfile">
            <div className="container mx-auto mt-10 border-10 rounded-lg bg-muted p-4">
              <DropFile handleDrop={handleFileDrop} />
              <input
                ref={fileInputRef}
                type="file"
                name="file"
                accept=".ipynb"
                style={{ display: 'none' }}
              />
              {file && (
                <div className="mt-2 text-sm text-green-600">
                  Selected file: {file.name}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <Button disabled={isLoading} type='submit' className='mt-4 w-full'>{isLoading ? 'Converting...' : 'Convert to PDF'}</Button>
      </form>
    </div>
  );
}