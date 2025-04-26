import 'package:adc_hackathon/utils/validation.dart';
import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';

class NewPasswordState extends Equatable {
  const NewPasswordState({
    this.password = '',
    this.confirmPassword = '',
    this.isLoading = false,
    this.error = '',
  });

  final String password;
  final String confirmPassword;
  bool get isFormComplete =>
      password.isValidPassword && confirmPassword.isValidPassword;
  final bool isLoading;
  final String error;

  NewPasswordState copyWith({
    String? password,
    String? confirmPassword,
    bool? isLoading,
    String? error,
  }) =>
      NewPasswordState(
        password: password ?? this.password,
        confirmPassword: confirmPassword ?? this.confirmPassword,
        isLoading: isLoading ?? this.isLoading,
        error: error ?? this.error,
      );

  @override
  List<Object?> get props => [password, confirmPassword, isLoading, error];

  @override
  bool? get stringify => false;
}

class NewPasswordCubit extends Cubit<NewPasswordState> {
  NewPasswordCubit() : super(const NewPasswordState()) {
    // Initializing form text field controllers
    confirmPasswordController = TextEditingController()
      ..addListener(_updateConfirmPassword);
    passwordController = TextEditingController()..addListener(_updatePassword);
    focusNodes = List.generate(
      2,
      (index) => FocusNode(),
    );
    focusNodes[0].requestFocus();
  }
  late final TextEditingController confirmPasswordController;
  late final TextEditingController passwordController;
  late final List<FocusNode> focusNodes;

  // Updates the state with the current form data
  void _updateConfirmPassword() {
    emit(state.copyWith(confirmPassword: confirmPasswordController.text));
  }

  void _updatePassword() {
    emit(state.copyWith(password: passwordController.text));
  }

  // Function to sign up
  Future<void> logIn() async {}

  @override
  Future<void> close() {
    // Freeing up form text field controllers
    confirmPasswordController
      ..removeListener(_updateConfirmPassword)
      ..dispose();
    passwordController
      ..removeListener(_updatePassword)
      ..dispose();
    return super.close();
  }
}
