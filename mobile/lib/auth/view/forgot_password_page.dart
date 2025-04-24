import 'package:adc_hackathon/auth/bloc/forgot_password/forgot_password_cubit.dart';
import 'package:adc_hackathon/auth/view/otp_page.dart';
import 'package:adc_hackathon/shared/buttons/button.dart';
import 'package:adc_hackathon/shared/inputfields/textfield.dart';
import 'package:adc_hackathon/utils/enums.dart';
import 'package:adc_hackathon/utils/spacing.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

class ForgotPasswordPage extends StatelessWidget {
  const ForgotPasswordPage({super.key});
  static const routeName = '/forgot-password';

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => ForgotPasswordCubit(),
      child: const ForgotPasswordView(),
    );
  }
}

class ForgotPasswordView extends StatelessWidget {
  const ForgotPasswordView({super.key});

  @override
  Widget build(BuildContext context) {
    final forgotPasswordCubit = context.watch<ForgotPasswordCubit>();
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Forgot Password',
              style: Theme.of(context).textTheme.headlineLarge,
            ),
            40.h,
            Text(
              'Enter the email address you used to sign up for the account',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            16.h,
            AppTextField(
              hintText: 'Enter Your Email',
              controller: forgotPasswordCubit.emailController,
              fieldValidation: FieldValidation.email,
              focusNode: forgotPasswordCubit.focusNodes[0],
              isDisabled: forgotPasswordCubit.state.isLoading,
            ),
            32.h,
            BlocListener<ForgotPasswordCubit, ForgotPasswordState>(
              bloc: forgotPasswordCubit,
              listener: (context, state) {
                // Navigates to the otp page if the email has been confirmed
                if (state.isDone && !state.isLoading) {
                  context.push(OtpPage.routeName);
                }
              },
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  AppTextButton(
                    text: 'Cancel',
                    isDisabled: forgotPasswordCubit.state.isLoading,
                    onPressed: () {
                      context.pop();
                    },
                  ),
                  32.w,
                  AppPrimaryButton(
                    text: 'Next',
                    isDisabled: !forgotPasswordCubit.state.isFormComplete ||
                        forgotPasswordCubit.state.isLoading,
                    onPressed: forgotPasswordCubit.sendOTP,
                    child: forgotPasswordCubit.state.isLoading
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
            ),
          ],
        ),
      ),
    );
  }
}
