import 'package:adc_hackathon/core/apihandler/api_service.dart';
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:get_it/get_it.dart';

import '../models/user_model.dart';

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
      rethrow;
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
      final data = response.data['user'] as Map<String, dynamic>;
      await storage.write(key: 'auth_token', value: data['token'] as String);
      return UserModel.fromJson(data);
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
      if (response.statusCode == 200) {
        return UserModel.fromJson(
            response.data as Map<String, dynamic>); // Token is valid
      } else if (response.statusCode == 401) {
        return null; // Token is invalid or missing from the server
      }
      return null;
    } catch (e) {
      return null; // Handle errors like no network or server down
    }
  }
}
