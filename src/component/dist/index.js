"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

require("./index.css");

var _UploadIcon = require("./UploadIcon.svg");

var _UploadIcon2 = _interopRequireDefault(_UploadIcon);

var _reactDnd = require("react-dnd");

var _reactDndHtml5Backend = require("react-dnd-html5-backend");

var _PreviewPicture = require("./PreviewPicture");

var _PreviewPicture2 = _interopRequireDefault(_PreviewPicture);

var _immutabilityHelper = require("immutability-helper");

var _immutabilityHelper2 = _interopRequireDefault(_immutabilityHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var styles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  width: "100%"
};

var ERROR = {
  NOT_SUPPORTED_EXTENSION: "NOT_SUPPORTED_EXTENSION",
  FILESIZE_TOO_LARGE: "FILESIZE_TOO_LARGE"
};

var ImgFileInput = function ImgFileInput(props) {
  var _useState = (0, _react.useState)([].concat(_toConsumableArray(props.defaultImages))),
      _useState2 = _slicedToArray(_useState, 2),
      pictures = _useState2[0],
      setPictures = _useState2[1];

  var _useState3 = (0, _react.useState)([]),
      _useState4 = _slicedToArray(_useState3, 2),
      files = _useState4[0],
      setFiles = _useState4[1];

  var _useState5 = (0, _react.useState)([]),
      _useState6 = _slicedToArray(_useState5, 2),
      fileErrors = _useState6[0],
      setFileErrors = _useState6[1];

  var inputElement = (0, _react.useRef)(null);

  (0, _react.useEffect)(function () {
    props.onChange(files, pictures);
  }, [files, pictures]);

  /*
  Check file extension (onDropFile)
  */
  var hasExtension = function hasExtension(fileName) {
    var pattern = "(" + props.imgExtension.join("|").replace(/\./g, "\\.") + ")$";
    return new RegExp(pattern, "i").test(fileName);
  };

  /*
   Handle file validation
   */
  var onDropFile = function onDropFile(e) {
    var _files = e.target.files;
    var allFilePromises = [];
    var _fileErrors = [];

    // Iterate over all uploaded files
    for (var i = 0; i < _files.length; i++) {
      var file = _files[i];
      var fileError = {
        name: file.name
      };
      // Check for file extension
      if (!hasExtension(file.name)) {
        fileError = Object.assign(fileError, {
          type: ERROR.NOT_SUPPORTED_EXTENSION
        });
        _fileErrors.push(fileError);
        continue;
      }
      // Check for file size
      if (file.size > props.maxFileSize) {
        fileError = Object.assign(fileError, {
          type: ERROR.FILESIZE_TOO_LARGE
        });
        _fileErrors.push(fileError);
        continue;
      }

      allFilePromises.push(readFile(file));
    }

    setFileErrors(_fileErrors);

    var singleImage = props.singleImage;


    Promise.all(allFilePromises).then(function (newFilesData) {
      var dataURLs = singleImage ? [] : pictures.slice();
      var _files = singleImage ? [] : files.slice();

      newFilesData.forEach(function (newFileData) {
        dataURLs.push(newFileData.dataURL);
        _files.push(newFileData.file);
      });

      setPictures(dataURLs);
      setFiles(_files);
    });
  };

  var onUploadClick = function onUploadClick(e) {
    e.target.value = null;
  };

  /*
     Read a file and return a promise that when resolved gives the file itself and the data URL
   */
  var readFile = function readFile(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();

      // Read the image via FileReader API and save image result in state.
      reader.onload = function (e) {
        // Add the file name to the data URL
        var dataURL = e.target.result;
        dataURL = dataURL.replace(";base64", ";name=" + file.name + ";base64");
        resolve({ file: file, dataURL: dataURL });
      };

      reader.readAsDataURL(file);
    });
  };

  /*
   Remove the image from state
   */
  var _removeImage = function _removeImage(picture) {
    var removeIndex = pictures.findIndex(function (e) {
      return e === picture;
    });
    var filteredPictures = pictures.filter(function (e, index) {
      return index !== removeIndex;
    });
    var filteredFiles = files.filter(function (e, index) {
      return index !== removeIndex;
    });

    setPictures(filteredPictures);
    setFiles(filteredFiles);
  };

  /*
    Sort images while and after dragging
  */
  var moveImage = function moveImage(dragIndex, hoverIndex) {
    var dragPicture = pictures[dragIndex];
    var dragFile = files[dragIndex];
    var reorderedPictures = (0, _immutabilityHelper2.default)(pictures, {
      $splice: [[dragIndex, 1], [hoverIndex, 0, dragPicture]]
    });
    var reorderedFiles = (0, _immutabilityHelper2.default)(files, {
      $splice: [[dragIndex, 1], [hoverIndex, 0, dragFile]]
    });

    setPictures(reorderedPictures);
    setFiles(reorderedFiles);
  };

  /*
   Check if any errors && render
   */
  var renderErrors = function renderErrors() {
    return fileErrors.map(function (fileError, index) {
      return _react2.default.createElement(
        "div",
        {
          className: "errorMessage " + props.errorClass,
          key: index,
          style: props.errorStyle
        },
        "* ",
        fileError.name,
        " ",
        fileError.type === ERROR.FILESIZE_TOO_LARGE ? props.fileSizeError : props.fileTypeError
      );
    });
  };

  /*
   Render the upload icon
   */
  var renderIcon = function renderIcon() {
    if (props.withIcon) {
      return _react2.default.createElement("img", { src: _UploadIcon2.default, className: "uploadIcon", alt: "Upload Icon" });
    }
  };

  /*
   Render label
   */
  var renderLabel = function renderLabel() {
    if (props.withLabel) {
      return _react2.default.createElement(
        "p",
        { className: props.labelClass, style: props.labelStyles },
        props.label
      );
    }
  };

  /*
   Render preview images
   */
  var renderPreview = function renderPreview() {
    return _react2.default.createElement(
      "div",
      { className: "uploadPicturesWrapper" },
      renderPreviewPictures()
    );
  };

  var renderPreviewPictures = function renderPreviewPictures() {
    return pictures.map(function (picture, index) {
      return _react2.default.createElement(
        "div",
        { key: index, className: "uploadPictureContainer" },
        _react2.default.createElement(_PreviewPicture2.default, {
          index: index,
          picture: picture,
          removeImage: function removeImage() {
            return _removeImage(picture);
          },
          moveImage: moveImage
        })
      );
    });
  };

  /*
   On button click, trigger input file to open
   */
  var triggerFileUpload = function triggerFileUpload() {
    inputElement.current.click();
  };

  return _react2.default.createElement(
    _reactDnd.DndProvider,
    { backend: _reactDndHtml5Backend.HTML5Backend },
    _react2.default.createElement(
      "div",
      { className: "fileUploader " + props.className, style: props.style },
      _react2.default.createElement(
        "div",
        { className: "fileContainer", style: props.fileContainerStyle },
        renderIcon(),
        renderLabel(),
        _react2.default.createElement(
          "div",
          { className: "errorsContainer" },
          renderErrors()
        ),
        _react2.default.createElement(
          "button",
          {
            type: props.buttonType,
            className: "chooseFileButton " + props.buttonClassName,
            style: props.buttonStyles,
            onClick: triggerFileUpload
          },
          props.buttonText
        ),
        _react2.default.createElement("input", {
          type: "file",
          ref: inputElement,
          name: props.name,
          multiple: !props.singleImage,
          onChange: onDropFile,
          onClick: onUploadClick,
          accept: props.accept
        }),
        renderPreview()
      )
    )
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
  onChange: function onChange() {},
  defaultImages: []
};

ImgFileInput.propTypes = {
  style: _propTypes2.default.object,
  fileContainerStyle: _propTypes2.default.object,
  className: _propTypes2.default.string,
  onChange: _propTypes2.default.func,
  onDelete: _propTypes2.default.func,
  buttonClassName: _propTypes2.default.string,
  buttonStyles: _propTypes2.default.object,
  buttonType: _propTypes2.default.string,
  accept: _propTypes2.default.string,
  name: _propTypes2.default.string,
  withIcon: _propTypes2.default.bool,
  buttonText: _propTypes2.default.string,
  withLabel: _propTypes2.default.bool,
  label: _propTypes2.default.string,
  labelStyles: _propTypes2.default.object,
  labelClass: _propTypes2.default.string,
  imgExtension: _propTypes2.default.array,
  maxFileSize: _propTypes2.default.number,
  fileSizeError: _propTypes2.default.string,
  fileTypeError: _propTypes2.default.string,
  errorClass: _propTypes2.default.string,
  errorStyle: _propTypes2.default.object,
  singleImage: _propTypes2.default.bool,
  defaultImages: _propTypes2.default.array
};

exports.default = ImgFileInput;