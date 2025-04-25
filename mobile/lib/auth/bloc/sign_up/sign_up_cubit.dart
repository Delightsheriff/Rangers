import 'package:adc_hackathon/auth/bloc/auth_bloc/auth_bloc.dart';
import 'package:adc_hackathon/core/apihandler/error_response.dart';
import 'package:adc_hackathon/utils/validation.dart';
import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../../core/auth/auth_repository.dart';

class SignUpState extends Equatable {
  const SignUpState({
    this.firstName = '',
    this.lastName = '',
    this.email = '',
    this.password = '',
    this.confirmPassword = '',
    this.isLoading = false,
    this.isDone = false,
  });

  final String firstName;
  final String lastName;
  final String email;
  final String password;
  final String confirmPassword;
  bool get isFormComplete =>
      firstName.isNotEmpty &&
      lastName.isNotEmpty &&
      email.isValidEmail &&
      password.isValidPassword &&
      confirmPassword == password;
  final bool isDone;
  final bool isLoading;

  SignUpState copyWith({
    String? firstName,
    String? lastName,
    String? email,
    String? password,
    String? confirmPassword,
    bool? isLoading,
  }) =>
      SignUpState(
        firstName: firstName ?? this.firstName,
        lastName: lastName ?? this.lastName,
        email: email ?? this.email,
        password: password ?? this.password,
        confirmPassword: confirmPassword ?? this.confirmPassword,
        isLoading: isLoading ?? this.isLoading,
      );

  @override
  List<Object?> get props =>
      [firstName, lastName, email, password, confirmPassword, isLoading];

  @override
  bool? get stringify => false;
}

class SignUpCubit extends Cubit<SignUpState> {
  SignUpCubit(this._authRepository, this._authBloc)
      : super(const SignUpState()) {
    // Initializing form text field controller
    firstNameController = TextEditingController()
      ..addListener(_updateFirstName);
    lastNameController = TextEditingController()..addListener(_updateLastName);
    emailController = TextEditingController()..addListener(_updateEmail);
    passwordController = TextEditingController()..addListener(_updatePassword);
    confirmPasswordController = TextEditingController()
      ..addListener(_updateConfirmPassword);
    focusNodes = List.generate(
      5,
      (index) => FocusNode(),
    );
    WidgetsBinding.instance
        .addPostFrameCallback((_) => focusNodes[0].requestFocus());
  }
  final AuthRepository _authRepository;
  final AuthBloc _authBloc;
  late final TextEditingController firstNameController;
  late final TextEditingController lastNameController;
  late final TextEditingController emailController;
  late final TextEditingController passwordController;
  late final TextEditingController confirmPasswordController;
  late final List<FocusNode> focusNodes;

  // Updates the state with the current form data
  void _updateFirstName() {
    emit(state.copyWith(
        firstName: toBeginningOfSentenceCase(firstNameController.text) ?? ''));
  }

  void _updateLastName() {
    emit(state.copyWith(
        lastName: toBeginningOfSentenceCase(lastNameController.text) ?? ''));
  }

  void _updateEmail() {
    emit(state.copyWith(email: emailController.text));
  }

  void _updatePassword() {
    emit(state.copyWith(password: passwordController.text));
  }

  void _updateConfirmPassword() {
    emit(state.copyWith(confirmPassword: confirmPasswordController.text));
  }

  // Function to sign up
  Future<void> signUp() async {
    emit(state.copyWith(isLoading: true));
    try {
      final user = await _authRepository.signUp(
        firstName: state.firstName,
        lastName: state.lastName,
        email: state.email,
        password: state.password,
      );
      _authBloc.add(AuthLogIn(user));
      emit(state.copyWith(isLoading: false));
    } catch (e) {
      // If there is an error, update the state with the error message
      emit(
        state.copyWith(
          isLoading: false,
        ),
      );
      _authBloc
        ..add(AuthError(e is ApiError ? e.errorMessage : e.toString()))
        ..add(AuthClear());
    }
  }

  @override
  Future<void> close() {
    // Freeing up form text field controllers
    emailController
      ..removeListener(_updateEmail)
      ..dispose();
    passwordController
      ..removeListener(_updatePassword)
      ..dispose();
    confirmPasswordController
      ..removeListener(_updateConfirmPassword)
      ..dispose();
    return super.close();
  }
}
