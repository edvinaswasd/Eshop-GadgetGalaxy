import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

import "./drop-file-input.css";

import { ImageConfig } from "../../config/ImageConfig";
import uploadImg from "../../assets/cloud-upload-regular-240.png";

const DropFileInput = (props) => {
  const wrapperRef = useRef(null);

  const [fileList, setFileList] = useState([]);
  const [base64FileList, setBase64FileList] = useState([]);

  const onDragEnter = () => wrapperRef.current.classList.add("dragover");

  const onDragLeave = () => wrapperRef.current.classList.remove("dragover");

  const onDrop = () => wrapperRef.current.classList.remove("dragover");

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  let [fileNameList, setFileNameList] = useState([]);
  const onFileDrop = (e) => {
    let check = true;
    const newFile = e.target.files[0];

    if (fileList.length > 0 && fileNameList.includes(newFile.name)) {
      check = false;
    }
    if (newFile && check) {
      const newfileNameList = [...fileNameList, newFile.name];
      setFileNameList(newfileNameList);
      const updatedList = [...fileList, newFile];
      getBase64(newFile).then((result) => {
        const base64Files = [...base64FileList, result];
        setBase64FileList(base64Files);
      });

      setFileList(updatedList);
    }
  };

  useEffect(() => {
    props.onFileChange(base64FileList);
    // eslint-disable-next-line
  }, [base64FileList]);

  const fileRemove = (file) => {
    const updatedList = [...fileList];
    updatedList.splice(fileList.indexOf(file), 1);
    setFileList(updatedList);
    const updatedBase64List = [...base64FileList];
    updatedBase64List.splice(base64FileList.indexOf(file), 1);
    setBase64FileList(updatedBase64List);
    props.onFileChange(base64FileList);
  };

  return (
    <>
      <div
        ref={wrapperRef}
        className="drop-file-input"
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="drop-file-input__label">
          <img src={uploadImg} alt="" />
          <p>Drag & Drop your files here</p>
        </div>
        <input type="file" value="" onChange={onFileDrop} />
      </div>
      {fileList.length > 0 ? (
        <div className="drop-file-preview">
          <p className="drop-file-preview__title">Ready to upload</p>
          {fileList.map((item, index) => (
            <div key={index} className="drop-file-preview__item">
              <img
                src={
                  ImageConfig[item.type.split("/")[1]] || ImageConfig["default"]
                }
                alt=""
              />
              <div className="drop-file-preview__item__info">
                <p>{item.name}</p>
                <p>{item.size}B</p>
              </div>
              <span
                className="drop-file-preview__item__del"
                onClick={() => fileRemove(item)}
              >
                x
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
};

DropFileInput.propTypes = {
  onFileChange: PropTypes.func,
};

export default DropFileInput;
