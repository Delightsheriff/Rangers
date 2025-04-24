import 'package:adc_hackathon/config/theme/colors.dart';
import 'package:flutter/material.dart';

void showErrorSnackBar(BuildContext context, String message) {
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      content: Center(
          child: Text(
        message,
        textAlign: TextAlign.center,
      )),
      backgroundColor: AppColors.error,
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(5),
      ),
      duration: const Duration(seconds: 3),
    ),
  );
}
