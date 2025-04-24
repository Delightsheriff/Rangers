import 'dart:async';

import 'package:adc_hackathon/auth/auth.dart';
import 'package:adc_hackathon/auth/bloc/auth_bloc/auth_bloc.dart';
import 'package:adc_hackathon/config/theme/colors.dart';
import 'package:adc_hackathon/config/theme/themes.dart';
import 'package:adc_hackathon/core/auth/auth_repository.dart';
import 'package:adc_hackathon/home/home.dart';
import 'package:adc_hackathon/l10n/l10n.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:go_router/go_router.dart';

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) =>
          AuthBloc(GetIt.instance<AuthRepository>())..add(AuthCheck()),
      child: const AppView(),
    );
  }
}

class AppView extends StatelessWidget {
  const AppView({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: AppTheme.lightTheme,
      color: AppColors.background,
      darkTheme: AppTheme.darkTheme,
      localizationsDelegates: AppLocalizations.localizationsDelegates,
      supportedLocales: AppLocalizations.supportedLocales,
      home: const MyApp(),
    );
  }
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    final rootNavigatorKey = GlobalKey<NavigatorState>();
    final homeNavigatorKey = GlobalKey<NavigatorState>();
    final expensesNavigatorKey = GlobalKey<NavigatorState>();
    final groupsNavigatorKey = GlobalKey<NavigatorState>();
    final settlementsNavigatorKey = GlobalKey<NavigatorState>();
    final reportsNavigatorKey = GlobalKey<NavigatorState>();

    final authBloc = context.read<AuthBloc>();
    return BlocBuilder<AuthBloc, AuthState>(
      buildWhen: (previous, current) =>
          previous.runtimeType != current.runtimeType,
      builder: (context, state) {
        final router = GoRouter(
          navigatorKey: rootNavigatorKey,
          initialLocation: HomePage.routeName,
          refreshListenable: GoRouterRefreshStream(authBloc.stream),
          redirect: (context, state) {
            final isLoading = authBloc.state is AuthInitialState;
            final isLoggedIn = authBloc.state is AuthLoggedInState;
            final isLoggingIn = state.matchedLocation == LogInPage.routeName;
            final isSigningUp = state.matchedLocation == SignUpPage.routeName;
            if (!isLoggedIn && !isLoggingIn && !isSigningUp && !isLoading) {
              return LogInPage.routeName;
            }
            if (isLoggedIn && isLoggingIn && !isLoading)
              return HomePage.routeName;
            if (isLoading) return '/loading';
            return null;
          },
          routes: [
            GoRoute(
              path: SignUpPage.routeName,
              builder: (context, state) => const SignUpPage(),
            ),
            GoRoute(
              path: '/loading',
              builder: (context, state) => Scaffold(
                body: Center(child: CircularProgressIndicator()),
              ),
            ),
            GoRoute(
              path: LogInPage.routeName,
              builder: (context, state) => const LogInPage(),
            ),
            GoRoute(
              path: ForgotPasswordPage.routeName,
              builder: (context, state) => const ForgotPasswordPage(),
            ),
            GoRoute(
              path: OtpPage.routeName,
              builder: (context, state) => const OtpPage(),
            ),
            GoRoute(
              path: NewPasswordPage.routeName,
              builder: (context, state) => const NewPasswordPage(),
            ),
            StatefulShellRoute.indexedStack(
                branches: [
                  StatefulShellBranch(
                    navigatorKey: homeNavigatorKey,
                    routes: [
                      GoRoute(
                        path: HomePage.routeName,
                        builder: (context, state) => const HomePage(),
                      ),
                    ],
                  ),
                  StatefulShellBranch(
                    navigatorKey: expensesNavigatorKey,
                    routes: [
                      GoRoute(
                        path: '/b',
                        builder: (context, state) => Scaffold(),
                      ),
                    ],
                  ),
                  StatefulShellBranch(
                    navigatorKey: groupsNavigatorKey,
                    routes: [
                      GoRoute(
                        path: '/c',
                        builder: (context, state) => Scaffold(),
                      ),
                    ],
                  ),
                  StatefulShellBranch(
                    navigatorKey: settlementsNavigatorKey,
                    routes: [
                      GoRoute(
                        path: '/d',
                        builder: (context, state) => Scaffold(),
                      ),
                    ],
                  ),
                  StatefulShellBranch(
                    navigatorKey: reportsNavigatorKey,
                    routes: [
                      GoRoute(
                        path: '/e',
                        builder: (context, state) => Scaffold(),
                      ),
                    ],
                  ),
                ],
                pageBuilder: (context, state, navigationShell) =>
                    NoTransitionPage(
                        child: ScaffoldWithNavBar(
                            navigationShell: navigationShell))),
          ],
        );

        return MaterialApp.router(
          routerConfig: router,
        );
      },
    );
  }
}

class ScaffoldWithNavBar extends StatelessWidget {
  const ScaffoldWithNavBar({required this.navigationShell, super.key});

  final StatefulNavigationShell navigationShell;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: navigationShell,
      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: AppColors.background,
        currentIndex: navigationShell.currentIndex,
        onTap: navigationShell.goBranch,
        selectedItemColor: AppColors.primary,
        unselectedItemColor: AppColors.textSecondary,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.money), label: 'Expenses'),
          BottomNavigationBarItem(icon: Icon(Icons.people), label: 'Groups'),
          BottomNavigationBarItem(
            icon: Icon(Icons.money),
            label: 'Settlements',
          ),
          BottomNavigationBarItem(icon: Icon(Icons.people), label: 'Reports')
        ],
      ),
    );
  }
}

class GoRouterRefreshStream extends ChangeNotifier {
  GoRouterRefreshStream(Stream<dynamic> stream) {
    _subscription = stream.asBroadcastStream().listen((_) => notifyListeners());
  }

  late final StreamSubscription<dynamic> _subscription;

  @override
  void dispose() {
    _subscription.cancel();
    super.dispose();
  }
}
