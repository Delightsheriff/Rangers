import 'package:adc_hackathon/config/theme/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';

class ResendCodeButton extends StatefulWidget {
  const ResendCodeButton({required this.onTap, super.key});
  final VoidCallback onTap;

  @override
  State<ResendCodeButton> createState() => _ResendCodeButtonState();
}

class _ResendCodeButtonState extends State<ResendCodeButton> {
  late Ticker ticker;
  bool isActive = false;
  int _secondsElapsed = 0;
  int delayInSeconds = 5;
  int get remainingTime => delayInSeconds - _secondsElapsed;
  late String suffixText;

  @override
  void initState() {
    super.initState();
    suffixText = formatTime(remainingTime);

    // A Ticker that counts down the time remaining
    ticker = Ticker((elapsed) {
      if (delayInSeconds >= _secondsElapsed) {
        setState(() {
          _secondsElapsed = elapsed.inSeconds;
          suffixText = formatTime(remainingTime);
        });
      } else {
        if (ticker.isActive) {
          setState(() {
            isActive = true;
            suffixText = 'Resend Code';
          });
          ticker.stop();
        }
      }
    });
    startTimer();
  }

  void startTimer() {
    _secondsElapsed = 0;
    ticker
      ..stop(canceled: true)
      ..start();
    setState(() {
      isActive = false;
    });
  }

  @override
  void dispose() {
    ticker
      ..stop(canceled: true)
      ..dispose();
    super.dispose();
  }

  String formatTime(int seconds) {
    final formattedTime = Duration(seconds: seconds).toString();
    return formattedTime.substring(
      formattedTime.indexOf(':') + 1,
      formattedTime.indexOf('.'),
    );
  }

  @override
  Widget build(BuildContext context) {
    return TextButton(
      onPressed: () {
        startTimer();
        if (isActive) {
          widget.onTap;
        }
      },
      style: ButtonStyle(
        overlayColor: const WidgetStatePropertyAll(
          AppColors.overlayPrimary,
        ),
        splashFactory:
            isActive ? InkSplash.splashFactory : NoSplash.splashFactory,
        shape: WidgetStatePropertyAll(
            RoundedRectangleBorder(borderRadius: BorderRadius.circular(10))),
        backgroundColor: WidgetStatePropertyAll(
          isActive ? Colors.transparent : AppColors.disabledDark,
        ),
        foregroundColor: WidgetStatePropertyAll(
          isActive ? AppColors.primary : AppColors.disabled,
        ),
      ),
      child: Text("Didn't get a code? $suffixText"),
    );
  }
}
