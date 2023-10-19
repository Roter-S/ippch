import React, { useState, ChangeEvent, DragEvent } from "react";
import {
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";
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
    <>
      <label htmlFor="upload-image" style={{ cursor: "pointer" }}>
        <div
          id="upload-dropzone"
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`dropzone ${dragging ? "dragging" : ""}`}
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
      <ImageList sx={{ width: 500, height: 450 }}>
        {imageUrls.map((imageUrl, index) => (
          <ImageListItem key={index}>
            <img
              srcSet={imageUrl}
              src={imageUrl}
              alt={imageUrl}
              loading="lazy"
            />
            <ImageListItemBar
              actionIcon={
                <IconButton
                  sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                  aria-label={"delete"}
                  onClick={() => handleDeleteImage(index)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
    </>
  );
};

export default FirebaseFileUploader;
