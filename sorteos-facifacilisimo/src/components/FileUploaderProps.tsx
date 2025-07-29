// Para exportar PDF profesional, usa la función exportGanadoresPDF del WinnerDialog. Pega tus imágenes en base64 en las variables logoBase64 y iconBase64.
import React from 'react';
import { FileUpload } from 'primereact/fileupload';
import type { FileUploadHandlerEvent } from 'primereact/fileupload';

export interface FileUploaderProps {
  onFileRead: (fileContent: string) => void;
  toast?: React.RefObject<any>; 
  disabled?: boolean;
  label?: string; 
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileRead, disabled, label }) => {
  const handleUpload = async (e: FileUploadHandlerEvent) => {
    const file = e.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      if (!text.trim()) {
        return;
      }
      onFileRead(text);
    } catch (error) {
      console.error('Error al leer el archivo:', error);
    }
  };

  return (
    <div>
      {label && <div className="mb-2 text-blue-900 font-bold text-lg">{label}</div>}
      <FileUpload
        name="comments"
        accept=".txt"
        customUpload
        uploadHandler={handleUpload}
        chooseLabel="Sorteos"
        mode="basic"
        auto
        maxFileSize={1000000}
        disabled={disabled}
        chooseOptions={{
          className: "w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 text-lg py-3 shadow-lg font-semibold rounded-lg border-2 border-yellow-300 transition-all duration-200",
          icon: 'pi pi-upload',
        }}
      />
    </div>
  );
};

export default FileUploader;
