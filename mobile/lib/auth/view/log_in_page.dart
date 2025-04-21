import 'package:adc_hackathon/auth/bloc/log_in/log_in_cubit.dart';
import 'package:adc_hackathon/auth/view/forgot_password_page.dart';
import 'package:adc_hackathon/auth/view/sign_up_page.dart';
import 'package:adc_hackathon/shared/buttons/button.dart';
import 'package:adc_hackathon/shared/inputfields/textfield.dart';
import 'package:adc_hackathon/utils/enums.dart';
import 'package:adc_hackathon/utils/spacing.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:go_router/go_router.dart';

import '../../config/theme/colors.dart';
import '../../core/auth/auth_repository.dart';
import '../../shared/info.dart';
import '../bloc/auth_bloc/auth_bloc.dart';

class LogInPage extends StatelessWidget {
  const LogInPage({super.key});
  static const routeName = '/log-in';

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => LogInCubit(
        GetIt.instance<AuthRepository>(),
        context.read<AuthBloc>(),
      ),
      child: const LogInView(),
    );
  }
}

class LogInView extends StatelessWidget {
  const LogInView({super.key});

  @override
  Widget build(BuildContext context) {
    final logInCubit = context.watch<LogInCubit>();
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Log In',
              style: Theme.of(context).textTheme.headlineLarge,
            ),
            40.h,
            AppTextField(
              hintText: 'Enter Your Email',
              controller: logInCubit.emailController,
              focusNode: logInCubit.focusNodes[0],
              fieldValidation: FieldValidation.email,
              isDisabled: logInCubit.state.isLoading,
            ),
            16.h,
            AppTextField(
              hintText: 'Enter Your Password',
              isPassword: true,
              controller: logInCubit.passwordController,
              focusNode: logInCubit.focusNodes[1],
              fieldValidation: FieldValidation.password,
              action: TextInputAction.done,
              isDisabled: logInCubit.state.isLoading,
            ),
            4.h,
            Row(
              children: [
                AppTextButton(
                  isDisabled: logInCubit.state.isLoading,
                  text: 'Forgot Password?',
                  onPressed: () {
                    context.push(ForgotPasswordPage.routeName);
                  },
                ),
              ],
            ),
            16.h,
            BlocListener<AuthBloc, AuthState>(
              listener: (context, state) {
                if (state is AuthErrorState) {
                  showErrorSnackBar(context, state.error);
                }
              },
              child: AppPrimaryButton(
                text: 'Log In',
                isDisabled: !logInCubit.state.isFormComplete ||
                    logInCubit.state.isLoading,
                onPressed: logInCubit.logIn,
                child: logInCubit.state.isLoading
                    ? const SizedBox.square(
                        dimension: 15,
                        child: CircularProgressIndicator(
                          color: Colors.white,
                        ),
                      )
                    : null,
              ),
            ),
            AppTextButton(
              text: "Don't have an account?, Sign Up",
              isDisabled: logInCubit.state.isLoading,
              onPressed: () {
                context.go(SignUpPage.routeName);
              },
            ),
          ],
        ),
      ),
    );
  }
}
