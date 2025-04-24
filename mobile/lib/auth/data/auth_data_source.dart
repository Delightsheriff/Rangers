import 'package:adc_hackathon/core/apihandler/api_service.dart';
import 'package:adc_hackathon/core/apihandler/error_response.dart';
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:get_it/get_it.dart';

import '../../core/models/user_model.dart';

class AuthDataSource {
  final storage = GetIt.instance<FlutterSecureStorage>();
  final ApiService _apiService = GetIt.instance<ApiService>();

  Future<String?> getToken() async {
    return storage.read(key: 'auth_token');
  }

  Future<void> clearToken() async {
    await storage.delete(key: 'auth_token');
  }

  Future<UserModel> login(String email, String password) async {
    try {
      final response = await _apiService.post(
        '/auth/login',
        data: {
          'identifier': email,
          'password': password,
        },
      );
      await storage.write(
          key: 'auth_token', value: response.data['token'] as String);
      return UserModel.fromJson(response.data['user'] as Map<String, dynamic>);
    } catch (e) {
      throw ApiError.fromDioError(e);
    }
  }

  Future<UserModel> signUp(
      String fName, String lName, String email, String password) async {
    try {
      final response = await _apiService.post(
        '/auth/signup',
        data: {
          'email': email,
          'password': password,
          'firstName': fName,
          'lastName': lName,
        },
      );
      if (response.data == null) {
        throw ApiError(
            errorCode: '400', errorMessage: 'Bad Request. Try Again Later');
      }
      final data = response.data['user'] as Map<String, dynamic>;
      final token = response.data['token'] as String;
      await storage.write(key: 'auth_token', value: token);
      return UserModel.fromJson(data);
    } on DioException catch (e) {
      throw ApiError.fromDioError(e);
    } catch (e) {
      rethrow;
    }
  }

  Future<void> signOut() async {
    await _apiService.get('/auth/logout');
    await clearToken();
  }

  Future<UserModel> getCurrentUser() async {
    return UserModel.fromJson(
      (await _apiService.get('/user')).data as Map<String, dynamic>,
    );
  }

  Future<UserModel?> checkAuthentication(String token) async {
    try {
      final response = await _apiService.get(
        '/account/profile',
        options: Options(
          headers: {
            'Authorization': 'Bearer $token',
          },
        ),
      );
      if (response.data == null) {
        throw ApiError(
            errorCode: '400', errorMessage: 'Bad Request. Try Again Later');
      }
      if (response.statusCode == 200) {
        return UserModel.fromJson(
            response.data as Map<String, dynamic>); // Token is valid
      } else if (response.statusCode == 401) {
        return null; // Token is invalid or missing from the server
      }
      return null;
    } on DioException catch (e) {
      throw ApiError.fromDioError(e);
    } catch (e) {
      rethrow;
    }
  }
}
