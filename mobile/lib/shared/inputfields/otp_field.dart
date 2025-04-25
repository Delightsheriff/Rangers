import 'package:adc_hackathon/config/theme/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class OtpField extends StatefulWidget {
  const OtpField({
    required this.focusNode,
    required this.length,
    required this.onChanged,
    super.key,
    this.enabled = true,
  });
  final FocusNode focusNode;
  final int length;
  final void Function(String value) onChanged;
  final bool enabled;

  @override
  State<OtpField> createState() => _OtpFieldState();
}

class _OtpFieldState extends State<OtpField> implements TextInputClient {
  late TextInputConnection _connection;
  late String _currentText;
  int currentIndex = 0;

  @override
  void initState() {
    super.initState();
    // Creates Keyboard connection
    _connection = TextInput.attach(
      this,
      const TextInputConfiguration(
        inputType: TextInputType.number,
      ),
    );
    // Sets the otp values to empty
    _currentText = '';
    _connection.show();
  }

  @override
  void dispose() {
    super.dispose();
  }

  // Brings up the keyboard
  void _showKeyboard() {
    if (!_connection.attached) {
      _connection = TextInput.attach(
        this,
        const TextInputConfiguration(
          inputType: TextInputType.number,
        ),
      );
    }
    _connection.show();
  }

  // Function to handle use input
  void _onKeyEvent(KeyEvent event) {
    // Adds the inputted character
    if (event.character != null &&
        int.tryParse(event.character!) != null &&
        _currentText.length < widget.length) {
      setState(() {
        _currentText += event.character!;
      });
      widget.onChanged(_currentText);
    }

    // Deletes the last character and goes to the previous box
    if (event is KeyDownEvent &&
        event.logicalKey == LogicalKeyboardKey.backspace &&
        _currentText.isNotEmpty) {
      final length = _currentText.length;
      setState(() {
        _currentText = _currentText.substring(0, length - 1);
      });
      widget.onChanged(_currentText);
    }
  }

  @override
  Widget build(BuildContext context) {
    return KeyboardListener(
      autofocus: true,
      focusNode: widget.focusNode,
      onKeyEvent: _onKeyEvent,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: List<Widget>.generate(
          widget.length,
          (index) => Padding(
            padding: EdgeInsets.only(
              left: index == 0 ? 0 : 8,
              right: index == widget.length ? 8 : 0,
            ),
            child: SizedBox(
              width: 40,
              child: GestureDetector(
                onTap: _showKeyboard,
                child: Container(
                  height: 60,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(8),
                    border: _currentText.length >= index + 1
                        ? const Border.fromBorderSide(
                            BorderSide(color: AppColors.primary),
                          )
                        : null,
                    color: AppColors.surface,
                  ),
                  child: Center(
                    child: Text(
                      _currentText.length - 1 < index
                          ? '0'
                          : _currentText[index],
                      style:
                          Theme.of(context).textTheme.headlineMedium?.copyWith(
                                color: _currentText.length - 1 < index
                                    ? AppColors.textSecondary
                                    : null,
                              ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  @override
  void connectionClosed() {}

  @override
  AutofillScope? get currentAutofillScope => null;

  @override
  TextEditingValue? get currentTextEditingValue => TextEditingValue(
        text: _currentText,
      );

  @override
  void didChangeInputControl(
    TextInputControl? oldControl,
    TextInputControl? newControl,
  ) {}

  @override
  void insertTextPlaceholder(Size size) {}

  @override
  void performAction(TextInputAction action) {}

  @override
  void performPrivateCommand(String action, Map<String, dynamic> data) {}

  @override
  void performSelector(String selectorName) {}

  @override
  void removeTextPlaceholder() {}

  @override
  void showAutocorrectionPromptRect(int start, int end) {}

  @override
  void showToolbar() {}

  @override
  void updateEditingValue(TextEditingValue value) {}

  @override
  void updateFloatingCursor(RawFloatingCursorPoint point) {}

  @override
  void insertContent(KeyboardInsertedContent content) {}
}

// TextFormField(
// enabled: widget.enabled,
// textAlign: TextAlign.center,
// focusNode: widget.focusNodes[index],
// keyboardType: TextInputType.number,
// textInputAction: TextInputAction.next,
// maxLength: 1,
// style: const TextStyle(
// fontSize: 20,
// ),
// cursorColor: Colors.transparent,
// buildCounter: (
// context, {
// required currentLength,
// required isFocused,
// required maxLength,
// }) =>
// const SizedBox.shrink(),
// decoration: InputDecoration(
// hintText: '0',
// hintStyle: Theme.of(context)
//     .inputDecorationTheme
//     .hintStyle
//     ?.copyWith(fontSize: 20),
// contentPadding: EdgeInsets.zero,
// ),
// onChanged: (value) {
// if (isAdding) {
// if (index < widget.controllers.length - 1) {
// widget.focusNodes[index + 1].requestFocus();
// }
// } else {
// if (index > 0) {
// widget.focusNodes[index - 1].requestFocus();
// }
// }
// },
// ),
