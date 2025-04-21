import 'package:flutter/material.dart';

class AppColors {
  AppColors._(); // Prevent instantiation

  // Primary Colors
  static const Color primary = Color(0xFF000000);
  static const Color secondary = Color(0xFFFFFFFF);

  // Neutral Colors
  static const Color background = Color(0xFFFFFFFF);
  static const Color surface = Color(0xFFF7F7F7);
  static const Color border = Color(0xFFE0E0E0);

  // Text Colors
  static const Color textPrimary = Color(0xFF212121);
  static const Color textSecondary = Color(0xFF757575);

  // Status Colors
  static const Color error = Color(0xFFD32F2F);
  static const Color success = Color(0xFF388E3C);
  static const Color warning = Color(0xFFFFA000);

  // Dark Mode Colors
  static const Color darkBackground = Color(0xFF121212);
  static const Color darkSurface = Color(0xFF1E1E1E);
  static const Color darkText = Color(0xFFFFFFFF);
  static const Color darkIcon = Color(0xFFBDBDBD);

  // Miscellaneous Colors
  static const Color disabled = Color(0xFFEAEAEA);
  static const Color disabledDark = Color(0xFFB5B5B5);

  // Overlay Colors
  static const Color overlayPrimary = Color(0x33F7F7F7);
}
