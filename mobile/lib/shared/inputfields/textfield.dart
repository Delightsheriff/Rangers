import 'package:adc_hackathon/utils/debouncer.dart';
import 'package:adc_hackathon/utils/enums.dart';
import 'package:adc_hackathon/utils/validation.dart';
import 'package:flutter/material.dart';

import '../../config/theme/colors.dart';

class AppTextField extends StatefulWidget {
  const AppTextField({
    required this.hintText,
    super.key,
    this.controller,
    this.keyboardType = TextInputType.text,
    this.action = TextInputAction.next,
    this.isPassword = false,
    this.prefixIcon,
    this.validator,
    this.fieldValidation,
    this.isDisabled,
    this.focusNode,
  });
  final String hintText;
  final TextInputAction action;
  final TextEditingController? controller;
  final TextInputType keyboardType;
  final bool isPassword;
  final bool? isDisabled;
  final IconData? prefixIcon;
  final FormFieldValidator<String>? validator;
  final FieldValidation? fieldValidation;
  final FocusNode? focusNode;

  @override
  State<AppTextField> createState() => _AppTextFieldState();
}

class _AppTextFieldState extends State<AppTextField> {
  bool _hasUserTyped = false;
  bool showPassword = false;
  String? _errorText;
  final _debouncer = Debouncer();

  // Validation Method to validate email and password field
  void validation() {
    if (widget.controller != null && widget.fieldValidation != null) {
      setState(() {
        _errorText = null;
      });
      _debouncer.run(() {
        // Resets the error text if user hasn't typed anything
        if (!_hasUserTyped) {
          setState(() {
            _errorText = null;
          });
        }

        final text = widget.controller!.text;

        switch (widget.fieldValidation!) {
          case FieldValidation.email:
            if (text.isValidEmail) {
              _errorText = null;
            } else {
              _errorText = 'Please provide a valid email address';
            }
          case FieldValidation.password:
            if (text.isValidPassword) {
              _errorText = null;
            } else {
              _errorText = text.validationError;
            }
          case FieldValidation.required:
            if (text.isNotEmpty) {
              _errorText = null;
            } else {
              _errorText = 'This field cannot be empty';
            }
        }
        if (widget.validator != null &&
            widget.validator!(text) != null &&
            _errorText == null) {
          _errorText = widget.validator!(text);
        }

        setState(() {});
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: widget.controller,
      keyboardType: widget.keyboardType,
      obscureText: widget.isPassword && !showPassword,
      cursorColor: AppColors.primary,
      enabled: !(widget.isDisabled ?? false),
      focusNode: widget.focusNode,
      textInputAction: widget.action,
      decoration: InputDecoration(
        errorText: _errorText,
        errorStyle: TextStyle(color: Colors.red),
        hintText: widget.hintText,
        hintStyle: TextStyle(fontSize: 14),
        prefixIcon: widget.prefixIcon != null
            ? Icon(widget.prefixIcon, color: AppColors.textSecondary)
            : null,
        suffixIcon: SizedBox.shrink(
          child: GestureDetector(
            onTap: () {
              setState(() {
                showPassword = !showPassword;
              });
            },
            child: widget.isPassword
                ? showPassword
                    ? Icon(
                        Icons.visibility_outlined,
                        color: AppColors.textSecondary,
                      )
                    : Icon(
                        Icons.visibility_off_outlined,
                        color: AppColors.textSecondary,
                      )
                : null,
          ),
        ),
        filled: true,
        fillColor: AppColors.surface,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide.none,
        ),
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      ),
      onChanged: (text) {
        validation();
        setState(() {
          _hasUserTyped = !_hasUserTyped;
        });
      },
    );
  }
}
