import '../../core/auth/auth_data_source.dart';
import '../../core/models/user_model.dart';

class AuthRepository {
  AuthRepository(this._authDataSource);
  final AuthDataSource _authDataSource;

  Future<String?> getToken() async {
    return _authDataSource.getToken();
  }

  Future<void> clearToken() async {
    return _authDataSource.clearToken();
  }

  Future<UserModel> login(String email, String password) async {
    return _authDataSource.login(email, password);
  }

  Future<UserModel> signUp({
    required String firstName,
    required String lastName,
    required String email,
    required String password,
  }) async {
    return _authDataSource.signUp(firstName, lastName, email, password);
  }

  Future<void> logout() async {
    return _authDataSource.signOut();
  }

  Future<UserModel?> checkAuthentication(String token) async {
    return _authDataSource.checkAuthentication(token);
  }

  Future<UserModel> getCurrentUser() async {
    return _authDataSource.getCurrentUser();
  }
}
