import 'package:adc_hackathon/utils/validation.dart';
import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';

import '../../../core/apihandler/error_response.dart';
import '../../../core/auth/auth_repository.dart';
import '../auth_bloc/auth_bloc.dart';

class LogInState extends Equatable {
  const LogInState({
    this.email = '',
    this.password = '',
    this.isDone = false,
    this.isLoading = false,
  });

  final String email;
  final String password;
  bool get isFormComplete => email.isValidEmail && password.isValidPassword;
  final bool isLoading;
  final bool isDone;

  LogInState copyWith({
    String? email,
    String? password,
    bool? isLoading,
    bool? isDone,
  }) =>
      LogInState(
        email: email ?? this.email,
        password: password ?? this.password,
        isDone: isDone ?? this.isDone,
        isLoading: isLoading ?? this.isLoading,
      );

  @override
  List<Object?> get props => [email, password, isLoading];

  @override
  bool? get stringify => false;
}

class LogInCubit extends Cubit<LogInState> {
  LogInCubit(this._authRepository, this._authBloc) : super(const LogInState()) {
    // Initializing form text field controllers
    emailController = TextEditingController()..addListener(_updateEmail);
    passwordController = TextEditingController()..addListener(_updatePassword);
    focusNodes = List.generate(
      2,
      (index) => FocusNode(),
    );
    WidgetsBinding.instance
        .addPostFrameCallback((_) => focusNodes[0].requestFocus());
  }
  final AuthRepository _authRepository;
  final AuthBloc _authBloc;
  late final TextEditingController emailController;
  late final TextEditingController passwordController;
  late final List<FocusNode> focusNodes;

  // Updates the state with the current form data
  void _updateEmail() {
    emit(state.copyWith(email: emailController.text));
  }

  void _updatePassword() {
    emit(state.copyWith(password: passwordController.text));
  }

  // Function to sign up
  Future<void> logIn() async {
    emit(state.copyWith(isLoading: true));
    try {
      final user = await _authRepository.login(
        state.email,
        state.password,
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
    return super.close();
  }
}
