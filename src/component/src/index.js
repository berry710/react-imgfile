import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import "./index.css";
import UploadIcon from "./UploadIcon.svg";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import PreviewPicture from "./PreviewPicture";
import update from "immutability-helper";

const styles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  width: "100%",
};

const ERROR = {
  NOT_SUPPORTED_EXTENSION: "NOT_SUPPORTED_EXTENSION",
  FILESIZE_TOO_LARGE: "FILESIZE_TOO_LARGE",
};

const ImgFileInput = (props) => {
  const [pictures, setPictures] = useState([...props.defaultImages]);
  const [files, setFiles] = useState([]);
  const [fileErrors, setFileErrors] = useState([]);

  const inputElement = useRef(null);

  useEffect(() => {
    props.onChange(files, pictures);
  }, [files, pictures]);

  /*
	 Check file extension (onDropFile)
	 */
  const hasExtension = (fileName) => {
    const pattern =
      "(" + props.imgExtension.join("|").replace(/\./g, "\\.") + ")$";
    return new RegExp(pattern, "i").test(fileName);
  };

  /*
   Handle file validation
   */
  const onDropFile = (e) => {
    const _files = e.target.files;
    const allFilePromises = [];
    const _fileErrors = [];

    // Iterate over all uploaded files
    for (let i = 0; i < _files.length; i++) {
      let file = _files[i];
      let fileError = {
        name: file.name,
      };
      // Check for file extension
      if (!hasExtension(file.name)) {
        fileError = Object.assign(fileError, {
          type: ERROR.NOT_SUPPORTED_EXTENSION,
        });
        _fileErrors.push(fileError);
        continue;
      }
      // Check for file size
      if (file.size > props.maxFileSize) {
        fileError = Object.assign(fileError, {
          type: ERROR.FILESIZE_TOO_LARGE,
        });
        _fileErrors.push(fileError);
        continue;
      }

      allFilePromises.push(readFile(file));
    }

    setFileErrors(_fileErrors);

    const { singleImage } = props;

    Promise.all(allFilePromises).then((newFilesData) => {
      const dataURLs = singleImage ? [] : pictures.slice();
      const _files = singleImage ? [] : files.slice();

      newFilesData.forEach((newFileData) => {
        dataURLs.push(newFileData.dataURL);
        _files.push(newFileData.file);
      });

      setPictures(dataURLs);
      setFiles(_files);
    });
  };

  const onUploadClick = (e) => {
    e.target.value = null;
  };

  /*
     Read a file and return a promise that when resolved gives the file itself and the data URL
   */
  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      // Read the image via FileReader API and save image result in state.
      reader.onload = function (e) {
        // Add the file name to the data URL
        let dataURL = e.target.result;
        dataURL = dataURL.replace(";base64", `;name=${file.name};base64`);
        resolve({ file, dataURL });
      };

      reader.readAsDataURL(file);
    });
  };

  /*
   Remove the image from state
   */
  const removeImage = (picture) => {
    const removeIndex = pictures.findIndex((e) => e === picture);
    const filteredPictures = pictures.filter(
      (e, index) => index !== removeIndex
    );
    const filteredFiles = files.filter((e, index) => index !== removeIndex);

    setPictures(filteredPictures);
    setFiles(filteredFiles);
  };

  /*
    Sort images while and after dragging
  */
  const moveImage = (dragIndex, hoverIndex) => {
    const dragPicture = pictures[dragIndex];
    const dragFile = files[dragIndex];
    const reorderedPictures = update(pictures, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragPicture],
      ],
    });
    const reorderedFiles = update(files, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragFile],
      ],
    });

    setPictures(reorderedPictures);
    setFiles(reorderedFiles);
  };

  /*
   Check if any errors && render
   */
  const renderErrors = () => {
    return fileErrors.map((fileError, index) => {
      return (
        <div
          className={"errorMessage " + props.errorClass}
          key={index}
          style={props.errorStyle}
        >
          * {fileError.name}{" "}
          {fileError.type === ERROR.FILESIZE_TOO_LARGE
            ? props.fileSizeError
            : props.fileTypeError}
        </div>
      );
    });
  };

  /*
   Render the upload icon
   */
  const renderIcon = () => {
    if (props.withIcon) {
      return <img src={UploadIcon} className='uploadIcon' alt='Upload Icon' />;
    }
  };

  /*
   Render label
   */
  const renderLabel = () => {
    if (props.withLabel) {
      return (
        <p className={props.labelClass} style={props.labelStyles}>
          {props.label}
        </p>
      );
    }
  };

  /*
   Render preview images
   */
  const renderPreview = () => {
    return (
      <div className='uploadPicturesWrapper'>{renderPreviewPictures()}</div>
    );
  };

  const renderPreviewPictures = () => {
    return pictures.map((picture, index) => {
      return (
        <div key={index} className='uploadPictureContainer'>
          <PreviewPicture
            index={index}
            picture={picture}
            removeImage={() => removeImage(picture)}
            moveImage={moveImage}
          />
        </div>
      );
    });
  };

  /*
   On button click, trigger input file to open
   */
  const triggerFileUpload = () => {
    inputElement.current.click();
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={"fileUploader " + props.className} style={props.style}>
        <div className='fileContainer' style={props.fileContainerStyle}>
          {renderIcon()}
          {renderLabel()}
          <div className='errorsContainer'>{renderErrors()}</div>
          <button
            type={props.buttonType}
            className={"chooseFileButton " + props.buttonClassName}
            style={props.buttonStyles}
            onClick={triggerFileUpload}
          >
            {props.buttonText}
          </button>
          <input
            type='file'
            ref={inputElement}
            name={props.name}
            multiple={!props.singleImage}
            onChange={onDropFile}
            onClick={onUploadClick}
            accept={props.accept}
          />
          {renderPreview()}
        </div>
      </div>
    </DndProvider>
  );
};

ImgFileInput.defaultProps = {
  className: "",
  fileContainerStyle: {},
  buttonClassName: "",
  buttonStyles: {},
  accept: "image/*",
  name: "",
  withIcon: true,
  buttonText: "Choose images",
  buttonType: "button",
  withLabel: true,
  label: "Max file size: 5mb, accepted: jpg|gif|png",
  labelStyles: {},
  labelClass: "",
  imgExtension: [".jpg", ".jpeg", ".gif", ".png"],
  maxFileSize: 5242880,
  fileSizeError: " file size is too big",
  fileTypeError: " is not a supported file extension",
  errorClass: "",
  style: {},
  errorStyle: {},
  singleImage: false,
  onChange: () => {},
  defaultImages: [],
};

ImgFileInput.propTypes = {
  style: PropTypes.object,
  fileContainerStyle: PropTypes.object,
  className: PropTypes.string,
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
  buttonClassName: PropTypes.string,
  buttonStyles: PropTypes.object,
  buttonType: PropTypes.string,
  accept: PropTypes.string,
  name: PropTypes.string,
  withIcon: PropTypes.bool,
  buttonText: PropTypes.string,
  withLabel: PropTypes.bool,
  label: PropTypes.string,
  labelStyles: PropTypes.object,
  labelClass: PropTypes.string,
  imgExtension: PropTypes.array,
  maxFileSize: PropTypes.number,
  fileSizeError: PropTypes.string,
  fileTypeError: PropTypes.string,
  errorClass: PropTypes.string,
  errorStyle: PropTypes.object,
  singleImage: PropTypes.bool,
  defaultImages: PropTypes.array,
};

export default ImgFileInput;
