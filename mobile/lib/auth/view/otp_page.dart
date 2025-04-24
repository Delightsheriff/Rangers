import 'package:adc_hackathon/auth/bloc/otp_page/otp_cubit.dart';
import 'package:adc_hackathon/auth/view/new_password_page.dart';
import 'package:adc_hackathon/auth/view/widgets/resend_code_button.dart';
import 'package:adc_hackathon/shared/buttons/button.dart';
import 'package:adc_hackathon/shared/inputfields/otp_field.dart';
import 'package:adc_hackathon/utils/spacing.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

class OtpPage extends StatelessWidget {
  const OtpPage({super.key});
  static const routeName = '/otp-page';

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => OtpCubit(),
      child: const OtpView(),
    );
  }
}

class OtpView extends StatelessWidget {
  const OtpView({super.key});

  @override
  Widget build(BuildContext context) {
    final otpCubit = context.watch<OtpCubit>();
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Enter OTP',
              style: Theme.of(context).textTheme.headlineLarge,
            ),
            40.h,
            Text(
              'Enter the one time password sent to your email account',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            16.h,
            OtpField(
              focusNode: otpCubit.focusNode,
              length: otpCubit.otpLength,
              onChanged: otpCubit.updateOTP,
            ),
            16.h,
            ResendCodeButton(onTap: otpCubit.resendOTP),
            32.h,
            BlocListener<OtpCubit, OtpState>(
              bloc: otpCubit,
              listener: (context, state) {
                if (state.isDone && !state.isLoading) {
                  context.push(NewPasswordPage.routeName);
                }
              },
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  AppTextButton(
                    text: 'Cancel',
                    isDisabled: otpCubit.state.isLoading,
                    onPressed: () {
                      context.pop();
                    },
                  ),
                  32.w,
                  AppPrimaryButton(
                    text: 'Next',
                    isDisabled: !otpCubit.state.isFormComplete ||
                        otpCubit.state.isLoading,
                    onPressed: otpCubit.authenticateOTP,
                    child: otpCubit.state.isLoading
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
