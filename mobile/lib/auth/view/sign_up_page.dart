import 'package:adc_hackathon/auth/auth.dart';
import 'package:adc_hackathon/auth/bloc/sign_up/sign_up_cubit.dart';
import 'package:adc_hackathon/shared/buttons/button.dart';
import 'package:adc_hackathon/shared/info.dart';
import 'package:adc_hackathon/shared/inputfields/textfield.dart';
import 'package:adc_hackathon/utils/enums.dart';
import 'package:adc_hackathon/utils/spacing.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:go_router/go_router.dart';

import '../../config/theme/colors.dart';
import '../../core/auth/auth_repository.dart';
import '../../home/view/home_page.dart';
import '../bloc/auth_bloc/auth_bloc.dart';

class SignUpPage extends StatelessWidget {
  const SignUpPage({super.key});
  static const routeName = '/sign-up';

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => SignUpCubit(
        GetIt.instance<AuthRepository>(),
        context.read<AuthBloc>(),
      ),
      child: const SignUpView(),
    );
  }
}

class SignUpView extends StatelessWidget {
  const SignUpView({super.key});

  @override
  Widget build(BuildContext context) {
    final signUpCubit = context.watch<SignUpCubit>();
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0),
        child: SingleChildScrollView(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              150.h,
              Text(
                'Sign Up',
                style: Theme.of(context).textTheme.headlineLarge,
              ),
              40.h,
              AppTextField(
                hintText: 'Enter Your First Name',
                controller: signUpCubit.firstNameController,
                focusNode: signUpCubit.focusNodes[0],
                isDisabled: signUpCubit.state.isLoading,
                fieldValidation: FieldValidation.required,
              ),
              16.h,
              AppTextField(
                hintText: 'Enter Your Last Name',
                controller: signUpCubit.lastNameController,
                focusNode: signUpCubit.focusNodes[1],
                isDisabled: signUpCubit.state.isLoading,
                fieldValidation: FieldValidation.required,
              ),
              16.h,
              AppTextField(
                hintText: 'Enter Your Email',
                controller: signUpCubit.emailController,
                focusNode: signUpCubit.focusNodes[2],
                fieldValidation: FieldValidation.email,
                isDisabled: signUpCubit.state.isLoading,
              ),
              16.h,
              AppTextField(
                hintText: 'Enter Your Password',
                isPassword: true,
                controller: signUpCubit.passwordController,
                focusNode: signUpCubit.focusNodes[3],
                fieldValidation: FieldValidation.password,
                isDisabled: signUpCubit.state.isLoading,
              ),
              16.h,
              AppTextField(
                hintText: 'Confirm Your Password',
                isPassword: true,
                controller: signUpCubit.confirmPasswordController,
                focusNode: signUpCubit.focusNodes[4],
                fieldValidation: FieldValidation.password,
                isDisabled: signUpCubit.state.isLoading,
                validator: (value) {
                  if (signUpCubit.state.password != value) {
                    return "The passwords don't match";
                  }
                  return null;
                },
                action: TextInputAction.done,
              ),
              16.h,
              BlocListener<AuthBloc, AuthState>(
                listener: (context, state) {
                  if (state is AuthLoggedInState) {
                    context.push(HomePage.routeName);
                  } else if (state is AuthErrorState) {
                    showErrorSnackBar(context, state.error);
                  }
                },
                child: AppPrimaryButton(
                  text: 'Sign Up',
                  isDisabled: !signUpCubit.state.isFormComplete ||
                      signUpCubit.state.isLoading,
                  onPressed: signUpCubit.signUp,
                  child: signUpCubit.state.isLoading
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
                text: 'Already have an account, Log in',
                isDisabled: signUpCubit.state.isLoading,
                onPressed: () {
                  context.go(LogInPage.routeName);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
