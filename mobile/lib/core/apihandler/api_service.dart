import 'package:adc_hackathon/core/apihandler/error_response.dart';
import 'package:dio/dio.dart';
import 'package:get_it/get_it.dart';

class ApiService {
  final dio = GetIt.instance<Dio>();

  // GET request
  Future<Response> get(String path,
      {Map<String, dynamic>? queryParams, Options? options}) async {
    try {
      Response response =
          await dio.get(path, queryParameters: queryParams, options: options);
      return response;
    } catch (e) {
      throw ApiError.fromDioError(e);
    }
  }

  // POST request
  Future<Response> post(String path,
      {Map<String, dynamic>? data, Options? options}) async {
    try {
      Response response = await dio.post(
        path,
        data: data,
        options: options,
      );
      return response;
    } catch (e) {
      print(e);
      throw ApiError.fromDioError(e);
    }
  }
}
