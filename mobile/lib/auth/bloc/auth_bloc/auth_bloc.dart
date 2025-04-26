import 'package:adc_hackathon/core/auth/auth_repository.dart';
import 'package:adc_hackathon/core/models/user_model.dart';
import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

class AuthState extends Equatable {
  @override
  List<Object?> get props => [];
}

class AuthEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

class AuthLogIn extends AuthEvent {
  AuthLogIn(this.user);
  final UserModel user;
}

class AuthClear extends AuthEvent {}

class AuthLogOut extends AuthEvent {}

class AuthCheck extends AuthEvent {}

class AuthError extends AuthEvent {
  AuthError(this.error);
  final String error;
}

class AuthInitialState extends AuthState {}

class AuthLoggedInState extends AuthState {
  AuthLoggedInState(this.user);
  final UserModel user;

  @override
  List<Object?> get props => [user];
}

class AuthLoggedOutState extends AuthState {}

class AuthErrorState extends AuthState {
  AuthErrorState(this.error);
  final String error;

  @override
  List<Object?> get props => [error];
}

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  AuthBloc(this._authRepository) : super(AuthInitialState()) {
    on<AuthLogIn>(_onLoggedIn);
    on<AuthLogOut>(_onLoggedOut);
    on<AuthError>(_onError);
    on<AuthClear>(_onClear);
    on<AuthCheck>(_onCheck);
  }
  final AuthRepository _authRepository;

  Future<void> _onLoggedIn(AuthLogIn event, Emitter<AuthState> emit) async =>
      emit(AuthLoggedInState(event.user));

  Future<void> _onLoggedOut(AuthLogOut event, Emitter<AuthState> emit) async =>
      emit(AuthLoggedOutState());

  Future<void> _onError(AuthError event, Emitter<AuthState> emit) async =>
      emit(AuthErrorState(event.error));

  Future<void> _onClear(AuthClear event, Emitter<AuthState> emit) async =>
      emit(AuthInitialState());

  Future<void> _onCheck(AuthCheck event, Emitter<AuthState> emit) async {
    try {
      final token = await _authRepository.getToken();
      if (token != null) {
        final user = await _authRepository.checkAuthentication(token);
        if (user != null) {
          // Restore auth state
          emit(AuthLoggedInState(user));
        } else {
          await _authRepository.clearToken();
          emit(AuthLoggedOutState());
        }
      } else {
        emit(AuthLoggedOutState());
      }
    } catch (e) {
      print(e);
      emit(AuthLoggedOutState());
    }
  }
}
