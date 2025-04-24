import 'dart:developer';

import 'package:dio/dio.dart';

class ApiError extends Error {
  ApiError({
    required this.errorCode,
    required this.errorMessage,
  });
  factory ApiError.fromDioError(Object error) {
    dynamic errorMessage = '';
    dynamic errorCode = '';
    if (error is DioException) {
      final dioError = error;
      switch (dioError.type) {
        case DioExceptionType.cancel:
          errorMessage = 'Request was cancelled';
          errorCode = 400;
        case DioExceptionType.connectionTimeout:
          errorMessage = 'Connection timeout. Check your Internet Connection';
          errorCode = 'CONNECTION_TIMEOUT';
        case DioExceptionType.receiveTimeout:
          errorMessage =
              'Receive timeout in connection. Check your Internet Connection';
          errorCode = 'RECEIVE_TIMEOUT';
        case DioExceptionType.sendTimeout:
          errorMessage =
              'Send timeout in connection. Check your Internet Connection';
          errorCode = 'SEND_TIMEOUT';
        case DioExceptionType.badCertificate:
          errorMessage = 'Invalid SSL certificate';
          errorCode = 'BAD_CERTIFICATE';
        case DioExceptionType.badResponse:
          errorMessage = 'Bad response format. Check your input';
          errorCode = 'BAD_RESPONSE';
        case DioExceptionType.connectionError:
          errorMessage = 'Connection error. Check your Internet Connection';
          errorCode = 'CONNECTION_ERROR';
        case DioExceptionType.unknown:
          errorMessage = 'An Unexpected error occurred. Try again later';
          errorCode = 'UNKNOWN_ERROR';
      }
    } else {
      errorMessage = _handleException(error);
    }
    errorMessage = ((error as DioException).response?.data
            as Map<String, dynamic>)['message']
        .toString();
    log('errorCode: $errorCode, errorMessage: $errorMessage');
    return ApiError(
      errorCode: errorCode.toString(),
      errorMessage: errorMessage.toString(),
    );
  }
  final String errorCode;
  final String errorMessage;

  static String _handleException(dynamic exception) {
    if (exception is String) {
      return exception;
    } else {
      return 'An unexpected error occurred, please try again';
    }
  }

  static Map<String, String> extractDataFromResponse(Response? response) {
    dynamic message = '';
    dynamic errorCode = '';

    final decodeResponse = response!.data;

    if (response.data != null) {
      if (decodeResponse['message'] != null) {
        message = decodeResponse['message'];
      } else if (decodeResponse['error'] != null) {
        message = decodeResponse['error'];
      } else {
        message = 'An unexpected error occurred, please try again';
      }
      errorCode = decodeResponse['code'] ?? 'UNEXPECTED_ERROR';
    } else {
      message = response.statusMessage ?? '';
    }

    return {'message': message.toString(), 'code': errorCode.toString()};
  }

  @override
  String toString() =>
      'ApiError(errorCode: $errorCode, errorMessage: $errorMessage)';
}
