part of 'home_bloc.dart';

sealed class HomeEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

class LoadContents extends HomeEvent {}
