import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';

class OtpState extends Equatable {
  const OtpState({
    this.otp = '',
    this.isLoading = false,
    this.isDone = false,
    this.error = '',
  });

  final String otp;
  bool get isFormComplete => otp.length == 4;
  final bool isLoading;
  final bool isDone;
  final String error;

  OtpState copyWith({
    String? otp,
    bool? isLoading,
    bool? isDone,
    String? error,
  }) =>
      OtpState(
        otp: otp ?? this.otp,
        isLoading: isLoading ?? this.isLoading,
        error: error ?? this.error,
        isDone: isDone ?? this.isDone,
      );

  @override
  List<Object?> get props => [otp, isLoading, error];

  @override
  bool? get stringify => false;
}

class OtpCubit extends Cubit<OtpState> {
  OtpCubit(
      // this._authRepository
      )
      : super(const OtpState()) {
    // Initializing form text field controllers
    focusNode = FocusNode();
  }
  // final AuthRepository _authRepository;
  late final FocusNode focusNode;
  final int otpLength = 4;

  // Updates the state with the current form data
  void updateOTP(String otp) {
    emit(
      state.copyWith(
        otp: otp,
      ),
    );
  }

  // Function to resend otp
  Future<void> resendOTP() async {
    emit(state.copyWith(isLoading: true, error: ''));
    try {
      await Future.delayed(const Duration(seconds: 3));
      // Call the sign up function from the repository
      // await _authRepository.signUp(state.email, state.password);
      emit(state.copyWith(isLoading: false));
    } catch (e) {
      // If there is an error, update the state with the error message
      emit(state.copyWith(isLoading: false, error: e.toString()));
    }
  }

  Future<void> authenticateOTP() async {
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
    focusNode.dispose();
    return super.close();
  }
}
