extension Validation on String {
  bool get isValidEmail {
    final emailRegExp =
        RegExp(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');
    return emailRegExp.hasMatch(this);
  }

  bool get isValidPassword {
    return isNotEmpty && length >= 6;
  }

  String get validationError {
    var error = '';
    if (isEmpty) {
      error = 'Please provide a password';
    } else {
      error = 'Your password must be at least 6 characters';
    }
    return error;
  }
}
