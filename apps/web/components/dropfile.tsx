'use client';
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/shadcn-io/dropzone';
import { useState, useEffect } from 'react';
interface DropFileProps {
  handleDrop: (file: File) => void;
}
const DropFile = ({handleDrop}: DropFileProps) => {
  const [files, setFiles] = useState<File[] | undefined>();
  const onDrop = (files: File[]) => {
    console.log(files);
    setFiles(files);
  };

  useEffect(() => {
    if (files && files.length > 0) {
      console.log('Files changed:', files);
    }
    files && handleDrop(files[0]);
  }, [files]);

  return (
    <Dropzone
      maxFiles={1}
      maxSize={1024 * 1024 * 15}
      minSize={1024}
      onDrop={onDrop}
      onError={console.error}
      src={files}
    >
      <DropzoneEmptyState />
      <DropzoneContent />
    </Dropzone>
  );
};
export default DropFile;