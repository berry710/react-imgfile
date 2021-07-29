"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ItemTypes = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDnd = require("react-dnd");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ItemTypes = exports.ItemTypes = {
  PICTURE: "PICTURE"
};

var PreviewPicture = function PreviewPicture(_ref) {
  var picture = _ref.picture,
      index = _ref.index,
      removeImage = _ref.removeImage,
      moveImage = _ref.moveImage;

  var ref = (0, _react.useRef)(null);

  var _useDrop = (0, _reactDnd.useDrop)({
    accept: ItemTypes.PICTURE,
    collect: function collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      };
    },
    hover: function hover(item, monitor) {
      if (!ref.current) return;
      var dragIndex = item.index;
      var hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveImage(dragIndex, hoverIndex);

      item.index = hoverIndex;
    }
  }),
      _useDrop2 = _slicedToArray(_useDrop, 2),
      handlerId = _useDrop2[0].handlerId,
      drop = _useDrop2[1];

  var _useDrag = (0, _reactDnd.useDrag)({
    type: ItemTypes.PICTURE,
    item: function item() {
      return { picture: picture, index: index };
    },
    collect: function collect(monitor) {
      return {
        isDragging: monitor.isDragging()
      };
    }
  }),
      _useDrag2 = _slicedToArray(_useDrag, 2),
      isDragging = _useDrag2[0].isDragging,
      drag = _useDrag2[1];

  var opacity = isDragging ? 0.5 : 1;
  drag(drop(ref));

  return _react2.default.createElement(
    "div",
    { ref: ref, style: { opacity: opacity }, "data-handler-id": handlerId },
    _react2.default.createElement(
      "div",
      { className: "deleteImage", onClick: removeImage },
      "X"
    ),
    _react2.default.createElement("img", { src: picture, className: "uploadPicture", alt: "preview" })
  );
};

exports.default = PreviewPicture;