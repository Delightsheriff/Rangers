import 'dart:async';

class Debouncer {
  // Constructor to set debounce delay time
  Debouncer({this.milliseconds = 1200});
  final int milliseconds;
  void Function()? action;
  Timer? _timer;

  // Run the debounce action
  void run(void Function() action) {
    // Cancel any existing timer
    if (_timer?.isActive ?? false) _timer?.cancel();

    // Create new timer to run the action after the debounce time
    _timer = Timer(Duration(milliseconds: milliseconds), action);
  }

  // Cancel the current debounce if needed
  void cancel() {
    _timer?.cancel();
  }

  // Check if the debounce is still active
  bool get isActive => _timer?.isActive ?? false;
}
