import 'package:flutter/material.dart';

Offset getPos(GlobalKey key) {
  final renderObject = key.currentContext?.findRenderObject();
  var offset = Offset.zero;
  if (renderObject != null) {
    final renderBox = renderObject as RenderBox;
    offset =
        renderBox.localToGlobal(Offset.zero).translate(renderBox.size.width, 0);
  }
  return offset;
}

Size getSize(GlobalKey key) {
  final renderObject = key.currentContext?.findRenderObject();
  var size = Size.zero;
  if (renderObject != null) {
    final renderBox = renderObject as RenderBox;
    size = renderBox.size;
  }
  return size;
}
