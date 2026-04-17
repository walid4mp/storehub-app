import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class AppState extends ChangeNotifier {
  String? token;
  Map<String, dynamic>? user;
  Map<String, dynamic>? dashboard;
  List<dynamic> products = [];
  String localeCode = 'ar';

  final String baseUrl = 'http://localhost:8080/api';

  Future<void> register() async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'name': 'Demo User',
        'email': 'demo@storehub.app',
        'password': '12345678',
        'storeName': 'WH Demo Store',
      }),
    );

    final data = jsonDecode(response.body);
    token = data['token'];
    user = data['user'];
    notifyListeners();
    await loadDashboard();
    await loadProducts();
  }

  Future<void> login() async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': 'demo@storehub.app',
        'password': '12345678',
      }),
    );

    if (response.statusCode == 404) {
      await register();
      return;
    }

    final data = jsonDecode(response.body);
    token = data['token'];
    user = data['user'];
    notifyListeners();
    await loadDashboard();
    await loadProducts();
  }

  Future<void> loadDashboard() async {
    final response = await http.get(
      Uri.parse('$baseUrl/store/dashboard'),
      headers: {'Authorization': 'Bearer $token'},
    );
    dashboard = jsonDecode(response.body);
    notifyListeners();
  }

  Future<void> loadProducts() async {
    final response = await http.get(
      Uri.parse('$baseUrl/store/products'),
      headers: {'Authorization': 'Bearer $token'},
    );
    products = jsonDecode(response.body)['products'];
    notifyListeners();
  }

  Future<void> addDemoProduct() async {
    await http.post(
      Uri.parse('$baseUrl/store/products'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'name': 'منتج تجريبي',
        'image': 'https://placehold.co/600x400',
        'price': 2999,
        'description': 'وصف مختصر لمنتج داخل StoreHub',
      }),
    );
    await loadProducts();
    await loadDashboard();
  }

  Future<void> redeemCode(String code) async {
    await http.post(
      Uri.parse('$baseUrl/store/subscriptions/redeem-code'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({'code': code}),
    );
    await loadDashboard();
  }

  void changeLanguage(String code) {
    localeCode = code;
    notifyListeners();
  }

  void logout() {
    token = null;
    user = null;
    dashboard = null;
    products = [];
    notifyListeners();
  }
}
