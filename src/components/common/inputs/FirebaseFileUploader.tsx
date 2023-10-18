import React, { useState, ChangeEvent, DragEvent } from "react";
import Stack from "@mui/material/Stack";
import { Container, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface FirebaseFileUploaderProps {
  acceptTypes: string;
  multiple: boolean;
}

const FirebaseFileUploader: React.FC<FirebaseFileUploaderProps> = ({
  acceptTypes,
  multiple,
}) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    handleFiles(files);
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);

    const files = event.dataTransfer.files;
    handleFiles(files);
  };

  const handleFiles = (files: FileList | null) => {
    if (files && files.length > 0) {
      const newImageUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onloadend = () => {
          newImageUrls.push(reader.result as string);

          if (newImageUrls.length === files.length) {
            setImageUrls([...imageUrls, ...newImageUrls]);
          }
        };

        reader.readAsDataURL(file);
      }
    }
  };

  const handleDeleteImage = (index: number) => {
    const updatedImages = [...imageUrls];
    updatedImages.splice(index, 1);
    setImageUrls(updatedImages);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Stack direction="column" alignItems="center" spacing={2}>
        <label htmlFor="upload-image" style={{ cursor: "pointer" }}>
          <div
            id="upload-dropzone"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`dropzone ${dragging ? "dragging" : ""}`} // Clases CSS para estilos
          >
            {dragging ? (
              <p>Suelta aquí los archivos</p>
            ) : (
              <p>
                Arrastra y suelta tus archivos aquí o haz clic para
                seleccionarlos.
              </p>
            )}
            <input
              id="upload-image"
              type="file"
              accept={acceptTypes}
              onChange={handleFileUpload}
              multiple={multiple}
              style={{ display: "none" }}
            />
          </div>
        </label>
        {imageUrls.map((imageUrl, index) => (
          <div key={index} className="image-container">
            <img
              src={imageUrl}
              alt={`Uploaded Image ${index}`}
              className="uploaded-image"
            />
            <IconButton onClick={() => handleDeleteImage(index)}>
              <DeleteIcon />
            </IconButton>
          </div>
        ))}
      </Stack>
    </Container>
  );
};

export default FirebaseFileUploader;
