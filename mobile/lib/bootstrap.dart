import 'dart:async';
import 'dart:developer';

import 'package:adc_hackathon/core/apihandler/api_service.dart';
import 'package:adc_hackathon/core/apihandler/dio_config.dart';
import 'package:adc_hackathon/core/auth/auth_data_source.dart';
import 'package:adc_hackathon/core/auth/auth_repository.dart';
import 'package:bloc/bloc.dart';
import 'package:dio/dio.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AppBlocObserver extends BlocObserver {
  const AppBlocObserver();

  @override
  void onChange(BlocBase<dynamic> bloc, Change<dynamic> change) {
    super.onChange(bloc, change);
    log('onChange(${bloc.runtimeType}, $change)');
  }

  @override
  void onError(BlocBase<dynamic> bloc, Object error, StackTrace stackTrace) {
    log('onError(${bloc.runtimeType}, $error, $stackTrace)');
    super.onError(bloc, error, stackTrace);
  }
}

Future<void> setUp() async {
  getIt
    ..registerLazySingleton<Dio>(DioClient.getDio)
    ..registerLazySingleton<ApiService>(ApiService.new)
    ..registerLazySingleton<AuthDataSource>(AuthDataSource.new)
    ..registerLazySingleton<AuthRepository>(
      () => AuthRepository(getIt<AuthDataSource>()),
    )
    ..registerLazySingleton<FlutterSecureStorage>(FlutterSecureStorage.new);
}

Future<void> bootstrap(FutureOr<Widget> Function() builder) async {
  FlutterError.onError = (details) {
    log(details.exceptionAsString(), stackTrace: details.stack);
  };

  Bloc.observer = const AppBlocObserver();
  await dotenv.load();
  await setUp();
  // Add cross-flavor configuration here
  runApp(await builder());
}
