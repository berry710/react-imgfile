# Image file uploader UI component

Simple component for upload and validate (client side) images with preview built with React.js.
This package use [react-flip-move](https://github.com/joshwcomeau/react-flip-move) for animate the file preview images.
Also, this package use [react-dnd](https://github.com/react-dnd/react-dnd) for drag and drop sorting among preview images.

## Installation

```bash
npm install react-imgfile
```

## Usage

```javascript
import React, { useState } from "react";
import ImgFileInput from "react-imgfile";

function App = (props) => {
  const [files, setFiles] = useState([])

  const onChange = (files, pictures) => {
    console.log(pictures) // Array of base64 data
    setFiles([...files]) // Array of file objects for FormData
  }

  return (
    <ImgFileInput
      buttonText='Choose images'
      onChange={onChange}
      maxFileSize={5242880}
    />
  );
}
```

### Available Options

|     parameter      |   type   |                    default                    | description                                                   |
| :----------------: | :------: | :-------------------------------------------: | :------------------------------------------------------------ |
|     className      |  String  |                       -                       | Class name for the input.                                     |
| fileContainerStyle |  Object  |                       -                       | Inline styles for the file container.                         |
|      onChange      | Function |                       -                       | On change handler for the input.                              |
|  buttonClassName   |  String  |                       -                       | Class name for upload button.                                 |
|    buttonStyles    |  Object  |                       -                       | Inline styles for upload button.                              |
|       accept       |  String  |                  "image/\*"                   | Accept attribute for file input.                              |
|        name        |  String  |                       -                       | Input name.                                                   |
|      withIcon      | Boolean  |                     true                      | If true, show upload icon on top                              |
|     buttonText     |  String  |                "Choose images"                | The text that display in the button.                          |
|     withLabel      | Boolean  |                     true                      | Show instruction label                                        |
|       label        |  String  | "Max file size: 5mb, accepted: jpg\|gif\|png" | Label text                                                    |
|    labelStyles     |  Object  |                       -                       | Inline styles for the label.                                  |
|     labelClass     |  string  |                       -                       | Class name for the label                                      |
|    imgExtension    |  Array   |       ['.jpg', '.jpeg', '.gif', '.png']       | Supported image extension (will use in the image validation). |
|    maxFileSize     |  Number  |                    5242880                    | Max image size.                                               |
|   fileSizeError    |  String  |            " file size is too big"            | Label for file size error message.                            |
|   fileTypeError    |  String  |      " is not supported file extension"       | Label for file extension error message.                       |
|     errorClass     |  String  |                       -                       | Class for error messages                                      |
|     errorStyle     |  Object  |                       -                       | Inline styles for errors                                      |
|    singleImage     | Boolean  |                     false                     | If true, only a single image can be selected                  |
|   defaultImages    |  Array   |                       -                       | Pre-populate with default images.                             |

## Attribution

This package was originally forked from [react-images-upload](https://github.com/JakeHartnell/react-images-upload).

### License

MIT
