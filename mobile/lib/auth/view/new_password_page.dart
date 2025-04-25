import 'package:adc_hackathon/auth/bloc/new_password/new_password_cubit.dart';
import 'package:adc_hackathon/shared/buttons/button.dart';
import 'package:adc_hackathon/shared/inputfields/textfield.dart';
import 'package:adc_hackathon/utils/enums.dart';
import 'package:adc_hackathon/utils/spacing.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

class NewPasswordPage extends StatelessWidget {
  const NewPasswordPage({super.key});
  static const routeName = '/new-password';

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => NewPasswordCubit(),
      child: const NewPasswordView(),
    );
  }
}

class NewPasswordView extends StatelessWidget {
  const NewPasswordView({super.key});

  @override
  Widget build(BuildContext context) {
    final newPasswordCubit = context.watch<NewPasswordCubit>();
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Reset Password',
              style: Theme.of(context).textTheme.headlineLarge,
            ),
            40.h,
            AppTextField(
              hintText: 'Enter Your New Password',
              controller: newPasswordCubit.passwordController,
              focusNode: newPasswordCubit.focusNodes[0],
              fieldValidation: FieldValidation.password,
              isDisabled: newPasswordCubit.state.isLoading,
            ),
            16.h,
            AppTextField(
              hintText: 'Confirm New Password',
              isPassword: true,
              controller: newPasswordCubit.confirmPasswordController,
              focusNode: newPasswordCubit.focusNodes[1],
              fieldValidation: FieldValidation.password,
              isDisabled: newPasswordCubit.state.isLoading,
            ),
            16.h,
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                AppTextButton(
                  text: 'Cancel',
                  isDisabled: newPasswordCubit.state.isLoading,
                  onPressed: () {
                    context.pop();
                  },
                ),
                32.w,
                AppPrimaryButton(
                  text: 'Log In',
                  isDisabled: !newPasswordCubit.state.isFormComplete ||
                      newPasswordCubit.state.isLoading,
                  onPressed: () {},
                  child: newPasswordCubit.state.isLoading
                      ? const SizedBox.square(
                          dimension: 15,
                          child: CircularProgressIndicator(
                            color: Colors.white,
                          ),
                        )
                      : null,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
