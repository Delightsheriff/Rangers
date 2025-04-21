import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';

class InfoState extends Equatable {
  const InfoState({
    this.name = '',
    this.isLoading = false,
    this.isDone = false,
    this.error = '',
  });

  final String name;
  bool get isFormComplete => name.isNotEmpty;
  final bool isLoading;
  final bool isDone;
  final String error;

  InfoState copyWith({
    String? name,
    bool? isDone,
    bool? isLoading,
    String? error,
  }) =>
      InfoState(
        name: name ?? this.name,
        isDone: isDone ?? this.isDone,
        isLoading: isLoading ?? this.isLoading,
        error: error ?? this.error,
      );

  @override
  List<Object?> get props => [name, isLoading, error];

  @override
  bool? get stringify => false;
}

class InfoCubit extends Cubit<InfoState> {
  InfoCubit() : super(const InfoState()) {
    // Initializing form text field controllers
    nameController = TextEditingController()..addListener(_updateName);
    focusNodes = List.generate(
      1,
      (index) => FocusNode(),
    );
    focusNodes[0].requestFocus();
  }
  late final TextEditingController nameController;
  late final List<FocusNode> focusNodes;

  // Updates the state with the current form data
  void _updateName() {
    emit(state.copyWith(name: nameController.text));
  }

  // Function to sign up
  Future<void> submit() async {
    emit(state.copyWith(isLoading: true, error: ''));
    try {
      await Future.delayed(const Duration(seconds: 3));
      // Call the submit function from the repository
      // await _authRepository.submitInfo(state.email, state.password);
      emit(state.copyWith(isLoading: false, isDone: true));
    } catch (e) {
      // If there is an error, update the state with the error message
      emit(
          state.copyWith(isLoading: false, isDone: false, error: e.toString()));
    }
  }

  @override
  Future<void> close() {
    // Freeing up form text field controllers
    nameController
      ..removeListener(_updateName)
      ..dispose();
    return super.close();
  }
}
