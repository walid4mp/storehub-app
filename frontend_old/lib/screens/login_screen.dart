import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final app = context.read<AppState>();

    return Scaffold(
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 460),
          child: Card(
            elevation: 0,
            margin: const EdgeInsets.all(24),
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('StoreHub', style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  const Text('منصة متكاملة لإنشاء متاجر إلكترونية جاهزة وقابلة للتخصيص.'),
                  const SizedBox(height: 24),
                  FilledButton.icon(
                    onPressed: () async => app.login(),
                    icon: const Icon(Icons.login),
                    label: const Text('دخول / إنشاء حساب تجريبي'),
                  ),
                  const SizedBox(height: 12),
                  const Text('الدخول التجريبي ينشئ حسابًا تلقائياً إذا لم يكن موجوداً.'),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
