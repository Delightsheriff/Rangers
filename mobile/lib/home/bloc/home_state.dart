part of 'home_bloc.dart';

sealed class HomeState extends Equatable {
  @override
  List<Object?> get props => [];
}

class InitialHomeState extends HomeState {}

class LoadingHomeState extends HomeState {}

class FinalHomeState extends HomeState {}
