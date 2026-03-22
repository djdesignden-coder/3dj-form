import { useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { UploadCloud, X } from 'lucide-react';

interface ImageUploadProps {
  setFiles: (files: File[]) => void;
  setError: (error: string) => void;
  files: File[];
}

export default function ImageUpload({ setFiles, setError, files }: ImageUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      setError('Some files were rejected. Please upload valid image files.');
    }
    setFiles([...files, ...acceptedFiles]);
  }, [files, setFiles, setError]);

  const removeFile = (fileToRemove: File) => {
    setFiles(files.filter(file => file !== fileToRemove));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
  } as any);

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragActive 
            ? 'border-purple-500 bg-purple-500/10' 
            : 'border-slate-700 bg-slate-800/30 hover:border-slate-500 hover:bg-slate-800/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-slate-400">
          <UploadCloud className={`w-10 h-10 mb-2 transition-colors ${isDragActive ? 'text-purple-400' : 'text-slate-500'}`} />
          {isDragActive ? (
            <p className="text-purple-300">Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop files here, or click to select</p>
          )}
        </div>
      </div>
      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative group overflow-hidden rounded-md border border-white/10">
              <img
                src={URL.createObjectURL(file)}
                alt={`preview ${index}`}
                className="h-24 w-full object-cover transition-transform group-hover:scale-110"
                onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
              />
              <button
                onClick={() => removeFile(file)}
                className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
