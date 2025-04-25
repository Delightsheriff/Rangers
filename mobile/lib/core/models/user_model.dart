class UserModel {
  const UserModel({
    required this.id,
    required this.firstName,
    required this.lastName,
    // this.email,
    this.phone,
    this.accessToken,
    this.refreshToken,
    this.createdAt,
    this.updatedAt,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: (json['id'] as int).toString(),
      firstName: json['firstName'] as String ?? '',
      lastName: json['lastName'] as String ?? '',
      // email: json['email'] as String ?? '',
      // phone: json['phone'] != null ? json['phone'] as String : null,
      // accessToken: json['accessToken'] as String,
      // refreshToken: json['refreshToken'] as String,
      // createdAt: json['createdAt'] != null
      //     ? DateTime.parse(json['createdAt'] as String)
      //     : null,
      // updatedAt: json['updatedAt'] != null
      //     ? DateTime.parse(json['updatedAt'] as String)
      //     : null,
    );
  }
  final String id;
  final String firstName;
  final String lastName;
  // final String? email;
  final String? phone;
  final String? accessToken;
  final String? refreshToken;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Map<String, dynamic> toJson() => {
        'id': id,
        'firstName': firstName,
        'lastName': lastName,
        'phone': phone,
        // 'email': email,
        'accessToken': accessToken,
        'refreshToken': refreshToken,
        'createdAt': createdAt?.toIso8601String(),
        'updatedAt': updatedAt?.toIso8601String(),
      };

  UserModel copyWith({
    String? id,
    String? firstName,
    String? lastName,
    // String? email,
    String? phone,
    String? accessToken,
    String? refreshToken,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return UserModel(
      id: id ?? this.id,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      // email: email ?? this.email,
      phone: phone ?? this.phone,
      accessToken: accessToken ?? this.accessToken,
      refreshToken: refreshToken ?? this.refreshToken,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  @override
  String toString() => 'UserModel(id: $id, name: $firstName$lastName)';
}
