import 'package:adc_hackathon/auth/bloc/auth_bloc/auth_bloc.dart';
import 'package:adc_hackathon/home/bloc/home_bloc.dart';
import 'package:adc_hackathon/utils/spacing.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_speed_dial/flutter_speed_dial.dart';

import '../../config/theme/colors.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});
  static const routeName = '/home';

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => HomeBloc(),
      child: const HomeView(),
    );
  }
}

class HomeView extends StatelessWidget {
  const HomeView({super.key});

  @override
  Widget build(BuildContext context) {
    final authBloc = context.watch<AuthBloc>();
    return SafeArea(
      child: Scaffold(
        backgroundColor: Colors.white,
        body: CustomScrollView(
          slivers: [
            SliverAppBar(
              toolbarHeight: 80,
              floating: true,
              snap: true,
              backgroundColor: AppColors.background,
              scrolledUnderElevation: 0,
              title: Row(
                children: [
                  CircleAvatar(
                    backgroundColor: AppColors.surface,
                    child: Center(
                      child: Text(
                        '${(authBloc.state as AuthLoggedInState).user.firstName[0]}${(authBloc.state as AuthLoggedInState).user.lastName[0]}',
                      ),
                    ),
                  ),
                  8.w,
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Welcome Back',
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                      Text(
                        '${(authBloc.state as AuthLoggedInState).user.firstName} ${(authBloc.state as AuthLoggedInState).user.lastName}',
                        style:
                            Theme.of(context).textTheme.headlineSmall!.copyWith(
                                  fontWeight: FontWeight.bold,
                                ),
                      ),
                    ],
                  )
                ],
              ),
              actions: [
                IconButton(
                  onPressed: () {},
                  icon: Icon(
                    Icons.notifications_none,
                  ),
                ),
                IconButton(
                  onPressed: () {},
                  icon: Icon(
                    Icons.more_vert,
                  ),
                ),
              ],
              actionsIconTheme: Theme.of(context).iconTheme,
            ),
            SliverList(
              delegate: SliverChildListDelegate(
                [
                  // Overview
                  const OverviewSection(),
                  // Groups Section
                  const GroupsSection(),
                  // Expenses Section
                  const ExpensesSection(),
                ],
              ),
            ),
          ],
        ),
        floatingActionButton: AddFloatingActionButton(),
      ),
    );
  }
}

class OverviewSection extends StatelessWidget {
  const OverviewSection({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 30),
      child: SizedBox(
        height: 220,
        child: Column(
          children: [
            Row(
              children: [
                Text(
                  'Summary',
                  style: Theme.of(context).textTheme.headlineLarge,
                ),
                const Spacer(),
                // Container(
                //   decoration: BoxDecoration(
                //     color: AppColors.surface,
                //     borderRadius: BorderRadius.circular(8),
                //   ),
                //   child: Padding(
                //     padding: const EdgeInsets.all(8.0),
                //     child: Row(
                //       children: [
                //         Text('This month'),
                //         8.w,
                //         Icon(Icons.keyboard_arrow_down),
                //       ],
                //     ),
                //   ),
                // ),
              ],
            ),
            const Spacer(),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                16.w,
                Expanded(
                  child: LayoutBuilder(
                    builder: (context, constraints) => SizedBox.square(
                      dimension: constraints.biggest.shortestSide,
                      child: Stack(
                        children: [
                          Positioned.fill(
                            child: CircularProgressIndicator(
                              strokeWidth: 25,
                              value: .3,
                              backgroundColor: AppColors.surface,
                              color: AppColors.primary,
                              strokeCap: StrokeCap.round,
                            ),
                          ),
                          Positioned.fill(
                              child: Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  '30%',
                                  style: Theme.of(context)
                                      .textTheme
                                      .headlineMedium
                                      ?.copyWith(
                                        fontSize: 30,
                                      ),
                                ),
                                Text(
                                  'Completed',
                                  style: Theme.of(context).textTheme.bodyMedium,
                                ),
                              ],
                            ),
                          ))
                        ],
                      ),
                    ),
                  ),
                ),
                48.w,
                Expanded(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        '5 Pending Expenses',
                        style: Theme.of(context).textTheme.headlineMedium,
                      ),
                      Text(
                        r'$ 30,000 / 100,000',
                        style: Theme.of(context)
                            .textTheme
                            .bodyMedium
                            ?.copyWith(fontSize: 16),
                      ),
                    ],
                  ),
                ),
                16.w,
              ],
            ),
            const Spacer(),
          ],
        ),
      ),
    );
  }
}

class AddFloatingActionButton extends StatelessWidget {
  const AddFloatingActionButton({super.key});

  @override
  Widget build(BuildContext context) {
    return SpeedDial(
      backgroundColor: AppColors.primary,
      foregroundColor: AppColors.background,
      icon: Icons.add,
      spacing: 16,
      spaceBetweenChildren: 16,
      children: [
        SpeedDialChild(
            label: 'Add an Expense',
            onTap: () {},
            child: const Icon(Icons.money)),
        SpeedDialChild(
            label: 'Create a new Group',
            onTap: () {},
            child: const Icon(Icons.people))
      ],
    );
  }
}

class GroupsSection extends StatelessWidget {
  const GroupsSection({super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 200,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        // shrinkWrap: true,
        // physics: const NeverScrollableScrollPhysics(),
        children: [
          Row(
            children: [
              30.w,
              Text(
                'Groups',
                style: Theme.of(context).textTheme.headlineLarge,
              ),
              const Spacer(),
              TextButton(
                  onPressed: () {},
                  style: ButtonStyle(
                      padding: WidgetStatePropertyAll(
                          EdgeInsets.symmetric(horizontal: 8)),
                      foregroundColor:
                          WidgetStatePropertyAll(AppColors.primary)),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text('See All'),
                      Icon(Icons.keyboard_arrow_right)
                    ],
                  )),
              16.w,
            ],
          ),
          SizedBox(
            height: 150,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.only(left: 30),
              itemCount: 10,
              itemBuilder: (context, index) => SizedBox.square(
                dimension: 150,
                child: Card(
                  child: InkWell(
                    onTap: () {},
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        CircleAvatar(
                          radius: 35,
                        ),
                        Text('Group ${index + 1}'),
                        Text('100 / 500'),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class ExpensesSection extends StatelessWidget {
  const ExpensesSection({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 16),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              30.w,
              Text(
                'Expenses',
                style: Theme.of(context).textTheme.headlineLarge,
              ),
              const Spacer(),
              TextButton(
                  onPressed: () {},
                  style: ButtonStyle(
                      padding: WidgetStatePropertyAll(
                          EdgeInsets.symmetric(horizontal: 8)),
                      foregroundColor:
                          WidgetStatePropertyAll(AppColors.primary)),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text('See All'),
                      Icon(Icons.keyboard_arrow_right)
                    ],
                  )),
              16.w
            ],
          ),
          ...List.generate(
            10,
            (index) => ListTile(
              onTap: () {},
              contentPadding: const EdgeInsets.symmetric(horizontal: 30),
              title: Text(
                'Expense Name',
                style: Theme.of(context).textTheme.bodyLarge,
              ),
              subtitle: const Row(
                children: [
                  Text('Group Name'),
                  Spacer(),
                  Text(r'$50,000 / 60,000'),
                ],
              ),
            ),
          )
        ],
      ),
    );
  }
}
