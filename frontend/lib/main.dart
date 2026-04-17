import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:provider/provider.dart';
import 'providers/app_state.dart';
import 'screens/login_screen.dart';
import 'screens/dashboard_screen.dart';

void main() {
  runApp(const StoreHubApp());
}

class StoreHubApp extends StatelessWidget {
  const StoreHubApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => AppState(),
      child: Consumer<AppState>(
        builder: (context, appState, _) {
          return MaterialApp(
            debugShowCheckedModeBanner: false,
            title: 'StoreHub',
            locale: Locale(appState.localeCode),
            supportedLocales: const [
              Locale('ar'),
              Locale('en'),
              Locale('fr'),
            ],
            localizationsDelegates: const [
              GlobalMaterialLocalizations.delegate,
              GlobalWidgetsLocalizations.delegate,
              GlobalCupertinoLocalizations.delegate,
            ],
            theme: ThemeData(
              useMaterial3: true,
              colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF2563EB)),
              scaffoldBackgroundColor: const Color(0xFFF8FAFC),
            ),
            home: appState.token == null ? const LoginScreen() : const DashboardScreen(),
          );
        },
      ),
    );
  }
}
