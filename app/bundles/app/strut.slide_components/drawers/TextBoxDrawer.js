define(["./AbstractDrawer"], function(AbstractDrawer) {
    var TextBoxDrawer, newlineReg, spaceReg, tagReg;
    newlineReg = /<br>/;
    spaceReg = /&nbsp;/g;
    tagReg = /<[^>]+>|<\/[^>]+>/g;

    return TextBoxDrawer = (function(_super) {

      __extends(TextBoxDrawer, _super);

      function TextBoxDrawer(g2d) {
        AbstractDrawer.apply(this, arguments);
        this.g2d = g2d;
      }

      TextBoxDrawer.prototype.paint = function(textBox) {
        var bbox, lineHeight, lines, text, txtWidth,
          _this = this;
        this.g2d.fillStyle = "#" + textBox.get("color");
        lineHeight = textBox.get("size") * this.scale.y;
        this.g2d.font = lineHeight + "px " + textBox.get("family");
        text = this._convertSpaces(textBox.get("text"));
        lines = this._extractLines(text);
        txtWidth = this._findWidestWidth(lines) * this.scale.x;
        txtWidth *= 3;
        bbox = {
          x: textBox.get("x") * this.scale.x,
          y: textBox.get("y") * this.scale.y + lineHeight * this.scale.y,
          width: txtWidth,
          height: lineHeight * lines.length * this.scale.y
        };

        this.applyTransforms(textBox, bbox);
        lines.forEach(function(line, i) {
         this._renderLine(line, i, bbox, lineHeight);
        }, this);
      };

      TextBoxDrawer.prototype._renderLine = function(line, cnt, bbox, lineHeight) {
         if (line !== "") {
            line = line.replace(tagReg, "");
            this.g2d.fillText(line, bbox.x, bbox.y + bbox.height + cnt * lineHeight);
            ++cnt;
          }
      };

      TextBoxDrawer.prototype._extractLines = function(text) {
        return text.split(newlineReg);
      };

      TextBoxDrawer.prototype._convertSpaces = function(text) {
        return text.replace(spaceReg, " ");
      };

      TextBoxDrawer.prototype._findWidestWidth = function(lines) {
        var widestWidth,
          _this = this;
        widestWidth = 0;
        lines.forEach(function(line) {
          var width;
          width = _this.g2d.measureText(line.replace(tagReg, "")).width;
          if (width > widestWidth) {
             widestWidth = width;
          }
        });
        return widestWidth;
      };

      return TextBoxDrawer;

    })(AbstractDrawer);
  });
