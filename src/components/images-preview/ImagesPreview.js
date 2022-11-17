import React, { useState, useEffect } from "react";
import { Form } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import styles from './styles.module.scss';

export default function ImagesPreview({ onFilesSet, attachments }) {
  const [filesPreview, setFilesPreview] = useState([]);

  useEffect(() => {
    setFilesPreview(attachments);
  }, []);

  const handleChangeFiles = (e) => {
    if(e.target.files) {
      const files = Array.from(e.target.files);
      const filesArr = files.map(file => URL.createObjectURL(file));
      setFilesPreview(filesArr);
      onFilesSet(files);
    }
  }

  return (
    <>
      <Form.Label>Attachments</Form.Label>
      {filesPreview && filesPreview.length > 0 && <div className={styles.previewWrapper}>
        {filesPreview.map(file => {
          return <div className={styles.previewFile} key={uuidv4()}>
            <img src={file} alt="File preview" />
          </div>})}
      </div>}
      <Form.Control type="file" accept="image/*" multiple="multiple" onChange={handleChangeFiles}/>
    </>
  );
}