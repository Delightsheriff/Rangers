import 'package:adc_hackathon/utils/validation.dart';
import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';

class ForgotPasswordState extends Equatable {
  const ForgotPasswordState({
    this.email = '',
    this.isLoading = false,
    this.isDone = false,
    this.error = '',
  });

  final String email;
  bool get isFormComplete => email.isValidEmail;
  final bool isLoading;
  final bool isDone;
  final String error;

  ForgotPasswordState copyWith({
    String? email,
    bool? isLoading,
    bool? isDone,
    String? error,
  }) =>
      ForgotPasswordState(
        email: email ?? this.email,
        isLoading: isLoading ?? this.isLoading,
        error: error ?? this.error,
        isDone: isDone ?? this.isDone,
      );

  @override
  List<Object?> get props => [email, isLoading, error];

  @override
  bool? get stringify => false;
}

class ForgotPasswordCubit extends Cubit<ForgotPasswordState> {
  ForgotPasswordCubit(
      // this._authRepository
      )
      : super(const ForgotPasswordState()) {
    // Initializing form text field controllers
    emailController = TextEditingController()..addListener(_updateEmail);
    focusNodes = List.generate(
      1,
      (index) => FocusNode(),
    );
    focusNodes[0].requestFocus();
  }
  // final AuthRepository _authRepository;
  late final TextEditingController emailController;
  late final List<FocusNode> focusNodes;

  // Updates the state with the current form data
  void _updateEmail() {
    emit(state.copyWith(email: emailController.text));
  }

  // Function to sign up
  Future<void> sendOTP() async {
    emit(state.copyWith(isLoading: true, error: ''));
    try {
      await Future.delayed(const Duration(seconds: 3));
      // Call the sign up function from the repository
      // await _authRepository.signUp(state.email, state.password);
      emit(state.copyWith(isLoading: false, isDone: true));
    } catch (e) {
      // If there is an error, update the state with the error message
      emit(state.copyWith(isLoading: false, error: e.toString()));
    }
  }

  @override
  Future<void> close() {
    // Freeing up form text field controllers
    emailController
      ..removeListener(_updateEmail)
      ..dispose();
    return super.close();
  }
}
