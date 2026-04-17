import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../providers/app_state.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  Future<void> _openUrl(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppState>();
    final stats = app.dashboard?['stats'] ?? {};
    final store = app.dashboard?['store'] ?? {};
    final referral = app.dashboard?['referral'] ?? {};

    return Scaffold(
      appBar: AppBar(
        title: const Text('لوحة تحكم StoreHub'),
        actions: [
          PopupMenuButton<String>(
            onSelected: app.changeLanguage,
            itemBuilder: (_) => const [
              PopupMenuItem(value: 'ar', child: Text('العربية')),
              PopupMenuItem(value: 'en', child: Text('English')),
              PopupMenuItem(value: 'fr', child: Text('Français')),
            ],
          ),
          IconButton(onPressed: app.logout, icon: const Icon(Icons.logout)),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _openUrl('https://wa.me/213779109990'),
        icon: const Icon(Icons.chat),
        label: const Text('WhatsApp'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              _StatCard(title: 'الخطة الحالية', value: stats['currentPlan']?['name']?.toString() ?? 'Free'),
              _StatCard(title: 'المنتجات', value: '${stats['totalProducts'] ?? 0}'),
              _StatCard(title: 'الطلبات', value: '${stats['totalOrders'] ?? 0}'),
              _StatCard(title: 'العملاء', value: '${stats['totalCustomers'] ?? 0}'),
            ],
          ),
          const SizedBox(height: 16),
          Card(
            child: ListTile(
              title: Text(store['name']?.toString() ?? 'My Store'),
              subtitle: Text('Slug: ${store['slug'] ?? ''} • Currency: ${store['currency'] ?? ''}'),
              trailing: FilledButton(
                onPressed: app.addDemoProduct,
                child: const Text('إضافة منتج تجريبي'),
              ),
            ),
          ),
          const SizedBox(height: 16),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('نظام الإحالة', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Text('رابط الإحالة: ${referral['link'] ?? '-'}'),
                  const SizedBox(height: 4),
                  Text('عدد الدعوات: ${referral['totalInvites'] ?? 0}'),
                  const SizedBox(height: 4),
                  Text(referral['rewardRule'] ?? ''),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('الدعم والتواصل', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      OutlinedButton(onPressed: () => _openUrl('https://wa.me/213779109990'), child: const Text('WhatsApp')),
                      OutlinedButton(onPressed: () => _openUrl('https://www.instagram.com/wh.s.8?igsh=MXczaDR1d3B4c2Zoaw=='), child: const Text('Instagram')),
                      OutlinedButton(onPressed: () => _openUrl('https://www.facebook.com/profile.php?id=61570663858487'), child: const Text('Facebook')),
                      OutlinedButton(onPressed: () => _openUrl('mailto:ww608352@gmail.com'), child: const Text('Email')),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          const Text('المنتجات', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          ...app.products.map(
            (p) => Card(
              child: ListTile(
                leading: CircleAvatar(child: Text('${p['price']}')),
                title: Text(p['name'] ?? ''),
                subtitle: Text(p['description'] ?? ''),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String title;
  final String value;
  const _StatCard({required this.title, required this.value});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 220,
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(color: Colors.grey)),
              const SizedBox(height: 8),
              Text(value, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            ],
          ),
        ),
      ),
    );
  }
}
