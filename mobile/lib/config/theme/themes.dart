import 'package:flutter/material.dart';

import 'colors.dart';

class AppTheme {
  AppTheme._(); // Prevent instantiation

  // Light Theme
  static final ThemeData lightTheme = ThemeData(
    brightness: Brightness.light,
    primaryColor: AppColors.primary,
    scaffoldBackgroundColor: AppColors.background,
    canvasColor: AppColors.background,
    appBarTheme: _appBarTheme,
    elevatedButtonTheme: _elevatedButtonTheme,
    outlinedButtonTheme: _outlinedButtonTheme,
    inputDecorationTheme: _inputDecorationTheme,
    textTheme: _textTheme,
    cardTheme: _cardTheme,
    bottomNavigationBarTheme: _bottomNavBarThemeLight,
    floatingActionButtonTheme: _floatingActionButtonThemeDataLight,
    iconTheme: _iconThemeLight,
  );

  // Dark Theme
  static final ThemeData darkTheme = ThemeData(
    brightness: Brightness.dark,
    primaryColor: AppColors.primary,
    scaffoldBackgroundColor: AppColors.darkBackground,
    appBarTheme: _appBarThemeDark,
    elevatedButtonTheme: _elevatedButtonTheme,
    outlinedButtonTheme: _outlinedButtonTheme,
    inputDecorationTheme: _inputDecorationThemeDark,
    textTheme: _textThemeDark,
    cardTheme: _cardThemeDark,
    bottomNavigationBarTheme: _bottomNavBarThemeDark,
    iconTheme: _iconThemeDark,
  );

  // AppBar Theme (Light & Dark)
  static const AppBarTheme _appBarTheme = AppBarTheme(
    backgroundColor: AppColors.primary,
    foregroundColor: Colors.white,
    elevation: 0,
    centerTitle: true,
  );

  static const AppBarTheme _appBarThemeDark = AppBarTheme(
    backgroundColor: AppColors.darkSurface,
    foregroundColor: Colors.white,
    elevation: 0,
    centerTitle: true,
  );

  // Button Themes
  static final ElevatedButtonThemeData _elevatedButtonTheme =
      ElevatedButtonThemeData(
    style: ElevatedButton.styleFrom(
      backgroundColor: AppColors.primary,
      foregroundColor: Colors.white,
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
    ),
  );

  static final OutlinedButtonThemeData _outlinedButtonTheme =
      OutlinedButtonThemeData(
    style: OutlinedButton.styleFrom(
      foregroundColor: AppColors.primary,
      side: const BorderSide(color: AppColors.primary, width: 2),
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
    ),
  );

  // Text Themes (Light & Dark)
  static const TextTheme _textTheme = TextTheme(
    headlineLarge: TextStyle(
        fontSize: 24,
        fontWeight: FontWeight.bold,
        color: AppColors.textPrimary),
    headlineMedium: TextStyle(
        fontSize: 20,
        fontWeight: FontWeight.w600,
        color: AppColors.textPrimary),
    bodyLarge: TextStyle(
        fontSize: 16,
        fontWeight: FontWeight.w400,
        color: AppColors.textPrimary),
    bodyMedium: TextStyle(
        fontSize: 14,
        fontWeight: FontWeight.w400,
        color: AppColors.textSecondary),
  );

  // FloatingActionButtonTHeme
  static const FloatingActionButtonThemeData
      _floatingActionButtonThemeDataLight = FloatingActionButtonThemeData(
    backgroundColor: AppColors.primary,
    foregroundColor: AppColors.background,
  );

  static const TextTheme _textThemeDark = TextTheme(
    headlineLarge: TextStyle(
        fontSize: 24, fontWeight: FontWeight.bold, color: AppColors.darkText),
    headlineMedium: TextStyle(
        fontSize: 20, fontWeight: FontWeight.w600, color: AppColors.darkText),
    bodyLarge: TextStyle(
        fontSize: 16, fontWeight: FontWeight.w400, color: AppColors.darkText),
    bodyMedium: TextStyle(
        fontSize: 14, fontWeight: FontWeight.w400, color: AppColors.darkIcon),
  );

  // Text Field (InputDecoration) Themes
  static final InputDecorationTheme _inputDecorationTheme =
      InputDecorationTheme(
    filled: true,
    fillColor: AppColors.surface,
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: BorderSide.none,
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: const BorderSide(color: AppColors.primary, width: 2),
    ),
    hintStyle: const TextStyle(color: AppColors.textSecondary),
  );

  static final InputDecorationTheme _inputDecorationThemeDark =
      InputDecorationTheme(
    filled: true,
    fillColor: AppColors.darkSurface,
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: BorderSide.none,
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: const BorderSide(color: AppColors.primary, width: 2),
    ),
    hintStyle: const TextStyle(color: AppColors.darkIcon),
  );

  // Card Theme (Light & Dark)
  static final CardTheme _cardTheme = CardTheme(
    color: AppColors.surface,
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
    elevation: 3,
  );

  static final CardTheme _cardThemeDark = CardTheme(
    color: AppColors.darkSurface,
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
    elevation: 3,
  );

  // Bottom Navigation Bar Theme (Light & Dark)
  static const BottomNavigationBarThemeData _bottomNavBarThemeLight =
      BottomNavigationBarThemeData(
    backgroundColor: AppColors.background,
    selectedItemColor: AppColors.primary,
    unselectedItemColor: AppColors.textSecondary,
    elevation: 5,
  );

  static const BottomNavigationBarThemeData _bottomNavBarThemeDark =
      BottomNavigationBarThemeData(
    backgroundColor: AppColors.darkSurface,
    selectedItemColor: AppColors.primary,
    unselectedItemColor: AppColors.darkIcon,
    elevation: 5,
  );

  static const IconThemeData _iconThemeLight = IconThemeData(
    color: AppColors.textPrimary,
  );

  static const IconThemeData _iconThemeDark = IconThemeData(
    color: AppColors.darkIcon,
  );
}
