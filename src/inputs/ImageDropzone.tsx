import { useCallback } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import { twMerge } from 'tailwind-merge';

const ImageDropzone = ({
  onImageUpload,
  setError,
  className,
  image,
}: {
  onImageUpload: (file: File) => void;
  setError: (error: string) => void;
  className?: string;
  image: File | null;
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (acceptedFiles.length > 0) {
        onImageUpload(acceptedFiles[0]);
      }
      if (rejectedFiles.length > 0) {
        setError('File must be an image and less than 5MB');
      }
    },
    [onImageUpload, setError]
  );
  const fiveMb = 5 * 1024 * 1024;
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': [],
    },
    maxFiles: 1,
    maxSize: fiveMb,
    onDrop,
  });

  return (
    <div
      {...getRootProps()}
      className={twMerge(
        'flex items-center justify-center border-2 border-gray-300 rounded-lg w-fit h-fit cursor-pointer p-4',
        className
      )}
    >
      <input {...getInputProps()} id="image" />
      {image ? (
        <div>
          <img
            src={URL.createObjectURL(image)}
            alt="preview"
            className="max-h-96"
          />
        </div>
      ) : (
        <div>
          <p>Drag and drop an image here, or click to select an image</p>
        </div>
      )}
    </div>
  );
};

export default ImageDropzone;
