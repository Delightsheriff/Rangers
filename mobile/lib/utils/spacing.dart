import 'package:flutter/material.dart';

extension Spacing on num {
  // Returns a SizedBox with the width set as the value
  SizedBox get w => SizedBox(
        width: toDouble(),
      );
  // Returns a SizedBox with the height set as the value
  SizedBox get h => SizedBox(
        height: toDouble(),
      );
}
