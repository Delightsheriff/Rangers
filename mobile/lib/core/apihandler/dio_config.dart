import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:get_it/get_it.dart';
import 'package:pretty_dio_logger/pretty_dio_logger.dart';

GetIt getIt = GetIt.instance;

class DioClient {
  const DioClient._();

  static Dio getDio() {
    final options = BaseOptions(
      baseUrl: dotenv.env['BASE_URL']!,
      receiveDataWhenStatusError: true,
      sendTimeout: const Duration(seconds: 30),
      connectTimeout: const Duration(seconds: 30),
      // 60 seconds
      receiveTimeout: const Duration(seconds: 25), // 60 seconds
    );

    //module
    final dio = Dio(options);

    dio.interceptors.add(
      PrettyDioLogger(
          requestBody: true,
          //true
          requestHeader: true,
          //true
          responseBody: true,
          //true
          responseHeader: true,
          //false
          compact: true,
          //false
          error: true,
          //true
          maxWidth: 90),
    );
    // dioAppDynamicsTracked.options = options;

    //trackedDio
    dio.interceptors.add(
      PrettyDioLogger(
        requestHeader: true,
        requestBody: true,
        responseBody: true,
        responseHeader: true,
        error: true,
        compact: true,
        maxWidth: 90,
      ),
    );

    return dio;
  }
}
