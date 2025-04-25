// final GoRouter router = GoRouter(
//   navigatorKey: _rootNavigatorKey,
//   initialLocation: LogInPage.routeName,
//   routes: [
//     GoRoute(
//       path: SignUpPage.routeName,
//       builder: (context, state) => const SignUpPage(),
//     ),
//     GoRoute(
//       path: LogInPage.routeName,
//       builder: (context, state) => const LogInPage(),
//     ),
//     GoRoute(
//       path: ForgotPasswordPage.routeName,
//       builder: (context, state) => const ForgotPasswordPage(),
//     ),
//     GoRoute(
//       path: OtpPage.routeName,
//       builder: (context, state) => const OtpPage(),
//     ),
//     GoRoute(
//       path: NewPasswordPage.routeName,
//       builder: (context, state) => const NewPasswordPage(),
//     ),
//     StatefulShellRoute.indexedStack(
//         branches: [
//           StatefulShellBranch(
//             navigatorKey: _homeNavigatorKey,
//             routes: [
//               GoRoute(
//                 path: HomePage.routeName,
//                 builder: (context, state) => const HomePage(),
//               ),
//             ],
//           ),
//           StatefulShellBranch(
//             navigatorKey: _expensesNavigatorKey,
//             routes: [
//               GoRoute(
//                 path: '/b',
//                 builder: (context, state) => Scaffold(),
//               ),
//             ],
//           ),
//           StatefulShellBranch(
//             navigatorKey: _groupsNavigatorKey,
//             routes: [
//               GoRoute(
//                 path: '/c',
//                 builder: (context, state) => Scaffold(),
//               ),
//             ],
//           ),
//         ],
//         pageBuilder: (context, state, navigationShell) => NoTransitionPage(
//             child: ScaffoldWithNavBar(navigationShell: navigationShell))),
//   ],
// );
//
// class ScaffoldWithNavBar extends StatelessWidget {
//   const ScaffoldWithNavBar({required this.navigationShell, super.key});
//
//   final StatefulNavigationShell navigationShell;
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       body: navigationShell,
//       bottomNavigationBar: BottomNavigationBar(
//         currentIndex: navigationShell.currentIndex,
//         onTap: navigationShell.goBranch,
//         items: const [
//           BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
//           BottomNavigationBarItem(icon: Icon(Icons.money), label: 'Expenses'),
//           BottomNavigationBarItem(icon: Icon(Icons.people), label: 'Groups')
//         ],
//       ),
//     );
//   }
// }
